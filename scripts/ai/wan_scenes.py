"""Generate AI scenes: FLUX.1-schnell first frame -> Wan 2.2 I2V clip, via free HF Spaces.
Usage: python3 -I scripts/ai/wan_scenes.py <scenes.json> <out_dir>
scenes.json: [{"id": "...", "image": "...", "motion": "..."}]. Skips scenes already done.
HF token is injected by the network proxy (never in code)."""
import json, os, shutil, sys, time
from gradio_client import Client, handle_file

NEG = ("static, blurry, distorted face, extra limbs, extra fingers, deformed hands, text, "
       "watermark, subtitles, low quality, modern clothes")


def main(spec, out):
    scenes = json.load(open(spec))
    os.makedirs(out, exist_ok=True)
    flux = wan = None
    for s in scenes:
        img, vid = f"{out}/{s['id']}.webp", f"{out}/{s['id']}.mp4"
        if not os.path.exists(img):
            flux = flux or Client("black-forest-labs/FLUX.1-schnell", verbose=False)
            res, _ = flux.predict(s["image"], s.get("seed", 7), False, 576, 1024, 4, api_name="/infer")
            shutil.copy(res["path"] if isinstance(res, dict) else res, img)
            print("image", s["id"], flush=True)
        if not os.path.exists(vid):
            wan = wan or Client("zerogpu-aoti/wan2-2-fp8da-aoti-faster", verbose=False)
            t = time.time()
            v, _ = wan.predict(handle_file(img), s["motion"], 6, NEG, s.get("sec", 5), 1, 1, 42, False,
                               api_name="/generate_video")
            shutil.copy(v["video"] if isinstance(v, dict) else v, vid)
            print("video", s["id"], f"{time.time() - t:.0f}s", flush=True)
    print("ALL DONE", flush=True)


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
