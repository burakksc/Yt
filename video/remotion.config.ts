/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import fs from "node:fs";
import { Config } from "@remotion/cli/config";

Config.setRspack(true);
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setDefaultPremountInSeconds(2);

// Cloud/CI ortamlarinda onceden kurulu Chromium varsa onu kullan
// (headless shell indirmeye gerek kalmaz).
const preinstalledChromium = "/opt/pw-browsers/chromium";
if (fs.existsSync(preinstalledChromium)) {
  Config.setBrowserExecutable(preinstalledChromium);
}
