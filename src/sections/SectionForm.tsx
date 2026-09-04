import { useState } from 'react';
import { Language } from '../types';
import { narrativeSections } from '../data/narrative';
import { Layers, Eye } from 'lucide-react';
import { luxuryAudio } from '../utils/audio';

interface SectionProps {
  language: Language;
}

const explodedLayers = [
  {
    id: 'stone',
    title: 'Solitaire Diamond',
    titleFa: 'الماس برلیان تک‌نگین',
    desc: '57-facet brilliant cut stone held under engineered tension.',
    descFa: 'تراش برلیان ۵۷ سطحی با هندسه محاسبه‌شده عبور نور.',
    spec: '0.85 ct • D/VVS1',
  },
  {
    id: 'crown',
    title: 'Six-Prong Crown Setting',
    titleFa: 'پایه چنگکی شش‌گانه',
    desc: 'Precision micro-cast platinum prongs securing the gem.',
    descFa: 'چنگک‌های ریخته‌گری دقیق که نگین را معلق نگه می‌دارند.',
    spec: 'Pt 950 / Au 750',
  },
  {
    id: 'outerBevels',
    title: 'Architectural Shoulder Flutes',
    titleFa: 'شیارهای شانه‌ای معماری',
    desc: 'Dual-radii chamfers catching lateral grazing light.',
    descFa: 'پخ‌های دوگانه هندسی برای جذب پرتوهای جانبی نور.',
    spec: '0.08mm micro-bevel',
  },
  {
    id: 'shank',
    title: 'Ergonomic Torus Shank',
    titleFa: 'بدنه اصلی ارگونومیک رینگ',
    desc: 'Solid 18K gold shank balanced for zero finger strain.',
    descFa: 'تندیس یکپارچه طلای ۱۸ عیار متوازن با ارگونومی دست.',
    spec: '3.40 g Solid Au',
  },
  {
    id: 'innerBand',
    title: 'Assay Hallmark Sleeve',
    titleFa: 'غلاف عیارسنجی و اصالت',
    desc: 'Satin-finished interior carrying serial number & hallmark.',
    descFa: 'جداره ساتن داخلی حامل شماره سریال و مهر تایید رسمی.',
    spec: '№ 042 • Au 750',
  },
];

export function SectionForm({ language }: SectionProps) {
  const section = narrativeSections[2];
  const [activeLayer, setActiveLayer] = useState<string | null>(null);

  return (
    <section className="relative min-h-screen flex flex-col justify-between p-8 md:p-16 pointer-events-none">
      {/* Top Header */}
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
          <p className={`text-xs md:text-sm text-[#E6D3A3] mt-1 ${
            language === 'fa' ? 'font-fa tracking-normal' : 'font-mono tracking-widest'
          }`}>
            {language === 'fa' ? section.taglineFa : section.tagline}
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#C8A45A]/30 bg-[#0c0b0a]/70 backdrop-blur-md">
          <Layers className="w-3.5 h-3.5 text-[#C8A45A]" />
          <span className="font-mono text-[11px] text-[#C8A45A]">EXPLODED ARCHITECTURE</span>
        </div>
      </div>

      {/* Exploded Interactive Component Badges (Floating on Left/Right) */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 my-auto pointer-events-auto">
        {/* Component Selector Pills */}
        <div className="flex flex-col gap-2 max-w-xs">
          <span className="text-[10px] font-mono tracking-widest text-[#C8A45A]/70 uppercase block mb-1">
            {language === 'fa' ? 'اجزای منفک‌شده اثر' : 'DECONSTRUCTED SUB-ASSEMBLIES'}
          </span>
          {explodedLayers.map((layer) => (
            <button
              key={layer.id}
              onClick={() => {
                setActiveLayer(layer.id === activeLayer ? null : layer.id);
                luxuryAudio.playTick();
              }}
              className={`text-left rtl:text-right p-2.5 rounded-xl border transition-all flex items-center justify-between text-xs backdrop-blur-md ${
                activeLayer === layer.id
                  ? 'border-[#C8A45A] bg-[#C8A45A]/20 text-[#F4F0E8]'
                  : 'border-white/10 bg-[#080808]/60 text-[#F4F0E8]/70 hover:border-[#C8A45A]/40'
              }`}
            >
              <div>
                <span className="font-semibold block font-fa">
                  {language === 'fa' ? layer.titleFa : layer.title}
                </span>
                <span className="text-[10px] text-[#C8A45A] font-mono">{layer.spec}</span>
              </div>
              <Eye className={`w-3.5 h-3.5 transition-transform ${activeLayer === layer.id ? 'text-[#C8A45A] scale-110' : 'text-white/30'}`} />
            </button>
          ))}
        </div>

        {/* Highlighted Detail Drawer */}
        {activeLayer && (
          <div className="max-w-xs p-5 rounded-2xl border border-[#C8A45A]/40 bg-[#0c0b0a]/90 shadow-2xl backdrop-blur-xl">
            {(() => {
              const info = explodedLayers.find((l) => l.id === activeLayer);
              if (!info) return null;
              return (
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-[#C8A45A] block uppercase mb-1">
                    {info.spec}
                  </span>
                  <h4 className="font-display text-sm font-semibold text-[#F4F0E8] font-fa">
                    {language === 'fa' ? info.titleFa : info.title}
                  </h4>
                  <p className="text-xs text-[#F4F0E8]/70 mt-2 font-fa leading-relaxed">
                    {language === 'fa' ? info.descFa : info.desc}
                  </p>
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* Bottom Editorial */}
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
