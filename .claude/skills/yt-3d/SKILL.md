---
name: yt-3d
description: Kanal videoları için 3D — Blender (bpy 5.3) ile kodla model/sahne üretimi (karakter, bebek, sargı, oda, prop), GLB dışa aktarma ve Remotion'da three.js (@remotion/three) ile animasyon + render. "3D", "3 boyutlu", "modelleme", "Blender", "GLB", "3D karakter", "3D sahne" denildiğinde kullan. Dış blender-* skill'lerine yönlendirir.
metadata:
  version: 1.0.0
---
# YT 3D — Blender → GLB → Remotion

## Önce hafıza
- `vault/02-Kanal/Marka Rehberi.md` (stil, maskot, renkler), ilgili video notu.
- `vault/03-Bilgi/Remotion Notları.md` → 3D tuzakları (swangle, TubeGeometry ölçek, useFrame yasak).

## Araç zinciri (kurulu)
| Parça | Ne | Nasıl |
|---|---|---|
| Blender 5.3 | `bpy` modülü `~/.venvs/bpy` + `scripts/3d/blender` köprüsü | `source scripts/3d/env.sh` → `$BLENDER_EXE -b --python-expr "..."` veya `-P script.py -- args` |
| Blender bilgisi | 23 dış skill `blender-*` (EL4CTEO, MIT) | Önce `blender-core`; modelleme `blender-sculpting`, materyal `blender-pbr-materials`/`blender-stylized-npr`, rig `blender-character-rigging`, kumaş `blender-simulation`/`blender-clothing`, export `blender-export-pipelines`, **her modelden sonra `blender-asset-qa`** |
| Video | Remotion + `@remotion/three` + `three` + `@react-three/fiber` | `<ThreeCanvas>`; GLB: `three/examples/jsm/loaders/GLTFLoader` |
| GPU yok | Chromium yazılımsal GL | `remotion.config.ts` → `setChromiumOpenGlRenderer("swangle")`; ~0,6 sn/kare |
Kurulum yoksa: `scripts/3d/setup.sh` (idempotent). Masaüstünde gerçek Blender 5.3 kuruluysa `env.sh` onu tercih eder.

## Akış
1. **Stil kararı:** Marka Rehberi; yeni stil ise 1 sahnelik stil testi + kullanıcı onayı (`video/src/videos/test-3d/` örneği).
2. **Model (Blender, kodla):** `scripts/3d/models/<ad>.py` — her model bir Python script'i (tekrarlanabilir, git'te). Organik şekiller: metaball / subdivision / voxel remesh + smooth (sculpting skill'indeki headless-safe ops). Gerçek ölçek (1 birim = 1 m), origin ayaklarda, isimler `SM_`/`M_`.
3. **Materyal:** Kil/oyuncak görünüm = Principled BSDF, roughness 0.7–0.9, metallic 0; kumaş için ince tekrar eden doku. glTF'ye taşınabilen node'lar kullan (blender-pbr-materials).
4. **Rig/animasyon (gerekiyorsa):** Basit hareket Remotion'da (transform). Karmaşık (kol bükme, sargı bağlama) → Blender'da armature + action, GLB içinde animasyon olarak dışa aktar, Remotion'da `AnimationMixer.setTime(frame / fps)` ile **kareye bağlı** oynat.
5. **QA:** `blender-asset-qa` kuralları (normal, manifold, ölçek, z-fighting) + render önizleme.
6. **Export:** `video/public/<slug>/models/<ad>.glb` (blender-export-pipelines web/GLB ön ayarı, Draco yok — basit tut).
7. **Remotion:** GLB'yi `staticFile()` ile yükle; ışık + gölge + kamera `useCurrentFrame()` ile. Kontrol karesi al ve **bak**.
8. **Render:** önce `--frames=0-29` ile süre ölç, kullanıcıya tahmini söyle; uzunsa arka planda.

## Kurallar
- Animasyon sadece `useCurrentFrame()` ile; `useFrame()` yasak (titreme).
- Doğruluk gereken eğitim adımları (ör. sargı bağlama) kaynaktaki sıraya birebir uymalı; 3D güzel görünsün diye adım uydurma.
- `TubeGeometry` vb. geometrilere `g.scale()` uygulama — eğri de taşınır; kalınlık için geometri parametresi kullan.
- Üçüncü taraf skill script'lerini (blender-* `scripts/`) çalıştırmak bu ortamda izin gerektirebilir; reddedilirse atlatmaya çalışma, kullanıcıya söyle ve kendi bpy script'imizle ilerle.

## Gelecek (anahtar/hesap gelince)
- **AI model üretimi:** Tripo (`Tripo-Developer/tripo-mcp`, resmi MCP) veya Meshy MCP → GLB → aynı akışın 5–8. adımları. Önce `blender-workflow-recipes` → "AI mesh cleanup" ile temizle.
- **Canlı Blender (kullanıcının bilgisayarı):** `ahujasid/mcp-for-blender` eklentisi + MCP sunucusu → Claude Blender arayüzünü canlı yönetir.

## Kalite kriterleri
- Model script'i git'te, tekrar çalıştırınca aynı GLB çıkıyor.
- QA temiz; kontrol karelerinde gölge kusuru, kesişen parça, yüzü örten nesne yok.
- Render süresi önceden ölçülüp söylendi.

## Sonra
`vault-memory` → `retro`. Sıradaki: `yt-video` (sahne/altyazı katmanı) → render.

## Öğrenilenler
- swangle tek çalışan yazılımsal GL modu (angle, swiftshader, egl, vulkan çalışmadı). (2026-11-14)
- download.blender.org bu ortamdan erişilemez → `pip install bpy==5.3.0`. (2026-11-14)

## Changelog
- 1.0.0 (2026-11-14): ilk sürüm — 3D stil testi + araç zinciri kurulumu.
