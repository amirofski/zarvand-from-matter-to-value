import { useState } from 'react';
import { Sparkles, Sun, Moon, Gem, LucideIcon } from 'lucide-react';
import { Language } from '../types';
import { luxuryAudio } from '../utils/audio';

export type LightingMode = 'atelier' | 'noir' | 'glint';

interface StudioAtmosphereControlsProps {
  language: Language;
  currentMode: LightingMode;
  onSelectMode: (mode: LightingMode) => void;
}

export function StudioAtmosphereControls({
  language,
  currentMode,
  onSelectMode,
}: StudioAtmosphereControlsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const modes: { id: LightingMode; labelFa: string; labelEn: string; icon: LucideIcon }[] = [
    { id: 'atelier', labelFa: 'کارگاه زرگری', labelEn: 'Atelier Key', icon: Sun },
    { id: 'noir', labelFa: 'سایه‌روشن نوآر', labelEn: 'Cinema Noir', icon: Moon },
    { id: 'glint', labelFa: 'درخشش قیراط', labelEn: 'Carat Glint', icon: Gem },
  ];

  const handleSelect = (mode: LightingMode) => {
    onSelectMode(mode);
    luxuryAudio.playTick();
  };

  const activeModeObj = modes.find((m) => m.id === currentMode) || modes[0];
  const ActiveIcon = activeModeObj.icon;

  return (
    <div className="fixed bottom-6 start-6 z-40 font-fa">
      <div className="relative">
        {/* Main Trigger Pill */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-full border border-[#C8A45A]/30 bg-[#0c0a08]/85 text-[#F4F0E8] backdrop-blur-xl hover:border-[#C8A45A]/60 transition-all shadow-xl text-xs group"
          title={language === 'fa' ? 'تنظیمات نورپردازی و اتمسفر' : 'Lighting & Atmosphere Setup'}
          aria-label="Lighting and Atmosphere"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C8A45A] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C8A45A]" />
          </span>

          <ActiveIcon className="w-3.5 h-3.5 text-[#C8A45A] group-hover:scale-110 transition-transform" />

          <span className="font-mono text-[10px] tracking-wider text-[#C8A45A] uppercase hidden sm:inline">
            STUDIO LIGHT:
          </span>
          <span className="text-xs font-light text-[#F4F0E8]">
            {language === 'fa' ? activeModeObj.labelFa : activeModeObj.labelEn}
          </span>
        </button>

        {/* Dropdown Options */}
        {isOpen && (
          <div className="absolute bottom-12 start-0 w-56 bg-[#0c0a08]/95 border border-[#C8A45A]/30 rounded-xl p-2 shadow-2xl backdrop-blur-2xl flex flex-col gap-1 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="px-2.5 py-1.5 border-b border-white/5 flex items-center justify-between">
              <span className="text-[10px] font-mono tracking-widest text-[#C8A45A]/70 uppercase">
                {language === 'fa' ? 'نورپردازی استودیو' : 'STUDIO ATMOSPHERE'}
              </span>
              <Sparkles className="w-3 h-3 text-[#C8A45A]" />
            </div>

            {modes.map((mode) => {
              const Icon = mode.icon;
              const isSelected = currentMode === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => {
                    handleSelect(mode.id);
                    setIsOpen(false);
                  }}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors w-full text-start ${
                    isSelected
                      ? 'bg-[#C8A45A]/20 text-[#E5C278] font-medium'
                      : 'text-[#F4F0E8]/70 hover:bg-white/5 hover:text-[#F4F0E8]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#C8A45A]' : 'text-white/40'}`} />
                  <span className="flex-1">
                    {language === 'fa' ? mode.labelFa : mode.labelEn}
                  </span>
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#C8A45A]" />}
                </button>
              );
            })}

            <div className="mt-1 pt-1.5 border-t border-white/5 px-2.5 text-[10px] text-white/40 leading-tight">
              {language === 'fa'
                ? 'ذرات کیهانی طلا و بازتاب الماس فعال است'
                : 'Gold stardust & facet caustics active'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
