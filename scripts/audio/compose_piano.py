#!/usr/bin/env python3
"""Original, slow, sleep-friendly piano pieces (our own compositions -> no copyright issues),
rendered with a sampled grand piano (FluidR3_GM soundfont, MIT licence) via fluidsynth.

  python3 -I scripts/audio/compose_piano.py <style> --minutes 1 --out piano.m4a [--seed 1]
styles:
  arpeggio   D major, flowing broken chords (Dmaj7 Bm7 Gmaj7 A6sus), gentle top melody   ~68 bpm
  melancholy A minor, sparse long notes over open chords (Am9 Fmaj7 C G/B)               ~56 bpm
  waltz      3/4 calm waltz, bass + chord, modal melody (Gmaj7 / Dmaj7 alternating)      ~66 bpm
  lullaby    F major music-box-like lullaby, high register, very soft                     ~72 bpm
Endless: the chord loop repeats with random variations (melody, inversions, rests), never identical.
"""
import argparse
import os
import random
import subprocess
import tempfile

import mido

SF2 = "/usr/share/sounds/sf2/FluidR3_GM.sf2"
N = {"C": 0, "C#": 1, "D": 2, "D#": 3, "E": 4, "F": 5, "F#": 6, "G": 7, "G#": 8, "A": 9, "A#": 10, "B": 11}


def n(name, octave):
    return 12 * (octave + 1) + N[name]


STYLES = {
    "arpeggio": dict(bpm=68, beats=4, chords=[("D", [0, 4, 7, 11, 14]), ("B", [0, 3, 7, 10, 14]), ("G", [0, 4, 7, 11, 14]), ("A", [0, 5, 7, 9, 14])],
                     scale=["D", "E", "F#", "A", "B"], bass_oct=2, mel_oct=5, pattern="arp8", vel=(38, 58)),
    "melancholy": dict(bpm=56, beats=4, chords=[("A", [0, 7, 10, 14, 15]), ("F", [0, 7, 11, 16]), ("C", [0, 7, 12, 16]), ("G", [0, 7, 11, 14])],
                       scale=["A", "C", "D", "E", "G"], bass_oct=2, mel_oct=5, pattern="sparse", vel=(30, 52)),
    "waltz": dict(bpm=66, beats=3, chords=[("G", [0, 4, 7, 11]), ("D", [0, 4, 7, 11])], scale=["F#", "A", "B", "D", "E", "G"],
                  bass_oct=2, mel_oct=5, pattern="waltz", vel=(34, 54)),
    "lullaby": dict(bpm=72, beats=4, chords=[("F", [0, 4, 7]), ("D", [0, 3, 7]), ("A#", [0, 4, 7]), ("C", [0, 4, 7, 10])],
                    scale=["F", "G", "A", "C", "D"], bass_oct=3, mel_oct=6, pattern="lullaby", vel=(26, 44)),
}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("style", choices=STYLES)
    ap.add_argument("--minutes", type=float, default=1)
    ap.add_argument("--out", required=True)
    ap.add_argument("--seed", type=int, default=1)
    a = ap.parse_args()
    S = STYLES[a.style]
    R = random.Random(a.seed)
    tpb = 480
    mid = mido.MidiFile(ticks_per_beat=tpb)
    tr = mido.MidiTrack()
    mid.tracks.append(tr)
    tr.append(mido.MetaMessage("set_tempo", tempo=mido.bpm2tempo(S["bpm"])))
    tr.append(mido.Message("program_change", program=0, time=0))  # Acoustic Grand
    tr.append(mido.Message("control_change", control=91, value=70, time=0))  # reverb send
    events = []  # (tick, type, note, vel)

    def note(t, p, d, v):
        v = max(1, min(127, int(v + R.uniform(-4, 4))))
        t = max(0, int(t + R.uniform(-12, 12)))  # humanise
        events.append((t, 1, p, v))
        events.append((t + int(d), 0, p, 0))

    total_beats = a.minutes * S["bpm"]
    bar = S["beats"] * tpb
    t = 0
    lo, hi = S["vel"]
    prev_mel = None
    while t / tpb < total_beats:
        for root, ivs in S["chords"]:
            if t / tpb >= total_beats:
                break
            b = n(root, S["bass_oct"])
            note(t, b, bar * 0.95, hi - 6)  # bass
            voices = [b + 12 + i for i in ivs]
            pat = S["pattern"]
            if pat == "arp8":
                seq = voices + voices[-2:0:-1]
                for k in range(8):
                    note(t + k * tpb // 2, seq[k % len(seq)], tpb * 1.5, R.uniform(lo, hi - 8))
            elif pat == "sparse":
                for v_ in voices[:3]:
                    note(t + R.choice([0, 0, tpb // 4]), v_, bar * 0.98, lo + 6)
            elif pat == "waltz":
                for k in (1, 2):
                    for v_ in voices[1:4]:
                        note(t + k * tpb, v_, tpb * 0.9, lo + 4)
            elif pat == "lullaby":
                for k in range(4):
                    note(t + k * tpb, voices[k % len(voices)], tpb * 1.8, lo + 2)
            # melody: a few notes per bar from the scale, stepwise, sometimes resting
            if R.random() < 0.85:
                nm = R.choice([1, 2, 2, 3]) if pat != "sparse" else R.choice([1, 1, 2])
                pos = sorted(R.sample(range(S["beats"] * 2), nm))
                for ps in pos:
                    cands = [n(s, S["mel_oct"]) for s in S["scale"]] + [n(s, S["mel_oct"] + 1) for s in S["scale"][:2]]
                    if prev_mel is not None:
                        cands = sorted(cands, key=lambda c: abs(c - prev_mel))[:4]
                    m = R.choice(cands)
                    prev_mel = m
                    note(t + ps * tpb // 2, m, tpb * R.choice([1.5, 2, 3]), R.uniform(hi - 6, hi + 4))
            t += bar
    events.sort(key=lambda e: (e[0], e[1]))
    last = 0
    for tick, on, p, v in events:
        tr.append(mido.Message("note_on" if on else "note_off", note=p, velocity=v, time=tick - last))
        last = tick
    d = tempfile.mkdtemp()
    mpath, wpath = os.path.join(d, "p.mid"), os.path.join(d, "p.wav")
    mid.save(mpath)
    subprocess.run(["fluidsynth", "-ni", "-g", "0.6", "-r", "48000", "-R", "1", "-F", wpath, SF2, mpath], check=True,
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", wpath, "-t", str(a.minutes * 60),
                    "-af", "aecho=0.8:0.7:60|120:0.25|0.15,lowpass=f=9000,loudnorm=I=-24:TP=-3,afade=t=in:d=2",
                    "-c:a", "aac", "-b:a", "192k", a.out], check=True)
    print("ok", a.out)


if __name__ == "__main__":
    main()
