import { useState } from 'react';
import { Language } from '../types';
import { narrativeSections, artisanObjects } from '../data/narrative';
import { Sparkles, Hammer, Info } from 'lucide-react';
import { luxuryAudio } from '../utils/audio';

interface SectionProps {
  language: Language;
}

export function SectionCraft({ language }: SectionProps) {
  const section = narrativeSections[3];
  const [hoveredObjectId, setHoveredObjectId] = useState<string | null>(null);

  const activeObject = artisanObjects.find((obj) => obj.id === hoveredObjectId);

  return (
    <section className="relative min-h-screen flex flex-col justify-between p-8 md:p-16 pointer-events-none">
      {/* Editorial Workbench Ambient Atmosphere Badge */}
      <div className="pt-16 md:pt-20 flex justify-between items-start pointer-events-auto">
        <div>
          <span className="font-mono text-xs tracking-[0.3em] text-[#C8A45A] block mb-2">
            CHAPTER {section.romanNumeral}
          </span>
          <h2 className={`text-4xl md:text-6xl lg:text-7xl text-[#F4F0E8] font-medium ${
            language === 'fa' ? 'font-heading-fa tracking-normal' : 'font-display tracking-wider'
          }`}>
            {language === 'fa' ? section.titleFa : section.title}
          </h2>
          <p className={`text-xs md:text-sm text-[#C8A45A] mt-1 ${
            language === 'fa' ? 'font-fa tracking-normal' : 'font-mono tracking-widest'
          }`}>
            {language === 'fa' ? section.taglineFa : section.tagline}
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#C8A45A]/40 bg-[#16120e]/80 backdrop-blur-md">
          <Hammer className="w-3.5 h-3.5 text-[#C8A45A]" />
          <span className="font-mono text-[11px] text-[#F4F0E8]">TEHRAN ATELIER № 01</span>
        </div>
      </div>

      {/* Virtual Workbench Physical Composition Artifacts */}
      <div className="my-auto pointer-events-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-8">
        {artisanObjects.map((item) => {
          const isSelected = hoveredObjectId === item.id;
          return (
            <div
              key={item.id}
              onMouseEnter={() => {
                setHoveredObjectId(item.id);
                luxuryAudio.playTick();
              }}
              className={`group relative p-6 rounded-2xl border transition-all duration-300 backdrop-blur-md cursor-pointer ${
                isSelected
                  ? 'border-[#C8A45A] bg-[#1a1510]/95 shadow-[0_12px_40px_rgba(200,164,90,0.15)] -translate-y-1'
                  : 'border-[#4A3427]/40 bg-[#0e0c0a]/70 hover:border-[#C8A45A]/50'
              }`}
            >
              {/* Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold tracking-wider bg-[#C8A45A]/15 text-[#C8A45A] border border-[#C8A45A]/30">
                  {language === 'fa' ? item.badgeFa : item.badge}
                </span>
                <Sparkles className="w-3.5 h-3.5 text-[#C8A45A]/40 group-hover:text-[#C8A45A] transition-colors" />
              </div>

              {/* Title */}
              <h3 className="font-display text-base font-semibold text-[#F4F0E8] group-hover:text-[#C8A45A] transition-colors font-fa">
                {language === 'fa' ? item.titleFa : item.title}
              </h3>

              {/* Details table */}
              <div className="mt-4 space-y-2 text-xs border-t border-white/5 pt-3">
                {(language === 'fa' ? item.detailsFa : item.details).map((d, i) => (
                  <div key={i} className="flex justify-between items-center text-[#F4F0E8]/70">
                    <span className="text-[#C8A45A]/70 font-mono text-[10px]">{d.label}</span>
                    <span className="font-medium text-[11px] font-fa">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Specimen Deep Inspection Overlay */}
      {activeObject && (
        <div className="hidden lg:flex items-center gap-3 p-3 px-5 rounded-full border border-[#C8A45A]/30 bg-[#0c0b0a]/80 backdrop-blur-md self-center pointer-events-auto">
          <Info className="w-4 h-4 text-[#C8A45A]" />
          <span className="text-xs text-[#F4F0E8]/80 font-fa">
            {language === 'fa'
              ? `بررسی فنی: ${activeObject.titleFa} تحت نظارت سرپرست گوهرشناسی آتلیه زروند.`
              : `Inspecting ${activeObject.title} verified by master gemologists.`}
          </span>
        </div>
      )}

      {/* Bottom Quote */}
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
      </div>
    </section>
  );
}
