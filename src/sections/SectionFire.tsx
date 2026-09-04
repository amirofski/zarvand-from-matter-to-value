import { Language } from '../types';
import { narrativeSections } from '../data/narrative';
import { Flame } from 'lucide-react';

interface SectionProps {
  language: Language;
}

export function SectionFire({ language }: SectionProps) {
  const section = narrativeSections[1];

  return (
    <section className="relative min-h-screen flex flex-col justify-between p-8 md:p-16 pointer-events-none">
      {/* Top Header */}
      <div className="pt-16 md:pt-20 flex justify-between items-start pointer-events-auto">
        <div>
          <span className="font-mono text-xs tracking-[0.3em] text-[#9B4D24] block mb-2">
            CHAPTER {section.romanNumeral}
          </span>
          <h2 className={`text-4xl md:text-6xl lg:text-7xl text-[#F4F0E8] font-medium ${
            language === 'fa' ? 'font-heading-fa tracking-normal' : 'font-display tracking-wider'
          }`}>
            {language === 'fa' ? section.titleFa : section.title}
          </h2>
          <p className={`text-xs md:text-sm text-[#FF8E4D] mt-1 ${
            language === 'fa' ? 'font-fa tracking-normal' : 'font-mono tracking-widest'
          }`}>
            {language === 'fa' ? section.taglineFa : section.tagline}
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#9B4D24]/40 bg-[#1a0802]/60 backdrop-blur-md">
          <Flame className="w-4 h-4 text-[#FF6A10] animate-pulse" />
          <span className="font-mono text-xs text-[#FFC085]">1,064.18 °C</span>
          <span className="text-[10px] text-white/50 uppercase">MELTING POINT</span>
        </div>
      </div>

      {/* Middle right atmospheric notes */}
      <div className="hidden lg:flex justify-end pointer-events-auto">
        <div className="max-w-xs p-6 rounded-2xl border border-[#9B4D24]/30 bg-[#100603]/70 backdrop-blur-xl text-right rtl:text-left">
          <span className="text-[10px] font-mono tracking-widest text-[#FF8E4D] block uppercase">
            {language === 'fa' ? 'تسلیم در آتش کوره' : 'METALLURGIC FUSION'}
          </span>
          <p className="text-xs text-[#F4F0E8]/70 mt-2 font-fa leading-relaxed">
            {language === 'fa'
              ? 'در حرارت خورشیدوار بوته، بلورهای سخت طلا به جویباری مذاب دگرگون می‌شوند تا برای دریافت روحی تازه آماده گردند.'
              : 'Within the crucible incandescent heat, raw geological crystals surrender to fluid rivers of pure molten light, preparing to receive sovereign geometry.'}
          </p>
        </div>
      </div>

      {/* Bottom Editorial */}
      <div className="pb-8 md:pb-12 max-w-xl pointer-events-auto">
        <blockquote className="border-l-2 rtl:border-l-0 rtl:border-r-2 border-[#9B4D24] pl-4 rtl:pl-0 rtl:pr-4 py-1 my-4">
          <p className={`text-xl md:text-2xl lg:text-[1.75rem] text-[#FFA040] leading-relaxed md:leading-[1.65] ${
            language === 'fa'
              ? 'font-quote-fa font-medium'
              : 'font-editorial text-lg md:text-2xl italic font-light tracking-wide'
          }`}>
            {language === 'fa' ? `«${section.quoteFa}»` : `“${section.quote}”`}
          </p>
        </blockquote>
        <p className="text-sm md:text-base text-[#F4F0E8]/70 leading-relaxed font-fa font-light">
          {language === 'fa' ? section.descriptionFa : section.description}
        </p>
      </div>
    </section>
  );
}
