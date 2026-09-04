import { Language } from '../types';
import { narrativeSections } from '../data/narrative';
import { Sparkles, Compass } from 'lucide-react';
import { luxuryAudio } from '../utils/audio';

interface SectionOwnershipProps {
  language: Language;
  onDiscoverCollection: () => void;
  onCreatePiece: () => void;
}

export function SectionOwnership({
  language,
  onDiscoverCollection,
  onCreatePiece,
}: SectionOwnershipProps) {
  const section = narrativeSections[7];

  return (
    <section className="relative min-h-screen flex flex-col justify-between p-8 md:p-16 pointer-events-none">
      {/* Top Chapter Marker */}
      <div className="pt-16 md:pt-20 text-center pointer-events-auto">
        <span className="font-mono text-xs tracking-[0.4em] text-[#C8A45A] block mb-2">
          FINAL CHAPTER {section.romanNumeral}
        </span>
        <h2 className={`text-3xl md:text-4xl text-[#F4F0E8]/80 font-medium ${
          language === 'fa' ? 'font-heading-fa tracking-normal' : 'font-display tracking-widest'
        }`}>
          {language === 'fa' ? section.titleFa : section.title}
        </h2>
      </div>

      {/* Center Emotional Culmination */}
      <div className="my-auto text-center max-w-2xl mx-auto pointer-events-auto px-4 space-y-6">
        <h1 className={`text-3xl sm:text-5xl md:text-6xl text-[#F4F0E8] font-normal leading-snug md:leading-tight ${
          language === 'fa' ? 'font-heading-fa tracking-normal' : 'font-editorial font-light'
        }`}>
          "{language === 'fa' ? 'ارزش تنها چیزی نیست که دیده می‌شود.' : 'Value is not only what you see.'}"
        </h1>

        <p className="text-sm md:text-base text-[#E6D3A3]/80 leading-relaxed font-fa max-w-lg mx-auto font-light">
          {language === 'fa'
            ? 'پایان سفر ماده خام به سمت جاودانگی. تکه‌ای از جهان که اکنون در انتظار داستان شماست.'
            : 'The culmination of primal ore, forge fire, and patient hands. A singular piece of the cosmos waiting to mirror your legacy.'}
        </p>

        {/* Dual Luxury CTAs */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => {
              onDiscoverCollection();
              luxuryAudio.playTick();
            }}
            className="w-full sm:w-auto px-8 py-4 rounded-full border border-[#C8A45A]/40 bg-[#080808]/80 hover:bg-[#C8A45A]/10 text-[#F4F0E8] hover:border-[#C8A45A] text-xs font-mono tracking-widest uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg backdrop-blur-md"
          >
            <Compass className="w-4 h-4 text-[#C8A45A]" />
            <span className="font-fa">
              {language === 'fa' ? 'مشاهده کامل مجموعه آثار' : 'DISCOVER THE COLLECTION'}
            </span>
          </button>

          <button
            onClick={() => {
              onCreatePiece();
              luxuryAudio.playGoldChime(880);
            }}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#C8A45A] hover:bg-[#d6b46b] text-[#080808] font-semibold text-xs font-mono tracking-widest uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-[#C8A45A]/25"
          >
            <Sparkles className="w-4 h-4" />
            <span className="font-fa">
              {language === 'fa' ? 'آغاز سفارش اختصاصی شما' : 'CREATE YOUR PIECE'}
            </span>
          </button>
        </div>
      </div>

      {/* Footer Colophon */}
      <div className="pb-8 md:pb-12 flex flex-col sm:flex-row items-center justify-between text-xs text-[#F4F0E8]/40 border-t border-white/5 pt-6 pointer-events-auto">
        <p className="font-display tracking-widest uppercase">
          ZARVAND ATELIER • HAUTE JOAILLERIE © 2026
        </p>
        <p className="font-fa mt-2 sm:mt-0">
          {language === 'fa'
            ? 'طراحی و ساخت دست در ایران • گواهی اصالت بین‌المللی'
            : 'Handcrafted in Tehran • Certified Worldwide'}
        </p>
      </div>
    </section>
  );
}
