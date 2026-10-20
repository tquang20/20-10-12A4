const musicSource = new URL(
  "../../YTSave.to_YouTube_Media_jPjQJYKhhk4_Phép-Màu-Đàn-Cá-Gỗ-OST-Mounter-x-MAYDAYs-Minh-Tốc-Official-MV_010_256k.m4a",
  import.meta.url,
).href;

class RomanticAudioPlayer {
  private audio: HTMLAudioElement | null = null;
  private playing = false;
  private readonly volume = 0.1;
  private userMuted = false;

  private getAudio() {
    if (typeof Audio === "undefined") return null;
    if (!this.audio) {
      this.audio = new Audio(musicSource);
      this.audio.loop = true;
      this.audio.preload = "auto";
      this.audio.volume = this.volume;
      this.audio.addEventListener("play", () => { this.playing = true; });
      this.audio.addEventListener("pause", () => { this.playing = false; });
      this.audio.addEventListener("ended", () => { this.playing = false; });
    }
    return this.audio;
  }

  public toggle(): boolean {
    const audio = this.getAudio();
    if (!audio) return false;
    if (audio.paused) {
      this.userMuted = false;
      audio.volume = this.volume;
      void audio.play().catch(() => { this.playing = false; });
      this.playing = true;
    } else {
      audio.pause();
      this.playing = false;
      this.userMuted = true;
    }
    return this.playing;
  }

  public getIsPlaying(): boolean {
    return this.playing;
  }

  public async start(): Promise<boolean> {
    const audio = this.getAudio();
    if (!audio) return false;
    if (this.userMuted) return false;
    audio.volume = this.volume;
    try {
      await audio.play();
      this.playing = true;
    } catch {
      // Audible autoplay is blocked until the first user gesture by browsers.
      this.playing = false;
    }
    return this.playing;
  }

  public playChime() {}
  public playWhoosh() {}
  public setVolume(volume: number) {
    if (this.audio) this.audio.volume = Math.max(0, Math.min(1, volume));
  }
}

export const romanticAudio = new RomanticAudioPlayer();
