import { Language } from '../types';
import { narrativeSections } from '../data/narrative';
import { ChevronDown } from 'lucide-react';

interface SectionProps {
  language: Language;
}

export function SectionMatter({ language }: SectionProps) {
  const section = narrativeSections[0];

  return (
    <section className="relative min-h-screen flex flex-col justify-between p-8 md:p-16 pointer-events-none">
      {/* Top Editorial Eyebrow */}
      <div className="pt-16 md:pt-20 flex justify-between items-start pointer-events-auto">
        <div>
          <span className="font-mono text-xs tracking-[0.3em] text-[#C8A45A] block mb-2">
            CHAPTER {section.romanNumeral}
          </span>
          <h1 className={`text-4xl md:text-6xl lg:text-7xl text-[#F4F0E8] font-medium ${
            language === 'fa' ? 'font-heading-fa tracking-normal' : 'font-display tracking-wider'
          }`}>
            {language === 'fa' ? section.titleFa : section.title}
          </h1>
        </div>
        <div className="text-right rtl:text-left hidden sm:block max-w-xs">
          <p className={`text-xs uppercase ${
            language === 'fa' ? 'font-fa tracking-normal text-[#C8A45A]' : 'font-mono tracking-widest text-[#C8A45A]'
          }`}>
            {language === 'fa' ? 'خاستگاه کیهانی طلا' : 'COSMIC ORIGIN OF GOLD'}
          </p>
          <p className="text-xs text-[#F4F0E8]/70 mt-1 font-fa">
            {language === 'fa' ? 'چگالی: ۱۹.۳ گرم بر سانتی‌متر مکعب' : 'Density: 19.3 g/cm³'}
          </p>
        </div>
      </div>

      {/* Center Cinematic Space is left for the 3D Raw Gold Nugget */}

      {/* Bottom Editorial Quote & Description */}
      <div className="pb-8 md:pb-12 max-w-xl pointer-events-auto">
        <blockquote className="border-l-2 rtl:border-l-0 rtl:border-r-2 border-[#C8A45A] pl-4 rtl:pl-0 rtl:pr-4 py-1 my-4">
          <p className={`text-xl md:text-2xl lg:text-[1.75rem] text-[#E6D3A3] leading-relaxed md:leading-[1.65] ${
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

        {/* Subtle Scroll Cue */}
        <div className="mt-8 flex items-center gap-3 text-xs tracking-widest text-[#C8A45A]/70 uppercase font-mono">
          <span className="inline-block w-8 h-[1px] bg-[#C8A45A]/40" />
          <span>{language === 'fa' ? 'برای کاوش ماده پیمایش کنید' : 'SCROLL TO EXPLORE MATTER'}</span>
          <ChevronDown className="w-3.5 h-3.5 animate-bounce text-[#C8A45A]" />
        </div>
      </div>
    </section>
  );
}
