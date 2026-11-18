export type CikTag = "FACT" | "GERÇEK" | "";
export type CikSceneId =
  | "hook"
  | "tree"
  | "ferment"
  | "roast"
  | "conche"
  | "temper"
  | "loop";
export type CikScene = {
  id: CikSceneId;
  sec: number; // scene length
  vsec: number; // narration length
  title: string;
  tag: CikTag;
  text: string;
};
export const CIK_FPS = 30;
export const CIK_LEAD = 0.25;
export const cikFrames = (s: CikScene[]) =>
  Math.round(s.reduce((a, x) => a + x.sec, 0) * CIK_FPS);
