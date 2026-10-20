import React, { useEffect, useState } from 'react';
import { ArrowRight, Heart, X } from 'lucide-react';
import { romanticAudio } from '../utils/romanticAudio';

interface LoveLetterStageProps {
  onCloseLetter: () => void;
}

type LetterStageState = 'closed' | 'opening_flap' | 'extracting' | 'reading';

const fullMessage =
  'Nhân ngày Phụ nữ Việt Nam 20/10, ngày để tôn vinh và gửi trao những điều ngọt ngào nhất, xin chúc tất cả các bạn nữ 12A4 luôn rạng rỡ như những đóa hoa mùa thu, luôn tự tin, hạnh phúc và gặt hái thật nhiều thành công trên mọi chặng đường tương lai. Cảm ơn các bạn vì đã luôn là những đóa hoa tỏa ngát hương thơm, là những mảnh ghép dịu dàng, đáng yêu và rực rỡ nhất trong suốt những năm tháng thanh xuân của tập thể lớp chúng mình!';

export const LoveLetterStage: React.FC<LoveLetterStageProps> = ({ onCloseLetter }) => {
  const [stageState, setStageState] = useState<LetterStageState>('closed');
  const [typedText, setTypedText] = useState('');
  const [isTypingDone, setIsTypingDone] = useState(false);

  const handleOpenEnvelope = () => {
    if (stageState !== 'closed') return;
    romanticAudio.playChime();
    romanticAudio.start();
    setStageState('opening_flap');
    setTimeout(() => setStageState('extracting'), 550);
    setTimeout(() => setStageState('reading'), 1250);
  };

  useEffect(() => {
    if (stageState !== 'reading') {
      setTypedText('');
      setIsTypingDone(false);
      return;
    }

    let cancelled = false;
    const startedAt = performance.now();
    const charactersPerSecond = 52;
    const tick = () => {
      if (cancelled) return;
      const elapsed = performance.now() - startedAt;
      const currentIdx = Math.min(
        fullMessage.length,
        Math.floor((elapsed / 1000) * charactersPerSecond),
      );
      setTypedText(fullMessage.slice(0, currentIdx));
      if (currentIdx >= fullMessage.length) {
        setIsTypingDone(true);
        return;
      }
      // A short timeout is resilient to timer throttling: the next tick
      // derives the text from elapsed time instead of losing characters.
      window.setTimeout(tick, 16);
    };
    tick();

    return () => {
      cancelled = true;
    };
  }, [stageState]);

  const isFlapOpen = stageState !== 'closed';
  const isReading = stageState === 'reading';

  return (
    <div className="letter-stage-shell fixed inset-0 z-40 flex flex-col items-center justify-between p-3 sm:p-5 md:p-7 select-none overflow-hidden animate-letter-stage-in">
      <div className="letter-stage-wash" aria-hidden="true" />
      <div className="letter-stage-orb letter-stage-orb-left" aria-hidden="true" />
      <div className="letter-stage-orb letter-stage-orb-right" aria-hidden="true" />
      <div className="letter-stage-sparkles" aria-hidden="true" />
      <div className="letter-stage-petals" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>

      <header className="letter-stage-topbar z-40">
        <div className="letter-stage-brand"><span className="letter-stage-brand-dot"><Heart className="h-3 w-3 fill-current" /></span><span>20/10 · 12A4</span></div>
        <button onClick={onCloseLetter} className="letter-stage-exit" title="Khám phá Album 12A4"><span>Khám phá Album</span><ArrowRight className="h-3.5 w-3.5" /></button>
      </header>

      <main className="letter-stage-main w-full flex-1 relative flex items-center justify-center my-2 px-2 z-20">
        <div
          onClick={stageState === 'closed' ? handleOpenEnvelope : undefined}
          className={`dream-envelope ${stageState === 'closed' ? 'dream-envelope-idle' : 'dream-envelope-opened'}`}
          style={{ width: 'min(92vw, 620px)', height: 'min(58vw, 360px)' }}
          role={stageState === 'closed' ? 'button' : undefined}
          tabIndex={stageState === 'closed' ? 0 : -1}
          onKeyDown={(event) => { if (stageState === 'closed' && (event.key === 'Enter' || event.key === ' ')) handleOpenEnvelope(); }}
        >
          <div className="dream-envelope-back" />

          <div className={`dream-letter-slip ${stageState === 'closed' ? 'dream-letter-slip-hidden' : stageState === 'opening_flap' ? 'dream-letter-slip-peek' : stageState === 'extracting' ? 'dream-letter-slip-out' : 'dream-letter-slip-fade'}`}>
            <div className="dream-letter-slip-inner"><span>20/10 · 12A4</span><strong>Gửi các bạn nữ thân yêu</strong><div className="dream-letter-lines"><i /><i /><i /></div><small>Tập thể nam 12A4 kính tặng ♡</small></div>
          </div>

          <div className="dream-envelope-front">
            <svg viewBox="0 0 620 360" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="dreamFrontGradient" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f48fb1" /><stop offset="0.48" stopColor="#e57399" /><stop offset="1" stopColor="#c84b7a" /></linearGradient></defs><path d="M0 0v360h620V0L310 180z" fill="url(#dreamFrontGradient)" /><path d="M18 48v282q0 12 12 12h560q12 0 12-12V48" fill="none" stroke="rgba(255,238,195,.85)" strokeWidth="1.75" /><path d="M35 63v257q0 7 7 7h536q7 0 7-7V63" fill="none" stroke="rgba(255,255,255,.45)" strokeWidth="1.2" /></svg>
            <div className="dream-envelope-copy"><h1>Thân gửi các bạn nữ 12A4</h1><p>Ngày Phụ Nữ Việt Nam 20/10</p></div>
          </div>

          <div className={`dream-envelope-flap ${isFlapOpen ? 'dream-envelope-flap-open' : ''}`}>
            <svg viewBox="0 0 620 205" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="dreamFlapGradient" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f8a5c2" /><stop offset="0.52" stopColor="#eb799f" /><stop offset="1" stopColor="#cc5281" /></linearGradient></defs><path d="M0 0h620L310 202z" fill="url(#dreamFlapGradient)" /><path d="M24 12L310 188 596 12" fill="none" stroke="rgba(255,238,195,.9)" strokeWidth="2.2" /><path d="M44 15L310 177 576 15" fill="none" stroke="rgba(255,255,255,.45)" strokeWidth="1.2" /></svg>
          </div>

          {stageState === 'closed' && <div className="dream-envelope-hint"><span>Chạm vào phong thư để mở lời chúc</span></div>}
        </div>

        <div className={`dream-reading-backdrop fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 ${isReading ? 'dream-reading-visible' : ''}`}>
          <div className={`dream-reading-card ${isReading ? 'dream-reading-card-visible' : ''}`}>
            <div className="dream-reading-corner dream-reading-corner-tl" /><div className="dream-reading-corner dream-reading-corner-br" />
            <button onClick={onCloseLetter} className="dream-reading-close" title="Đóng thư và mở Album 12A4"><X className="h-5 w-5" /></button>
            <div className="dream-reading-heading"><span>NGÀY PHỤ NỮ VIỆT NAM · 20/10</span><h2>Gửi Các Bạn Nữ 12A4 Thân Yêu</h2><div className="dream-reading-divider"><i /><Heart className="h-4 w-4 fill-current" /><i /></div></div>
            <div className="dream-reading-body"><p>{typedText}{!isTypingDone && <span className="dream-caret" aria-hidden="true" />}</p></div>
            <div className="dream-reading-signature"><div><span>Kỷ niệm thanh xuân 20/10</span><small>Ngày 20 tháng 10 năm 2026</small></div><strong>Tập thể nam 12A4 kính tặng <Heart className="h-4 w-4 fill-current" /></strong></div>
          </div>
        </div>
      </main>
    </div>
  );
};
