// Stub: sub-gate constants for computer use permissions
import type { CuSubGates } from "./types.js";

export const ALL_SUB_GATES_OFF: CuSubGates = {
  allowClicks: false,
  allowKeys: false,
  allowScroll: false,
  allowScreenshots: false,
  allowDrag: false,
  allowClipboard: false,
  allowOpenApp: false,
  allowOpenUrl: false,
};

export const ALL_SUB_GATES_ON: CuSubGates = {
  allowClicks: true,
  allowKeys: true,
  allowScroll: true,
  allowScreenshots: true,
  allowDrag: true,
  allowClipboard: true,
  allowOpenApp: true,
  allowOpenUrl: true,
};
