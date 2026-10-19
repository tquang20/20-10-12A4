import React, { useState } from 'react';
import { Settings, X, Sparkles, Heart, Sliders, Check } from 'lucide-react';

export interface AppCustomConfig {
  partnerName: string;
  senderName: string;
  specialDate: string;
  letterMessage: string;
  speedMultiplier: number;
  densityFactor: number;
}

interface CustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AppCustomConfig;
  onSave: (newConfig: AppCustomConfig) => void;
  onReplay: () => void;
}

export const CustomizerModal: React.FC<CustomizerModalProps> = ({
  isOpen,
  onClose,
  config,
  onSave,
  onReplay,
}) => {
  const [formData, setFormData] = useState<AppCustomConfig>({ ...config });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
    onReplay();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-stone-900 border border-pink-500/30 rounded-3xl p-6 shadow-[0_0_40px_rgba(236,72,153,0.25)] text-pink-100 animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-pink-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-pink-500/20">
          <Settings className="w-5 h-5 text-pink-400" />
          <h2 className="text-lg font-semibold text-white">
            Tùy Chỉnh Lời Chúc & Hiệu Ứng
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-pink-300/80 mb-1 font-medium">
                Tên Người Gửi (Anh)
              </label>
              <input
                type="text"
                value={formData.senderName}
                onChange={e => setFormData({ ...formData, senderName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-pink-950/40 border border-pink-500/30 text-white text-sm focus:outline-none focus:border-pink-400"
                placeholder="Anh / Tuấn..."
              />
            </div>
            <div>
              <label className="block text-xs text-pink-300/80 mb-1 font-medium">
                Tên Người Nhận (Em)
              </label>
              <input
                type="text"
                value={formData.partnerName}
                onChange={e => setFormData({ ...formData, partnerName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-pink-950/40 border border-pink-500/30 text-white text-sm focus:outline-none focus:border-pink-400"
                placeholder="Em / Vy..."
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-pink-300/80 mb-1 font-medium">
              Ngày Kỷ Niệm / Ngày Lễ
            </label>
            <input
              type="text"
              value={formData.specialDate}
              onChange={e => setFormData({ ...formData, specialDate: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-pink-950/40 border border-pink-500/30 text-white text-sm focus:outline-none focus:border-pink-400"
              placeholder="20 Tháng 10 / 14 Tháng 2..."
            />
          </div>

          <div>
            <label className="block text-xs text-pink-300/80 mb-1 font-medium">
              Lời Chúc Trong Thư
            </label>
            <textarea
              rows={3}
              value={formData.letterMessage}
              onChange={e => setFormData({ ...formData, letterMessage: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-pink-950/40 border border-pink-500/30 text-white text-sm focus:outline-none focus:border-pink-400 resize-none"
              placeholder="Lời yêu thương ngọt ngào gửi gắm..."
            />
          </div>

          {/* Speed & Density Sliders */}
          <div className="pt-2 border-t border-pink-500/20 space-y-3">
            <div>
              <div className="flex justify-between text-xs text-pink-300/80 mb-1">
                <span>Tốc độ hoa nở</span>
                <span className="font-mono">{formData.speedMultiplier}x</span>
              </div>
              <div className="flex gap-2">
                {[0.75, 1.0, 1.35].map(speed => (
                  <button
                    key={speed}
                    type="button"
                    onClick={() => setFormData({ ...formData, speedMultiplier: speed })}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                      formData.speedMultiplier === speed
                        ? 'bg-pink-600 border-pink-400 text-white'
                        : 'bg-stone-800 border-stone-700 text-stone-300 hover:bg-stone-700'
                    }`}
                  >
                    {speed === 0.75 ? 'Thong thả' : speed === 1.0 ? 'Chuẩn' : 'Nhanh'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-pink-300/80 mb-1">
                <span>Mật độ hoa hồng</span>
                <span className="font-mono">{formData.densityFactor}x</span>
              </div>
              <div className="flex gap-2">
                {[0.85, 1.0, 1.25].map(density => (
                  <button
                    key={density}
                    type="button"
                    onClick={() => setFormData({ ...formData, densityFactor: density })}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                      formData.densityFactor === density
                        ? 'bg-pink-600 border-pink-400 text-white'
                        : 'bg-stone-800 border-stone-700 text-stone-300 hover:bg-stone-700'
                    }`}
                  >
                    {density === 0.85 ? 'Vừa vặn' : density === 1.0 ? 'Dày dặn' : 'Muôn vàn'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-3 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-pink-200 text-sm font-medium transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white text-sm font-semibold shadow-lg hover:shadow-pink-500/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Lưu & Xem Lại 🌸</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
