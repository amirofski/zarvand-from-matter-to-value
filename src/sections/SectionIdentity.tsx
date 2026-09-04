import { Language } from '../types';
import { narrativeSections } from '../data/narrative';

interface SectionProps {
  language: Language;
}

export function SectionIdentity({ language }: SectionProps) {
  const section = narrativeSections[4];

  return (
    <section className="relative min-h-screen flex flex-col justify-between p-8 md:p-16 pointer-events-none">
      {/* Top Subtle Chapter Marker */}
      <div className="pt-16 md:pt-20 pointer-events-auto">
        <span className="font-mono text-xs tracking-[0.4em] text-[#C8A45A] block mb-2">
          CHAPTER {section.romanNumeral}
        </span>
        <h2 className={`text-3xl md:text-5xl text-[#F4F0E8]/70 font-medium ${
          language === 'fa' ? 'font-heading-fa tracking-normal' : 'font-display tracking-wider'
        }`}>
          {language === 'fa' ? section.titleFa : section.title}
        </h2>
      </div>

      {/* Massive Negative Space around center 3D Ring */}

      {/* Emotional Editorial Typography */}
      <div className="my-auto text-center max-w-3xl mx-auto pointer-events-auto px-4">
        <p className={`text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-[#F4F0E8] font-light leading-snug md:leading-tight ${
          language === 'fa' ? 'font-heading-fa tracking-normal' : 'font-editorial italic tracking-wide'
        }`}>
          {language === 'fa' ? 'بعضی اشیاء پوشیده می‌شوند.' : 'Some objects are worn.'}
        </p>
        <p className={`text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-[#C8A45A] mt-3 sm:mt-6 leading-snug md:leading-tight ${
          language === 'fa' ? 'font-heading-fa font-normal tracking-normal' : 'font-editorial italic tracking-wide'
        }`}>
          {language === 'fa' ? 'آنها بخشی از وجود ما می‌شوند.' : 'They become part of us.'}
        </p>
      </div>

      {/* Subtle Bottom Caption */}
      <div className="pb-8 md:pb-12 text-center pointer-events-auto">
        <p className={`text-xs md:text-sm text-[#F4F0E8]/50 ${
          language === 'fa' ? 'font-fa tracking-normal' : 'font-mono uppercase tracking-widest'
        }`}>
          {language === 'fa'
            ? 'پیوند عاطفی میان گوهر و انسان — جاودانگی هویت'
            : 'INTIMATE CONTINUITY OF SELF • BEYOND ORNAMENT'}
        </p>
      </div>
    </section>
  );
}
