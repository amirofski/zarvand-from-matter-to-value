import { useState } from 'react';
import { Language } from '../types';
import { narrativeSections } from '../data/narrative';
import { liveMarketPricing } from '../data/products';
import { Slider } from '../components/Slider';
import { TrendingUp, Scale, Sparkles, ShieldCheck } from 'lucide-react';
import { luxuryAudio } from '../utils/audio';

interface SectionValueProps {
  language: Language;
  currentWeight: number;
  onWeightChange: (weight: number) => void;
  onAcquireConfiguration: (config: { weight: number; karat: 18 | 24; total: number }) => void;
}

const weightPresets = [0.8, 1.2, 1.8, 2.5, 3.4, 5.2];

export function SectionValue({
  language,
  currentWeight,
  onWeightChange,
  onAcquireConfiguration,
}: SectionValueProps) {
  const section = narrativeSections[5];
  const [karat, setKarat] = useState<18 | 24>(18);
  const makingFeePerGram = 38;
  const gemstoneValue = 2850;

  const priceBreakdown = liveMarketPricing.calculatePrice(
    currentWeight,
    karat,
    makingFeePerGram,
    gemstoneValue
  );

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

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/30 backdrop-blur-md">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-mono text-[11px] text-emerald-400">
            {karat === 24 ? '$84.50' : '$63.38'} / g AU
          </span>
          <span className="text-[9px] text-white/50 uppercase">LIVE SPOT API</span>
        </div>
      </div>

      {/* Center Analytical Interactive Matrix (Right-side column on desktop) */}
      <div className="flex justify-end pointer-events-auto my-auto py-6">
        <div className="w-full max-w-md p-6 md:p-8 rounded-3xl border border-[#C8A45A]/30 bg-[#0c0b0a]/90 shadow-2xl backdrop-blur-2xl space-y-6">
          {/* Section Subtitle & Karat Selection */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-[#C8A45A] uppercase block">
                {language === 'fa' ? 'محاسبه‌گر ارزش واقعی' : 'INTRINSIC VALUE MATRIX'}
              </span>
              <h3 className="font-display text-base font-semibold text-[#F4F0E8] font-fa">
                {language === 'fa' ? 'سنجش دقیق خلوص و وزن' : 'Gold Grammage & Karat Calibration'}
              </h3>
            </div>

            {/* 18K vs 24K Toggle */}
            <div className="flex items-center gap-1 p-1 rounded-full border border-white/10 bg-black/50">
              <button
                onClick={() => {
                  setKarat(18);
                  luxuryAudio.playTick();
                }}
                className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${
                  karat === 18 ? 'bg-[#C8A45A] text-[#080808] font-bold' : 'text-white/60 hover:text-white'
                }`}
              >
                18K
              </button>
              <button
                onClick={() => {
                  setKarat(24);
                  luxuryAudio.playTick();
                }}
                className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${
                  karat === 24 ? 'bg-[#C8A45A] text-[#080808] font-bold' : 'text-white/60 hover:text-white'
                }`}
              >
                24K
              </button>
            </div>
          </div>

          {/* Weight Presets & Interactive Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#F4F0E8]/70 flex items-center gap-1 font-fa">
                <Scale className="w-3.5 h-3.5 text-[#C8A45A]" />
                {language === 'fa' ? 'وزن طلای خالص' : 'Physical Weight'}
              </span>
              <span className="font-mono text-lg text-[#C8A45A] font-semibold">
                {currentWeight.toFixed(2)} g
              </span>
            </div>

            {/* Quick Presets */}
            <div className="grid grid-cols-6 gap-1.5 mb-3">
              {weightPresets.map((w) => (
                <button
                  key={w}
                  onClick={() => {
                    onWeightChange(w);
                    luxuryAudio.playTick();
                  }}
                  className={`py-1.5 text-xs font-mono rounded-lg border transition-all ${
                    Math.abs(currentWeight - w) < 0.05
                      ? 'border-[#C8A45A] bg-[#C8A45A]/20 text-[#C8A45A] font-bold'
                      : 'border-white/10 bg-white/5 text-white/60 hover:border-white/30'
                  }`}
                >
                  {w}g
                </button>
              ))}
            </div>

            {/* Smooth range slider */}
            <Slider
              min={0.8}
              max={6.0}
              step={0.1}
              value={currentWeight}
              onChange={(val) => {
                onWeightChange(val);
                luxuryAudio.playTick();
              }}
            />
          </div>

          {/* Breakdown Items */}
          <div className="space-y-2 text-xs border-t border-white/10 pt-4">
            <div className="flex justify-between text-[#F4F0E8]/70">
              <span className="font-fa">{language === 'fa' ? 'ارزش طلای خام (نرخ زنده)' : 'Fine Gold Ingot Value'}</span>
              <span className="font-mono text-white">${priceBreakdown.goldCost.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[#F4F0E8]/70">
              <span className="font-fa">{language === 'fa' ? 'اجرت ساخت دست زرگر' : 'Master Goldsmith Atelier Fee'}</span>
              <span className="font-mono text-white">${priceBreakdown.makingCost.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[#F4F0E8]/70">
              <span className="font-fa">{language === 'fa' ? 'سنگ الماس دارای گواهی' : 'Certified Diamond Specimen'}</span>
              <span className="font-mono text-white">${priceBreakdown.stoneCost.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[#F4F0E8]/70">
              <span className="font-fa">{language === 'fa' ? 'مالیات عیارسنجی و بسته‌بندی' : 'Assay Office Registry'}</span>
              <span className="font-mono text-white">${priceBreakdown.tax.toLocaleString()}</span>
            </div>

            {/* Grand Total */}
            <div className="border-t border-[#C8A45A]/30 pt-3 flex items-baseline justify-between">
              <div>
                <span className="text-[10px] font-mono tracking-wider text-[#C8A45A] uppercase block">
                  {language === 'fa' ? 'ارزش نهایی اثر' : 'SOVEREIGN VALUE'}
                </span>
                <span className="text-xs text-white/50 font-fa">
                  {language === 'fa' ? 'با شناسنامه مادام‌العمر' : 'Lifetime Authenticated'}
                </span>
              </div>
              <span className="font-mono text-2xl md:text-3xl font-bold text-[#F4F0E8] tracking-tight">
                ${priceBreakdown.total.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Acquire / Configure Action */}
          <button
            onClick={() => {
              onAcquireConfiguration({
                weight: currentWeight,
                karat,
                total: priceBreakdown.total,
              });
              luxuryAudio.playGoldChime(880);
            }}
            className="w-full py-3.5 rounded-full bg-[#C8A45A] hover:bg-[#d6b46b] text-[#080808] font-semibold text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#C8A45A]/20 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span className="font-fa">
              {language === 'fa' ? 'ثبت و انتقال به سبد اختصاصی' : 'ACQUIRE THIS SPECIFICATION'}
            </span>
          </button>
        </div>
      </div>

      {/* Bottom Editorial Quote */}
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
