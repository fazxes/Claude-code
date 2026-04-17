type AudioDataHandler = (data: Buffer) => void
type AudioEndHandler = () => void

let recording = false

export function isNativeAudioAvailable(): boolean {
  return false
}

export function isNativeRecordingActive(): boolean {
  return recording
}

export function startNativeRecording(
  _onData: AudioDataHandler,
  _onEnd: AudioEndHandler,
): boolean {
  recording = false
  return false
}

export function stopNativeRecording(): void {
  recording = false
}
