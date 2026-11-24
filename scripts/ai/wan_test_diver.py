import shutil,sys
from gradio_client import Client, handle_file
out=sys.argv[1]
img_prompt=("Cinematic underwater photograph, vertical. An ancient Roman free diver (urinator), bare-chested, short dark hair, "
 "loincloth, holding his breath, descends through clear turquoise Mediterranean water clutching a heavy stone weight tied to a rope. "
 "A woven net bag at his waist holds murex sea snail shells and natural sponges. Sunbeams pierce the surface above, where the dark hull "
 "of a small wooden Roman boat floats. Rocky seabed with sea grass below, small fish, bubbles. Photorealistic, 35mm film, documentary, "
 "highly detailed, natural light, no text.")
f=Client("black-forest-labs/FLUX.1-schnell",verbose=False)
res,seed=f.predict(img_prompt,7,False,576,1024,4,api_name="/infer")
p=res["path"] if isinstance(res,dict) else res
shutil.copy(p,f"{out}/frame.webp"); print("image ok",p,seed,flush=True)
w=Client("zerogpu-aoti/wan2-2-fp8da-aoti-faster",verbose=False)
vid_prompt=("The Roman diver sinks slowly downward pulled by the stone weight, bubbles stream from his nose and rise, sunbeams shimmer "
 "and ripple, his hair drifts in the water, small fish swim past, camera slowly follows him down. Realistic underwater motion, cinematic.")
v,s=w.predict(handle_file(f"{out}/frame.webp"),vid_prompt,6,
  "static, blurry, distorted face, extra limbs, text, watermark, low quality, deformed hands",5,1,1,42,False,api_name="/generate_video")
vp=v["video"] if isinstance(v,dict) else v
shutil.copy(vp,f"{out}/clip.mp4"); print("video ok",vp,flush=True)
