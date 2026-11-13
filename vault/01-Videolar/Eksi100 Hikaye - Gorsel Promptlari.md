---
tags: [video, prompt, gorsel]
video: "[[2026-11-13 -100°C'de Neler Olur]]"
---
# Eksi100 Hikâye — AI arka plan prompt'ları

**Nasıl kullanılır**
1. Her prompt'u ChatGPT (görsel), Midjourney veya benzeri bir araçta **dikey 9:16** üret (Midjourney: sonuna `--ar 9:16`).
2. Dosyayı sahne adıyla kaydet: `video/public/eksi-100-hikaye/bg/<sahne>.png` (ör. `pencere.png`).
3. Hiçbir kodu değiştirmeye gerek yok: Remotion dosyayı görür, o sahnede SVG çizimin yerine görseli koyar. Karakter, kar, ışık, altyazı ve kamera hareketi üstüne biner.

**Kurallar (hepsinde aynı tut):**
- İnsan/figür **olmasın** (karakterimizi kod çiziyor).
- Yazı/logo **olmasın**.
- Alt-orta kısım (karakterin duracağı yer) sade kalsın; altyazı en alttaki ~%25'lik alana gelecek.
- Aynı stil hepsinde: aşağıdaki ortak stil cümlesini her prompt'un sonuna ekle.

**Ortak stil (her prompt'un sonuna):**
> 2D digital illustration, detailed storybook style, soft painterly shading, muted cold blue palette with warm orange window lights, gentle atmospheric depth and haze, cinematic lighting, clean shapes, high detail, no people, no text, vertical 9:16 composition, empty uncluttered space in the lower center

| Sahne | Dosya | Prompt |
|---|---|---|
| 1 · Pencere | `bg/pencere.png` | View from inside an apartment through a large window at dusk onto a frozen city: a tall snow-covered Soviet-style apartment block with many warm lit windows on the right, smaller snowy buildings and leafless trees, a frozen river and a distant skyline with a church spire against an orange horizon, street lamps glowing on snowy paths, a snow-buried car in a parking lot; the left edge shows a cream window frame with an old analog thermometer mounted on it |
| 2 · Kapı | `bg/kapi.png` | Night exterior of an apartment building entrance in extreme cold, the front door wide open with warm golden light spilling onto deep fresh snow, frost-covered facade with a few lit windows, a single street lamp glowing, a bare frosted tree, starry clear sky, ice crystals glittering in the air |
| 3 · Araba | `bg/araba.png` | Snowy apartment parking lot at night, two tall residential blocks with warm lit windows in the background, a dark SUV completely frosted and half buried in snow in the center, frozen parking lines barely visible, street lamps casting pools of warm light, bare trees with snow on branches |
| 4 · Elektrik | `bg/elektrik.png` | Wide city street at night in deep freeze, rows of apartment blocks on both sides, wooden utility poles with power lines thickly coated in ice sagging under the weight, a few windows still lit, clear starry sky, glittering ice everywhere, empty snowy road in the center |
| 5 · Borular | `bg/borular.png` | Interior of a cold apartment kitchen, tiled wall, an old white cast-iron radiator under a window, a vertical metal water pipe running along the wall coated in frost and ice, dark frozen city visible through the window, frost on the window glass, wooden floor, dim cold blue light |
| 6 · Telefon | `bg/telefon.png` | Dark cold room at night, out of focus background of a frosted window with a faint city glow, soft bokeh, deep blue tones, frost patterns at the edges, mostly empty dark center (a phone will be placed in the middle) |
| 7 · Soba | `bg/soba.png` | Cozy small room with a tall white tiled masonry stove (kachelofen) on the left with a cast-iron door and a metal chimney pipe, a wooden crate full of firewood on the floor, warm orange firelight on the walls, wooden floorboards, a small frosted window on the right showing a cold blue night outside |
| 8 · Rekor | `bg/rekor.png` | Antarctic polar plateau at night, endless flat ice and snow, a tiny distant research station with small huts and a radio mast with a red light, vivid green and purple aurora across a deep starry sky, extremely cold atmosphere |

> Not: Sahne 6'da (telefon) ve 8'de (rekor) görsel isteğe bağlı; kodla çizilen hali de yeterli.

Bkz: [[2026-11-13 -100°C'de Neler Olur]]
