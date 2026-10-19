import React, { useState, useEffect } from 'react';
import { Heart, X, ArrowRight } from 'lucide-react';
import { romanticAudio } from '../utils/romanticAudio';

interface LoveLetterStageProps {
  onCloseLetter: () => void;
}

type LetterStageState = 'closed' | 'opening_flap' | 'extracting' | 'reading';

export const LoveLetterStage: React.FC<LoveLetterStageProps> = ({
  onCloseLetter,
}) => {
  // State: 'closed' -> 'opening_flap' (miệng thư mở) -> 'extracting' (lá thư chui từ trong ra) -> 'reading' (bay ra to lên, xung quanh mờ đi)
  const [stageState, setStageState] = useState<LetterStageState>('closed');
  const [typedText, setTypedText] = useState('');
  const [isTypingDone, setIsTypingDone] = useState(false);

  // Lời chúc 20/10 ngọt ngào dành riêng cho các bạn nữ 12A4
  const fullMessage =
    'Nhân ngày Phụ nữ Việt Nam 20/10, ngày để tôn vinh và gửi trao những điều ngọt ngào nhất, xin chúc tất cả các bạn nữ 12A4 luôn rạng rỡ như những đóa hoa mùa thu, luôn tự tin, hạnh phúc và gặt hái thật nhiều thành công trên mọi chặng đường tương lai. Cảm ơn các bạn vì đã luôn là những đóa hoa tỏa ngát hương thơm, là những mảnh ghép dịu dàng, đáng yêu và rực rỡ nhất trong suốt những năm tháng thanh xuân của tập thể lớp chúng mình!';

  // Xử lý mở thư từng bước chân thực và mượt mà
  const handleOpenEnvelope = () => {
    if (stageState !== 'closed') return;
    romanticAudio.playChime();
    romanticAudio.start();

    // Bước 1: Miệng phong bì mở ra nhẹ nhàng
    setStageState('opening_flap');

    // Bước 2: Lá thư chui từ bên trong phong bì trượt lên trên (phần đáy luôn giấu trong túi, không bị lòi)
    setTimeout(() => {
      setStageState('extracting');
    }, 550);

    // Bước 3: Lá thư bay ra phía trước và phóng to lên, xung quanh mờ đi
    setTimeout(() => {
      setStageState('reading');
    }, 1250);
  };

  // Hiệu ứng máy đánh chữ gõ từng chữ khi lá thư đã mở to
  useEffect(() => {
    if (stageState !== 'reading') {
      setTypedText('');
      setIsTypingDone(false);
      return;
    }

    let currentIdx = 0;
    const interval = setInterval(() => {
      currentIdx++;
      setTypedText(fullMessage.slice(0, currentIdx));
      if (currentIdx >= fullMessage.length) {
        clearInterval(interval);
        setIsTypingDone(true);
      }
    }, 22);

    return () => clearInterval(interval);
  }, [stageState]);

  // Lời chúc chạy chữ ở chân trang
  const [lyricIndex, setLyricIndex] = useState(0);
  const greetings = [
    '“ Chúc các bạn nữ 12A4 luôn rạng rỡ, xinh đẹp và ngập tràn niềm vui ”',
    '“ Mãi là những đóa hoa tươi thắm và tỏa sáng nhất của thanh xuân 12A4 ”',
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setLyricIndex((prev) => (prev + 1) % greetings.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [greetings.length]);

  const isFlapOpen = stageState !== 'closed';
  const isReading = stageState === 'reading';

  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-between p-3 sm:p-5 md:p-7 select-none overflow-hidden bg-gradient-to-b from-[#09020e] via-[#120417] to-[#07010c] animate-letter-stage-in">
      {/* Soft Romantic Ambient Background Glow */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-pink-600/10 rounded-full blur-3xl" />
      </div>

      {/* Trái tim hồng dịu dàng phát sáng phía sau */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 flex items-center justify-center">
        <div className="w-[360px] h-[360px] md:w-[480px] md:h-[480px] rounded-full bg-rose-500/15 blur-3xl" />
        <svg
          viewBox="0 0 24 24"
          className="absolute w-[260px] h-[260px] md:w-[350px] md:h-[350px] text-rose-500/20 fill-rose-500/15 blur-xl"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>

      {/* Top Header: Nút điều hướng vào Album */}
      <header className="w-full max-w-5xl flex items-center justify-end z-40 pt-1">
        <button
          onClick={onCloseLetter}
          className="group flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-pink-100 hover:text-white border border-pink-400/30 backdrop-blur-md text-xs font-semibold shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
          title="Khám phá Album 12A4"
        >
          <span>Khám phá Album 12A4</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          <X className="w-4 h-4 ml-1 text-pink-300" />
        </button>
      </header>

      {/* Main Center Stage: Khu vực hiển thị Phong bì & Lá thư */}
      <main className="w-full max-w-4xl flex-1 relative flex items-center justify-center my-2 px-2 z-20">

        {/* ================= PHONG BÌ THƯ HOÀNG GIA ĐÚNG CHUẨN HÌNH 2 ================= */}
        <div
          onClick={stageState === 'closed' ? handleOpenEnvelope : undefined}
          className={`relative transition-all duration-700 ease-out select-none ${
            stageState === 'closed'
              ? 'cursor-pointer hover:scale-105 active:scale-98 animate-float'
              : 'scale-95'
          }`}
          style={{
            width: 'min(92vw, 520px)',
            height: 'min(58vw, 325px)',
          }}
        >
          {/* Lớp 1: Khung và lưng phong bì (Màu đỏ nhung hoàng gia đồng nhất, viền vàng nằm sau lá thư) */}
          <div
            className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#be123c] via-[#b91c1c] to-[#9f1239] shadow-[0_25px_60px_rgba(0,0,0,0.7),0_0_40px_rgba(244,114,182,0.25)] border border-pink-400/40 overflow-hidden"
            style={{ zIndex: 1 }}
          >
            {/* Lớp nhung đỏ đồng màu, không có vùng tối bất thường */}
            <div className="absolute inset-1.5 rounded-xl bg-gradient-to-b from-[#be123c] via-[#b91c1c] to-[#9f1239]" />
            {/* Viền vàng phong bì nằm ở lớp sau (zIndex: 1), hoàn toàn không che lên mặt lá thư khi trượt ra */}
            <div className="absolute inset-2.5 rounded-xl border border-amber-300/35 pointer-events-none" />
          </div>

          {/* Lớp 2: LÁ THƯ CHUI TỪ BÊN TRONG RA (Letter sliding out from inside pocket, zIndex: 15 cao hơn nắp mở zIndex: 5 và viền vàng) */}
          <div
            className={`absolute inset-x-4 top-2 transition-all duration-700 ease-out ${
              stageState === 'closed'
                ? 'translate-y-2 opacity-0 pointer-events-none'
                : stageState === 'opening_flap'
                ? 'translate-y-0 opacity-100 pointer-events-none'
                : stageState === 'extracting'
                ? '-translate-y-24 sm:-translate-y-32 opacity-100 pointer-events-none shadow-2xl scale-[0.99]'
                : 'opacity-0 pointer-events-none'
            }`}
            style={{ height: '290px', zIndex: 15 }}
          >
            {/* Thẻ thư mini mô phỏng lúc trượt ra khỏi miệng phong bì - Nổi bật, không bị bất kỳ viền vàng nào che khuất */}
            <div className="w-full h-full bg-[#fffdfa] rounded-xl p-4 sm:p-6 border-2 border-rose-200/90 shadow-xl flex flex-col justify-between overflow-hidden">
              <div className="text-center">
                <span className="text-[9px] uppercase tracking-widest text-rose-500/80 font-bold">20/10 • 12A4</span>
                <h4 className="font-script text-xl sm:text-2xl text-rose-600 font-bold mt-1">Gửi Các Bạn Nữ 12A4</h4>
              </div>
              <div className="space-y-2 py-2">
                <div className="h-1.5 bg-rose-200/60 rounded w-full" />
                <div className="h-1.5 bg-rose-200/60 rounded w-5/6" />
                <div className="h-1.5 bg-rose-200/60 rounded w-4/6" />
              </div>
              <div className="text-right text-[11px] text-rose-500 font-medium">Tập thể nam 12A4 kính tặng ❤️</div>
            </div>
          </div>

          {/* Lớp 3: Thân trước phong bì - ĐỒNG MÀU NHUNG ĐỎ, VIỀN VÀNG KHÔNG VẮT NGANG MẶT LÁ THƯ */}
          <div
            className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden"
            style={{ zIndex: 20 }}
          >
            <svg
              viewBox="0 0 520 325"
              className="absolute inset-0 w-full h-full"
              preserveAspectRatio="none"
              style={{ filter: 'drop-shadow(0 -3px 8px rgba(0,0,0,0.25))' }}
            >
              <defs>
                <linearGradient id="frontPocketGrad" x1="50%" y1="0%" x2="50%" y2="100%">
                  <stop offset="0%" stopColor="#be123c" />
                  <stop offset="50%" stopColor="#b91c1c" />
                  <stop offset="100%" stopColor="#9f1239" />
                </linearGradient>
              </defs>

              {/* Thân phong bì màu đỏ nhung đồng nhất, phẳng mịn, kết nối hoàn hảo với miệng thư */}
              <path
                d="M 0,0 L 0,325 L 520,325 L 520,0 L 260,150 Z"
                fill="url(#frontPocketGrad)"
              />

              {/* Viền vàng của túi trước: Chỉ chạy ở phần đáy và 2 bên thân túi, TUYỆT ĐỐI KHÔNG vắt ngang miệng túi để không che lên mặt lá thư */}
              <path
                d="M 14,40 L 14,300 Q 14,311 25,311 L 495,311 Q 506,311 506,300 L 506,40"
                fill="none"
                stroke="rgba(252, 211, 77, 0.35)"
                strokeWidth="1.5"
              />
            </svg>

            {/* Layout 3 dòng text GIỮ NGUYÊN 100% VỊ TRÍ VÀ THIẾT KẾ ĐẸP MẮT NHƯ CŨ */}
            <div className="absolute inset-x-6 bottom-4 sm:bottom-6 flex flex-col items-center justify-center text-center">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-0.5 rounded-full bg-rose-950/70 border border-amber-300/40 text-[10px] text-amber-200 uppercase tracking-widest mb-1.5 backdrop-blur-sm">
                <span>DÀNH TẶNG 20/10</span>
                <span>•</span>
                <span>12A4</span>
              </div>
              <h3 className="font-script text-2xl sm:text-3xl md:text-4xl text-amber-100 font-bold tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] flex items-center justify-center gap-2">
                <span>Thân gửi các bạn nữ 12A4</span>
                <span className="text-xl sm:text-2xl">💌</span>
              </h3>
              <p className="text-[11px] sm:text-xs text-pink-200/90 font-medium tracking-wider mt-0.5">
                Ngày Phụ Nữ Việt Nam 20/10
              </p>
            </div>
          </div>

          {/* Lớp 4: MIỆNG PHONG BÌ (TOP FLAP) - KHI ĐÓNG CHE KÍN 100% (zIndex: 30), KHI MỞ NẰM SAU LÁ THƯ (zIndex: 5) */}
          <div
            className="absolute top-0 inset-x-0 h-[56%] preserve-3d cursor-pointer"
            style={{
              transformOrigin: 'top center',
              transform: isFlapOpen ? 'rotateX(180deg)' : 'rotateX(0deg)',
              transition: 'transform 0.65s cubic-bezier(0.4, 0, 0.2, 1)',
              zIndex: isFlapOpen ? 5 : 30,
            }}
          >
            <svg
              viewBox="0 0 520 182"
              className="w-full h-full"
              style={{
                filter: isFlapOpen ? 'none' : 'drop-shadow(0 4px 10px rgba(0,0,0,0.25))',
              }}
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="flapGrad" x1="50%" y1="0%" x2="50%" y2="100%">
                  <stop offset="0%" stopColor="#be123c" />
                  <stop offset="50%" stopColor="#b91c1c" />
                  <stop offset="100%" stopColor="#9f1239" />
                </linearGradient>
              </defs>
              {/* Nắp phong bì phủ sâu xuống y=178, che kín 100% miệng thư khi đóng */}
              <path
                d="M 0,0 L 520,0 L 260,178 Z"
                fill="url(#flapGrad)"
                stroke="rgba(244, 114, 182, 0.35)"
                strokeWidth="1"
              />
              {/* Viền vàng tinh xảo bên trong nắp phong bì (khi mở thư sẽ nằm ở zIndex: 5 phía sau lá thư zIndex: 15) */}
              <path
                d="M 28,12 L 260,162 L 492,12"
                fill="none"
                stroke="rgba(252, 211, 77, 0.55)"
                strokeWidth="1.5"
              />
            </svg>

            {/* Ô DẤU NIÊM PHONG (WAX SEAL) - ĐẶT NGAY TRÊN ĐỈNH NẮP CHE KÍN MIỆNG THƯ */}
            <div
              className={`absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-rose-900 via-rose-700 to-pink-600 shadow-[0_3px_10px_rgba(0,0,0,0.5)] flex items-center justify-center border border-amber-300/80 transition-all duration-300 ${
                isFlapOpen ? 'opacity-0 scale-75 pointer-events-none' : 'opacity-100 hover:scale-110 active:scale-90'
              }`}
            >
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-amber-300/40 flex items-center justify-center bg-rose-800/80">
                <Heart className="w-3.5 h-3.5 text-amber-200 fill-amber-200 drop-shadow-sm" />
              </div>
            </div>
          </div>

          {/* Gợi ý tương tác khi phong bì đang đóng */}
          {stageState === 'closed' && (
            <div className="absolute -bottom-14 inset-x-0 flex justify-center pointer-events-none">
              <span className="px-6 py-2 rounded-full bg-pink-950/80 border border-pink-400/40 text-pink-200 text-xs sm:text-sm font-medium tracking-wider backdrop-blur-md shadow-lg animate-pulse-glow">
                Chạm vào phong thư để mở lời chúc 🌸
              </span>
            </div>
          )}
        </div>

        {/* ================= LÁ THƯ BAY RA VÀ TO LÊN, XUNG QUANH MỜ ĐI ================= */}
        {/* Khi stageState === 'reading', hiển thị lá thư toàn màn hình với nền xung quanh mờ ảo */}
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 transition-all duration-700 ${
            isReading
              ? 'bg-black/75 backdrop-blur-md opacity-100 pointer-events-auto'
              : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Thẻ thư Hoàng Gia toàn màn hình */}
          <div
            className={`relative w-full max-w-2xl lg:max-w-3xl bg-[#fffef9] rounded-3xl p-6 sm:p-9 md:p-12 shadow-[0_25px_80px_rgba(0,0,0,0.85),0_0_50px_rgba(251,113,133,0.3)] border-2 border-rose-300/90 text-rose-950 max-h-[90vh] overflow-y-auto transition-transform duration-700 ease-out ${
              isReading ? 'scale-100 translate-y-0' : 'scale-75 translate-y-24'
            }`}
          >
            {/* Viền hoa văn chỉ vàng kép cổ điển */}
            <div className="absolute inset-2.5 sm:inset-4 rounded-2xl border border-rose-300/50 pointer-events-none" />
            <div className="absolute inset-4 sm:inset-6 rounded-xl border border-amber-500/25 pointer-events-none" />

            {/* Nút đóng thư [✕] ở góc trên bên phải */}
            <button
              onClick={onCloseLetter}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-rose-100 hover:bg-rose-200 text-rose-900 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-sm z-30"
              title="Đóng thư và mở Album 12A4"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Tiêu đề lá thư */}
            <div className="text-center mb-5 sm:mb-8">
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.3em] text-rose-600/80">
                Ngày Phụ Nữ Việt Nam 20/10
              </span>
              <h2 className="font-script text-3xl sm:text-5xl md:text-6xl text-rose-600 font-bold tracking-wide mt-1 drop-shadow-sm flex items-center justify-center gap-2">
                <span>Gửi Các Bạn Nữ 12A4 Thân Yêu</span>
              </h2>
              {/* Dải phân cách hoa văn lãng mạn */}
              <div className="flex items-center justify-center gap-3 mt-2.5 sm:mt-3">
                <div className="w-14 sm:w-28 h-px bg-gradient-to-r from-transparent via-rose-300 to-rose-400" />
                <Heart className="w-4 h-4 text-rose-400 fill-rose-300" />
                <div className="w-14 sm:w-28 h-px bg-gradient-to-l from-transparent via-rose-300 to-rose-400" />
              </div>
            </div>

            {/* Nội dung thư hiệu ứng máy đánh chữ (chữ to, dễ đọc, êm ái) */}
            <div className="min-h-[140px] sm:min-h-[170px] text-rose-950 text-base sm:text-xl md:text-2xl leading-relaxed sm:leading-loose md:leading-[2.2] font-normal tracking-wide px-1 sm:px-4 font-vietnam">
              <p className="inline font-normal">
                {typedText}
              </p>
              {!isTypingDone && stageState === 'reading' && (
                <span className="inline-block w-2 sm:w-2.5 h-5 sm:h-6 ml-2 bg-rose-500 opacity-80 animate-pulse" />
              )}
            </div>

            {/* Chữ ký tập thể nam 12A4 */}
            <div className="mt-6 sm:mt-9 pt-4 sm:pt-5 border-t border-rose-200/80 flex flex-wrap items-center justify-between text-xs sm:text-sm text-rose-800 px-1 sm:px-4">
              <div className="flex flex-col">
                <span className="font-medium text-rose-600 tracking-wider uppercase text-[10px] sm:text-xs">
                  Kỷ niệm thanh xuân 20/10
                </span>
                <span className="text-xs text-rose-700/70 mt-0.5">
                  Ngày 20 tháng 10 năm 2026
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2 sm:mt-0">
                <span className="font-script text-2xl sm:text-3xl text-rose-600 font-bold">
                  Tập thể nam 12A4 kính tặng
                </span>
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              </div>
            </div>

            {/* Nút hành động mở toàn bộ Album kỷ niệm */}
            <div className="mt-6 sm:mt-9 flex justify-center">
              <button
                onClick={onCloseLetter}
                className="px-7 sm:px-10 py-2.5 sm:py-3.5 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold text-sm sm:text-base shadow-lg hover:shadow-rose-500/40 transition-all hover:scale-105 active:scale-95 flex items-center gap-2.5 cursor-pointer"
              >
                <span>Mở Album Kỷ Niệm 12A4</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Dòng chữ chúc mừng chạy ở chân trang */}
      <footer
        className={`w-full max-w-3xl text-center py-2 sm:py-3 z-30 transition-opacity duration-500 ${
          isReading ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <p className="font-script text-lg sm:text-xl md:text-2xl text-pink-200 font-bold tracking-wider drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
          {greetings[lyricIndex]}
        </p>
      </footer>
    </div>
  );
};
