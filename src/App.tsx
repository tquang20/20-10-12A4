import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Heart, RotateCcw, Volume2, VolumeX, Mail, Sparkles } from "lucide-react";
import { Album3D, DEFAULT_PHOTOS, type PhotoItem } from "./components/Album3D";
import { FlowerVeilCanvas } from "./components/FlowerVeilCanvas";
import { LoveLetterStage } from "./components/LoveLetterStage";
import { BouquetCreator } from "./components/BouquetCreator";
import { romanticAudio } from "./utils/romanticAudio";

function FallingPetals() {
  const petals = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 12,
        duration: 8 + Math.random() * 10,
        size: 10 + Math.random() * 18,
      })),
    [],
  );
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-10" aria-hidden>
      {petals.map((p) => (
        <span
          key={p.id}
          className="petal"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function App() {
  const [photos] = useState<PhotoItem[]>(DEFAULT_PHOTOS);
  const [open, setOpen] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isBouquetOpen, setIsBouquetOpen] = useState(false);

  // App Stage:
  // 1. 'flower_intro': Blooming floral veil covering screen -> User clicks "Tiếp tục" -> Flowers cascade down
  // 2. 'love_letter': The romantic envelope & typed love letter (giây 33 -> hết video)
  // 3. 'album_web': User clicks [X] to close the letter and enter the full repo web page
  const [currentStage, setCurrentStage] = useState<'flower_intro' | 'love_letter' | 'album_web'>('flower_intro');
  const [isLetterVisible, setIsLetterVisible] = useState(false);

  const toggleAudio = useCallback(() => {
    const newState = romanticAudio.toggle();
    setIsAudioPlaying(newState);
  }, []);

  // When flowers are almost done falling, reveal and pop the love letter
  const handleNearFinish = useCallback(() => {
    setIsLetterVisible(true);
  }, []);

  // When flowers finish falling down completely, advance to love_letter stage
  const handleRevealFinished = useCallback(() => {
    setCurrentStage('love_letter');
    setIsLetterVisible(true);
  }, []);

  // When user closes the love letter [X], advance to the full album web app
  const handleCloseLoveLetter = useCallback(() => {
    setCurrentStage('album_web');
    setIsLetterVisible(false);
  }, []);

  // Re-open letter from top bar
  const handleOpenLoveLetter = useCallback(() => {
    setCurrentStage('love_letter');
    setIsLetterVisible(true);
  }, []);

  // Replay flower blooming intro from the start
  const triggerReplay = useCallback(() => {
    setCurrentStage('flower_intro');
    setIsLetterVisible(false);
    setReplayKey((k) => k + 1);
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-[#050008] text-[#2b1016]">
      {/* Background Falling Petals only when viewing the album web */}
      {currentStage === 'album_web' && <FallingPetals />}

      {/* Main Autumn Album Delight Section:
          Only visible and interactive when currentStage === 'album_web'! */}
      {currentStage === 'album_web' && (
        <main
          className="festive-bg relative min-h-screen overflow-hidden pb-20 opacity-100 pointer-events-auto visible"
          aria-hidden="false"
        >
        <section className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col items-center px-4 py-12">
          {/* Header Controls Bar */}
          <div className="w-full max-w-5xl flex items-center justify-end mb-2 px-2">
            <div className="main-header-actions flex flex-wrap items-center justify-end gap-2.5">
              {/* Button to Re-read Love Letter */}
              <button
                onClick={handleOpenLoveLetter}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-300 text-xs font-medium backdrop-blur-md transition-all shadow-sm hover:scale-105 cursor-pointer"
                title="Mở lại bức thư chúc mừng 20/10"
              >
                <Mail className="w-3.5 h-3.5 text-rose-600" />
                <span className="hidden sm:inline">Bức thư 20/10 💌</span>
              </button>

              {/* Button to Create Custom Bouquet */}
              <button
                onClick={() => setIsBouquetOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-rose-500/95 via-rose-600/95 to-pink-500/95 hover:from-rose-600 hover:to-pink-600 text-white border border-rose-300 text-xs font-semibold backdrop-blur-md transition-all shadow-sm hover:scale-105 cursor-pointer"
                title="Tự tay tạo bó hoa cho riêng mình 20/10"
              >
                <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
                <span className="hidden sm:inline">Tạo bó hoa cho riêng mình 💐</span>
              </button>

              {/* Replay Bloom Effect */}
              <button
                onClick={triggerReplay}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white text-xs font-semibold transition-all shadow-md hover:scale-105 cursor-pointer"
                title="Xem lại hiệu ứng muôn vàn hoa nở rộ & thác rơi"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Xem lại hoa nở 🌸</span>
              </button>
            </div>
          </div>

          <p
            className="reveal text-sm uppercase tracking-[0.4em] text-muted-foreground mt-4"
            style={{ animationDelay: "0.2s" }}
          >
            Ngày Phụ nữ Việt Nam
          </p>

          <h1
            className="font-script mt-2 flex flex-wrap justify-center gap-x-[0.3em] text-center text-4xl sm:text-6xl md:text-8xl text-rose-950 font-bold"
            aria-label="Chúc mừng 20/10"
          >
            {["Chúc", "mừng", "20/10"].map((word, w, arr) => {
              const offset = arr.slice(0, w).join("").length + w;
              return (
                <span key={`word-${w}`} className="whitespace-nowrap">
                  {word.split("").map((c, i) => (
                    <span
                      key={`char-${w}-${i}`}
                      className="letter"
                      style={{ animationDelay: `${0.3 + (offset + i) * 0.08}s` }}
                    >
                      {c}
                    </span>
                  ))}
                </span>
              );
            })}
          </h1>

          <p
            className="reveal font-vietnam mt-5 flex max-w-xl items-center justify-center gap-2 px-4 text-center text-base sm:text-lg font-semibold text-rose-900"
            style={{ animationDelay: "0.8s" }}
          >
            <span>Lời chúc đến các bạn nữ xinh đẹp lớp 12A4</span>
            <Heart className="h-5 w-5 fill-rose-500 text-rose-500" aria-hidden="true" />
          </p>

          <p
            className="reveal font-vietnam mx-auto mt-4 max-w-xl text-center text-foreground/80 text-sm md:text-base leading-relaxed"
            style={{ animationDelay: "1.0s" }}
          >
            Gửi tới những người phụ nữ tuyệt vời của 12A4 — luôn xinh đẹp, hạnh phúc và tràn đầy yêu thương trên mọi nẻo đường tương lai.
          </p>

          {/* 3D Luxury Album Component from the repository */}
          <div className="w-full mt-6">
            <Album3D
              photos={photos}
              isOpen={open}
              setIsOpen={setOpen}
            />
          </div>
        </section>
        </main>
      )}

      {/* Stage 2: The Romantic Envelope & Typed Love Letter (Giây 33 -> hết video)
          Chỉ xuất hiện khi hoa sắp rơi xuống hết, mờ dần rồi nảy ra kiêu hãnh */}
      {isLetterVisible && currentStage !== 'album_web' && (
        <LoveLetterStage
          key={`letter-${replayKey}`}
          onCloseLetter={handleCloseLoveLetter}
        />
      )}

      {/* Stage 1: The Hyper-Realistic Blooming Floral Veil & Cascading Waterfall */}
      {currentStage === 'flower_intro' && (
        <FlowerVeilCanvas
          key={`canvas-${replayKey}`}
          speedMultiplier={1.0}
          densityFactor={1.0}
          onNearFinish={handleNearFinish}
          onRevealFinished={handleRevealFinished}
        />
      )}

      {/* 20/10 Bouquet Creator Flow */}
      <BouquetCreator
        isOpen={isBouquetOpen}
        onClose={() => setIsBouquetOpen(false)}
      />
    </div>
  );
}
