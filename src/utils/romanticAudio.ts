// Web Audio API Synthesizer - Disabled as requested
class RomanticAudioSynthesizer {
  public toggle(): boolean {
    return false;
  }
  public getIsPlaying(): boolean {
    return false;
  }
  public start() {}
  public playChime() {}
  public playWhoosh() {}
  public setVolume(_vol: number) {}
}

export const romanticAudio = new RomanticAudioSynthesizer();
