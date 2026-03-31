// Stub: executor types (native Swift/Rust binding — not available in source map)
export interface DisplayGeometry {
  x: number;
  y: number;
  width: number;
  height: number;
  scaleFactor: number;
}

export interface FrontmostApp {
  bundleId: string;
  name: string;
  pid: number;
}

export interface InstalledApp {
  bundleId: string;
  name: string;
  path: string;
}

export interface RunningApp {
  bundleId: string;
  name: string;
  pid: number;
}

export interface ResolvePrepareCaptureResult {
  geometry: DisplayGeometry;
}

export interface ScreenshotResult {
  base64: string;
  width: number;
  height: number;
}

export interface ComputerExecutor {
  screenshot(geometry?: DisplayGeometry): Promise<ScreenshotResult>;
  click(x: number, y: number): Promise<void>;
  doubleClick(x: number, y: number): Promise<void>;
  rightClick(x: number, y: number): Promise<void>;
  tripleClick(x: number, y: number): Promise<void>;
  moveMouse(x: number, y: number): Promise<void>;
  drag(fromX: number, fromY: number, toX: number, toY: number): Promise<void>;
  scroll(x: number, y: number, deltaX: number, deltaY: number): Promise<void>;
  key(keys: string): Promise<void>;
  type(text: string): Promise<void>;
  getCursorPosition(): Promise<{ x: number; y: number }>;
  getDisplayGeometry(): Promise<DisplayGeometry>;
  getFrontmostApp(): Promise<FrontmostApp>;
  getInstalledApps(): Promise<InstalledApp[]>;
  getRunningApps(): Promise<RunningApp[]>;
  readClipboard(): Promise<string>;
  writeClipboard(text: string): Promise<void>;
  openApp(bundleId: string): Promise<void>;
  openUrl(url: string): Promise<void>;
}
