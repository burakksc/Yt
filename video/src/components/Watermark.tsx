import React from "react";
import { Img, staticFile } from "remotion";

/** Small channel logo, bottom-right (all vertical Shorts). Sits above the Shorts UI strip. */
export const Watermark: React.FC<{ size?: number; right?: number; top?: number; opacity?: number }> = ({
  size = 120,
  right = 36,
  top = 1760,
  opacity = 0.9,
}) => (
  <Img
    src={staticFile("brand/logo-round.png")}
    style={{ position: "absolute", right, top, width: size, height: size, opacity, borderRadius: "50%", boxShadow: "0 2px 10px rgba(0,0,0,0.5)" }}
  />
);
