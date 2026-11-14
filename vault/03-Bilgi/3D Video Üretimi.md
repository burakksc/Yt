---
tags: [bilgi, 3d, remotion, blender]
updated: 2026-11-14
---
# 3D video üretimi — öğrendiklerimiz
**Özet:** Anahtarsız, tamamen kodla 3D mümkün: Blender (bpy) ile model → GLB → Remotion three.js ile animasyon/render. Stil testi yapıldı ve beğenildi; kullanıcı şimdilik üretime geçmedi ("başka videolarda kullanabiliriz", 2026-11-14).

## Hazır olanlar
- **Stil testi (referans):** `video/src/videos/test-3d/` → kompozisyon `Test3D` (5 sn). Kil/oyuncak stili: pastel bebek odası, esnek sargılı anne + bebek (M pozisyonu), yumuşak gölge, yavaş kamera, nefes/göz kırpma. Yeni 3D videoya buradan başla.
- **Araçlar:** Blender 5.3 (`bpy`, `~/.venvs/bpy`) + köprü `scripts/3d/blender` (`source scripts/3d/env.sh`, kurulum `scripts/3d/setup.sh`, ortam açılışında otomatik). `@remotion/three` + three 0.187 + React Three Fiber 9.8.
- **Skill'ler:** [[yt-3d]] (bizim akışımız) + 23 `blender-*` (EL4CTEO, MIT).

## Kurallar / tuzaklar
- GPU yok → `remotion.config.ts`: `setChromiumOpenGlRenderer("swangle")`. Sadece swangle çalıştı (angle, swiftshader, egl, vulkan: WebGL açılmadı).
- Render ≈ **0,6 sn/kare** (1080×1920, gölgeli) → 1 dk video ≈ 18 dk. Önce kısa aralıkla ölç, kullanıcıya söyle.
- Animasyon sadece `useCurrentFrame()`; `useFrame()` yasak (titreme). Kamera: `useThree(s => s.camera)` + kareye göre konum.
- `TubeGeometry`'ye `g.scale()` uygulama — eğriyi de kaydırır (sargı bantları gövdenin içine girdi).
- Gölge lekeleri → `shadow-normalBias≈0.04`, `shadow-bias≈-0.0002`.
- Kadraj: karakter yüzünü bebek/obje örtmesin; kamera mesafesi 4.7–5.6, bakış y≈1.55 (insan boyu ~2.6 birim sahnede).
- Basit primitiflerden (küre/kapsül) karakter = "sevimli oyuncak"; daha profesyonel karakter için Blender'da subdivision/remesh ile organik model veya ileride Tripo/Meshy (anahtar gerekir).
- download.blender.org bu bulut ortamından erişilemez → `pip install bpy==5.3.0`.
- Üçüncü taraf `blender-*` script'lerini doğrudan çalıştırma otomatik izinde reddedildi → kendi bpy script'lerimizi yaz (`scripts/3d/models/<ad>.py`) ya da kullanıcıdan izin kuralı iste.

## Ne zaman 3D?
| Uygun | Uygun değil |
|---|---|
| Hikâyeli, sıcak, "premium" görünmesi gereken videolar; ürün/obje gösterimi; kamera hareketi istenen sahneler | Çok adımlı, metinle birebir senkron eğitim (2D daha hızlı ve net); kısa üretim süresi |

## Sonraki adım (istenirse)
Anne + bebek modelini Blender'da organik (subsurf/remesh) yap → GLB → `Test3D` sahnesine koy → esnek sargıyı 3D adım adım.

Bkz: [[Remotion Notları]], [[Bilgi MOC]], [[yt-3d]]
