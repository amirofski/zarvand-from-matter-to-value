import { useState, FormEvent } from 'react';
import { Language } from '../types';
import { X, Sparkles, CheckCircle, Gem, Hammer } from 'lucide-react';
import { luxuryAudio } from '../utils/audio';

interface BespokeModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

const metals = [
  { id: '18k-yellow', label: '18K Yellow Gold', labelFa: 'طلای زرد ۱۸ عیار' },
  { id: '18k-champagne', label: '18K Warm Champagne Gold', labelFa: 'طلای شامپاینی ۱۸ عیار' },
  { id: '18k-rose', label: '18K Rose Gold', labelFa: 'طلای رزگلد ۱۸ عیار' },
  { id: '24k-pure', label: '24K Pure Ingot Gold (999.9)', labelFa: 'شمش خالص ۲۴ عیار (۹۹۹.۹)' },
  { id: 'platinum', label: 'Platinum 950 Crown', labelFa: 'پلاتین خالص ۹۵۰' },
];

const gemstones = [
  { id: 'diamond', label: 'D-Color Ideal Diamond', labelFa: 'الماس بی‌رنگ برلیان' },
  { id: 'emerald', label: 'Colombian Emerald', labelFa: 'زمرد اصیل کلمبیا' },
  { id: 'sapphire', label: 'Ceylon Royal Sapphire', labelFa: 'یاقوت کبود سیلان' },
  { id: 'tourmaline', label: 'Deep Forest Tourmaline', labelFa: 'تورمالین سبز جنگلی' },
  { id: 'uncut', label: 'Raw Uncut Octahedron', labelFa: 'الماس تراش‌نخورده طبیعی' },
];

export function BespokeModal({ isOpen, onClose, language }: BespokeModalProps) {
  if (!isOpen) return null;

  const [selectedMetal, setSelectedMetal] = useState(metals[0].id);
  const [selectedGem, setSelectedGem] = useState(gemstones[0].id);
  const [estimatedGrams, setEstimatedGrams] = useState(5.5);
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    luxuryAudio.playGoldChime(960);
    setIsSubmitted(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-xl animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-3xl border border-[#C8A45A]/40 bg-[#0c0b0a] shadow-2xl overflow-hidden my-auto p-6 md:p-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-[#C8A45A]/15 border border-[#C8A45A]/30 text-[#C8A45A]">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-display text-lg md:text-xl font-semibold text-[#F4F0E8] font-fa">
                {language === 'fa' ? 'آتلیه طراحی سفارشی زروند' : 'Bespoke Private Atelier Commission'}
              </h3>
              <span className="text-[10px] font-mono text-[#C8A45A] tracking-wider uppercase">
                {language === 'fa' ? 'خلق اثری یگانه با دست استادکار' : 'CREATING YOUR UNIQUE MASTERPIECE'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="py-10 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h4 className="font-display text-xl font-bold text-[#F4F0E8] font-fa">
              {language === 'fa' ? 'درخواست طراحی اختصاصی شما ثبت شد' : 'Commission Brief Received'}
            </h4>
            <p className="text-xs text-white/60 font-fa max-w-md mx-auto leading-relaxed">
              {language === 'fa'
                ? 'استاد طراح آتلیه زروند جهت جلسه اولیه و ارائه اتودهای دستی با شما ارتباط برقرار خواهد نمود.'
                : 'Our master goldsmith and gemologist will review your preliminary specifications and contact you for an initial drawing consultation.'}
            </p>
            <button
              onClick={onClose}
              className="px-8 py-3 rounded-full bg-[#C8A45A] hover:bg-[#d6b46b] text-[#080808] font-bold text-xs font-mono tracking-widest uppercase cursor-pointer"
            >
              {language === 'fa' ? 'بازگشت به تجربه' : 'CLOSE STUDIO'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="py-6 space-y-6">
            {/* Precious Metal Selection */}
            <div>
              <label className="text-xs font-mono text-white/60 block mb-2 flex items-center gap-1.5">
                <Hammer className="w-3.5 h-3.5 text-[#C8A45A]" />
                {language === 'fa' ? 'انتخاب آلیاژ و فلز گرانبها' : 'SELECT PRECIOUS ALLOY'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {metals.map((m) => (
                  <button
                    type="button"
                    key={m.id}
                    onClick={() => {
                      setSelectedMetal(m.id);
                      luxuryAudio.playTick();
                    }}
                    className={`p-3 rounded-xl border text-left rtl:text-right text-xs transition-all cursor-pointer ${
                      selectedMetal === m.id
                        ? 'border-[#C8A45A] bg-[#C8A45A]/15 text-[#F4F0E8] font-semibold'
                        : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20'
                    }`}
                  >
                    <span className="font-fa">{language === 'fa' ? m.labelFa : m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Gemstone Selection */}
            <div>
              <label className="text-xs font-mono text-white/60 block mb-2 flex items-center gap-1.5">
                <Gem className="w-3.5 h-3.5 text-[#C8A45A]" />
                {language === 'fa' ? 'گوهر یا سنگ مرکزی' : 'CENTRAL GEMSTONE SPECIMEN'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {gemstones.map((g) => (
                  <button
                    type="button"
                    key={g.id}
                    onClick={() => {
                      setSelectedGem(g.id);
                      luxuryAudio.playTick();
                    }}
                    className={`p-3 rounded-xl border text-left rtl:text-right text-xs transition-all cursor-pointer ${
                      selectedGem === g.id
                        ? 'border-[#C8A45A] bg-[#C8A45A]/15 text-[#F4F0E8] font-semibold'
                        : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20'
                    }`}
                  >
                    <span className="font-fa">{language === 'fa' ? g.labelFa : g.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Target Weight Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-white/60 font-fa">{language === 'fa' ? 'وزن تقریبی فلز' : 'Approximate Gold Weight'}</span>
                <span className="font-mono text-[#C8A45A] font-semibold">{estimatedGrams.toFixed(1)} g</span>
              </div>
              <input
                type="range"
                min={2.5}
                max={20.0}
                step={0.5}
                value={estimatedGrams}
                onChange={(e) => setEstimatedGrams(parseFloat(e.target.value))}
                className="w-full cursor-pointer accent-[#C8A45A]"
              />
            </div>

            {/* Vision Notes */}
            <div>
              <label className="text-[11px] font-mono text-white/50 block mb-1">
                {language === 'fa' ? 'توضیحات و ایده اولیه مد نظر شما' : 'SPECIAL VISION, ERGONOMICS & ENGRAVING'}
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={language === 'fa' ? 'برای مثال: انگشتر یادبود با الهام از نقوش باستانی، مناسب برای دست راست...' : 'Describe inspiration, ring size, or architectural preferences...'}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-[#F4F0E8] focus:border-[#C8A45A] focus:outline-none font-fa"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-full bg-[#C8A45A] hover:bg-[#d6b46b] text-[#080808] font-bold text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-[#C8A45A]/25"
            >
              <Sparkles className="w-4 h-4" />
              <span className="font-fa">
                {language === 'fa' ? 'ارسال درخواست به آتلیه زروند' : 'SUBMIT BESPOKE COMMISSION BRIEF'}
              </span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
