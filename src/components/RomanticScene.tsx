import React, { useState } from 'react';
import { Heart, Calendar, Mail, Volume2, VolumeX, Sparkles, X, Image as ImageIcon, Music } from 'lucide-react';
import { romanticAudio } from '../utils/romanticAudio';

import coupleSunset from '../assets/images/couple_sunset_walk_1792331111289.jpg';
import coupleCafe from '../assets/images/couple_cafe_smile_1792331111491.jpg';
import galaxyBg from '../assets/images/galaxy_nebula_bg_1792331110164.jpg';

interface RomanticSceneProps {
  partnerName?: string;
  senderName?: string;
  specialDate?: string;
  letterMessage?: string;
  onReplayRequest?: () => void;
}

export const RomanticScene: React.FC<RomanticSceneProps> = ({
  partnerName = 'Em Yêu',
  senderName = 'Anh',
  specialDate = '20 Tháng 10',
  letterMessage = 'Cảm ơn em đã bước vào cuộc đời anh, mang đến ánh sáng dịu dàng và những nụ cười ấm áp nhất. Nguyện mãi nắm chặt tay em, cùng em đi qua vạn dặm yêu thương!',
  onReplayRequest,
}) => {
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(romanticAudio.getIsPlaying());

  const toggleAudio = () => {
    const newState = romanticAudio.toggle();
    setIsAudioPlaying(newState);
  };

  // Heart mosaic tiles
  const heartTiles = [
    { id: 1, img: coupleSunset, caption: 'Buổi chiều hoàng hôn ngọt ngào bên biển' },
    { id: 2, img: coupleCafe, caption: 'Tiếng cười rộn rã tại quán quen' },
    { id: 3, img: coupleSunset, caption: 'Nắm tay em đi qua mọi cung đường' },
    { id: 4, img: coupleCafe, caption: 'Ánh mắt em là cả bầu trời của anh' },
  ];

  return (
    <div className="relative w-full min-h-screen overflow-hidden flex flex-col items-center justify-between p-4 md:p-8 select-none">
      {/* Background celestial universe */}
      <div
        className="absolute inset-0 bg-cover bg-center -z-20 transition-opacity duration-1000 scale-105"
        style={{ backgroundImage: `url(${galaxyBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-purple-950/40 to-black/80 -z-10" />

      {/* Top Header Zone */}
      <header className="w-full max-w-4xl flex items-center justify-between z-10 pt-2 pb-4">
        <div className="flex items-center gap-3">
          <span className="font-script text-3xl md:text-4xl text-pink-300 font-bold drop-shadow-[0_0_12px_rgba(244,114,182,0.8)]">
            {senderName}
          </span>
          <Heart className="w-6 h-6 text-rose-500 fill-rose-500 animate-pulse" />
          <span className="font-script text-3xl md:text-4xl text-pink-300 font-bold drop-shadow-[0_0_12px_rgba(244,114,182,0.8)]">
            {partnerName}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Music player toggle */}
          <button
            onClick={toggleAudio}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-900/40 hover:bg-pink-800/60 border border-pink-500/40 text-pink-200 text-xs font-medium backdrop-blur-md transition-all shadow-md cursor-pointer"
            title={isAudioPlaying ? 'Tắt nhạc nền' : 'Bật nhạc nền lãng mạn'}
          >
            {isAudioPlaying ? (
              <>
                <Volume2 className="w-4 h-4 text-pink-300 animate-pulse" />
                <span className="hidden sm:inline">Giai điệu tình yêu 🎵</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-pink-400/70" />
                <span className="hidden sm:inline">Phát nhạc 🎵</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Center Main Stage */}
      <main className="w-full max-w-5xl flex-1 flex flex-col items-center justify-center my-4 z-10">
        {/* Occasion Banner */}
        <div className="text-center mb-6 animate-in fade-in slide-in-from-top-4 duration-700">
          <p className="text-xs md:text-sm tracking-[0.25em] uppercase text-pink-300/80 font-medium mb-1 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-pink-300" />
            <span>Kỷ Niệm Đẹp Đẽ</span>
            <Sparkles className="w-4 h-4 text-pink-300" />
          </p>
          <h1 className="font-serif-luxury text-3xl md:text-5xl lg:text-6xl text-white font-bold tracking-tight drop-shadow-[0_0_20px_rgba(244,114,182,0.5)]">
            Mãi Mãi Bên Nhau
          </h1>
        </div>

        {/* Dynamic Display Grid: Heart Mosaic & Calendar & Letter */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full items-center">
          {/* Left: Interactive Heart Photo Mosaic */}
          <div className="md:col-span-7 flex flex-col items-center justify-center">
            <div className="relative p-6 rounded-3xl bg-pink-950/20 backdrop-blur-md border border-pink-500/20 shadow-[0_0_35px_rgba(236,72,153,0.15)] w-full max-w-md">
              <div className="flex items-center justify-between mb-4 border-b border-pink-500/20 pb-2">
                <span className="text-xs uppercase tracking-wider text-pink-300/90 font-medium flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-pink-400" />
                  Khoảnh Khắc Hạnh Phúc
                </span>
                <span className="text-xs text-pink-400/80 font-mono">Trọn đời</span>
              </div>

              {/* Photos collage layout */}
              <div className="grid grid-cols-2 gap-3">
                {heartTiles.map(tile => (
                  <div
                    key={tile.id}
                    onClick={() => setSelectedPhoto(tile.img)}
                    className="group relative aspect-4/3 rounded-xl overflow-hidden cursor-pointer border border-pink-400/30 shadow-md hover:scale-[1.03] transition-all duration-300"
                  >
                    <img
                      src={tile.img}
                      alt={tile.caption}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2.5">
                      <p className="text-[11px] text-pink-100 leading-tight">
                        {tile.caption}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-3 text-center text-xs text-pink-300/70 italic">
                Nhấp vào ảnh để xem chi tiết khoảnh khắc ngọt ngào ✨
              </p>
            </div>
          </div>

          {/* Right: Romantic Calendar & Envelope */}
          <div className="md:col-span-5 flex flex-col gap-4 w-full max-w-md mx-auto">
            {/* Calendar Card */}
            <div className="p-5 rounded-2xl bg-pink-950/30 backdrop-blur-md border border-pink-500/25 shadow-lg">
              <div className="flex items-center justify-between mb-3 text-pink-200">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-pink-400" />
                  <span className="text-sm font-semibold tracking-wide">
                    Ngày Đặc Biệt Của Chúng Ta
                  </span>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-pink-500/30 text-pink-200">
                  {specialDate}
                </span>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-xs font-mono text-pink-300/80 py-2">
                <span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>T7</span><span className="text-pink-400">CN</span>
                <span className="text-pink-600/50">28</span><span className="text-pink-600/50">29</span><span className="text-pink-600/50">30</span>
                <span>1</span><span>2</span><span>3</span><span>4</span>
                <span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>10</span><span>11</span>
                <span>12</span><span>13</span><span>14</span><span>15</span><span>16</span><span>17</span><span>18</span>
                <span>19</span>
                {/* Highlighted special day */}
                <span className="relative flex items-center justify-center">
                  <span className="absolute inset-0 bg-rose-500 rounded-full animate-ping opacity-75" />
                  <span className="relative w-6 h-6 rounded-full bg-rose-500 text-white font-bold flex items-center justify-center shadow-lg">
                    20
                  </span>
                </span>
                <span>21</span><span>22</span><span>23</span><span>24</span><span>25</span>
              </div>
            </div>

            {/* Envelope "Gửi em!" */}
            <div
              onClick={() => setIsLetterOpen(true)}
              className="group p-5 rounded-2xl bg-gradient-to-r from-pink-900/40 via-rose-900/30 to-purple-900/40 hover:from-pink-800/50 hover:to-purple-800/50 backdrop-blur-md border border-pink-400/40 shadow-lg cursor-pointer transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-pink-500/20 border border-pink-400/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Mail className="w-6 h-6 text-pink-300" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-white group-hover:text-pink-200 transition-colors flex items-center gap-2">
                    <span>Gửi {partnerName}! 💌</span>
                  </h3>
                  <p className="text-xs text-pink-300/80 mt-0.5 line-clamp-1">
                    Bức thư tình yêu anh viết riêng dành tặng em...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Romantic Subtitles Lyrics */}
      <footer className="w-full max-w-3xl text-center py-2 z-10">
        <p className="font-script text-lg md:text-xl text-pink-200/90 tracking-wider drop-shadow-md">
          “ Cầm tay anh, tựa vai anh... Nguyện mãi bên cạnh nhau, yêu say đắm như ngày đầu ”
        </p>
      </footer>

      {/* Love Letter Modal ("Gửi em!") */}
      {isLetterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative w-full max-w-lg bg-gradient-to-b from-stone-900 via-rose-950/80 to-stone-900 p-6 md:p-8 rounded-3xl border border-pink-400/40 shadow-[0_0_50px_rgba(244,114,182,0.3)] animate-in zoom-in-95 duration-300">
            <button
              onClick={() => setIsLetterOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-pink-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-4">
              <span className="font-script text-3xl text-pink-300 font-bold">
                Gửi {partnerName} Yêu Dấu!
              </span>
              <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-pink-400 to-transparent mx-auto mt-2" />
            </div>

            <div className="space-y-4 text-pink-100 text-sm md:text-base leading-relaxed font-light">
              <p>{letterMessage}</p>
              <p>
                Dù thế giới ngoài kia có bộn bề ngổn ngang, chỉ cần kề bên em, mọi giông bão đều hóa bình yên dịu ngọt. Mỗi ngày bên em đều là một ngày đặc biệt ngập tràn yêu thương.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-pink-500/20 flex items-center justify-between text-xs text-pink-300/80">
              <span>{specialDate}</span>
              <span className="font-script text-xl text-pink-300 font-bold">
                Yêu em mãi mãi, {senderName} ❤️
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Photo Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300 cursor-pointer"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-3xl max-h-[85vh] rounded-2xl overflow-hidden border border-pink-400/40 shadow-2xl">
            <img
              src={selectedPhoto}
              alt="Romantic Memory"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
