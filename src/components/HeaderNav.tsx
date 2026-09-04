import { useState } from 'react';
import { Volume2, VolumeX, ShoppingBag, Sparkles, Compass } from 'lucide-react';
import { Language } from '../types';
import { narrativeSections } from '../data/narrative';
import { luxuryAudio } from '../utils/audio';

interface HeaderNavProps {
  currentSectionIndex: number;
  language: Language;
  onToggleLanguage: () => void;
  onSelectSection: (index: number) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenBespoke: () => void;
}

export function HeaderNav({
  currentSectionIndex,
  language,
  onToggleLanguage,
  onSelectSection,
  cartCount,
  onOpenCart,
  onOpenBespoke,
}: HeaderNavProps) {
  const [isAudioMuted, setIsAudioMuted] = useState(luxuryAudio.getMuted());
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleSound = () => {
    const muted = luxuryAudio.toggleMute();
    setIsAudioMuted(muted);
  };

  const currentSection = narrativeSections[currentSectionIndex] || narrativeSections[0];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none px-6 py-5 md:px-12 md:py-8 flex items-center justify-between">
      {/* Left / Brand Monogram */}
      <div className="pointer-events-auto flex items-center gap-4">
        <button
          onClick={() => onSelectSection(0)}
          className="group text-left focus:outline-none"
          aria-label="ZARVAND Home"
        >
          <span className="font-display tracking-[0.35em] text-sm md:text-base font-semibold text-[#F4F0E8] group-hover:text-[#C8A45A] transition-colors block">
            ZARVAND
          </span>
          <span className={`text-[10px] text-[#C8A45A]/70 uppercase block font-fa ${
            language === 'fa' ? 'tracking-normal' : 'tracking-[0.25em]'
          }`}>
            {language === 'fa' ? 'زروند • جواهرات فاخر' : 'HAUTE JOAILLERIE'}
          </span>
        </button>

        {/* Current Chapter Indicator Pill */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full border border-[#C8A45A]/20 bg-[#080808]/70 backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C8A45A] animate-pulse" />
          <span className="text-[11px] font-mono tracking-wider text-[#C8A45A]">
            {currentSection.romanNumeral}
          </span>
          <span className="text-[11px] text-[#F4F0E8]/80 font-fa">
            {language === 'fa' ? currentSection.titleFa : currentSection.title}
          </span>
        </div>
      </div>

      {/* Center Quick Navigation Dropdown / Drawer Button */}
      <div className="pointer-events-auto hidden md:flex items-center gap-1 px-4 py-1.5 rounded-full border border-white/10 bg-[#080808]/60 backdrop-blur-md">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center gap-2 text-xs tracking-widest text-[#F4F0E8]/80 hover:text-[#C8A45A] transition-colors py-1 px-2"
        >
          <Compass className="w-3.5 h-3.5 text-[#C8A45A]" />
          <span className="font-fa">
            {language === 'fa' ? 'فهرست فصل‌ها' : 'CHAPTERS'}
          </span>
        </button>

        {isMenuOpen && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 w-72 bg-[#0c0b0a]/95 border border-[#C8A45A]/30 rounded-xl p-3 shadow-2xl backdrop-blur-xl flex flex-col gap-1 z-50">
            {narrativeSections.map((sec, idx) => (
              <button
                key={sec.id}
                onClick={() => {
                  onSelectSection(idx);
                  setIsMenuOpen(false);
                  luxuryAudio.playTick();
                }}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                  currentSectionIndex === idx
                    ? 'bg-[#C8A45A]/15 text-[#C8A45A] font-semibold'
                    : 'text-[#F4F0E8]/70 hover:bg-white/5 hover:text-[#F4F0E8]'
                }`}
              >
                <span className="font-mono text-[#C8A45A]/60">{sec.romanNumeral}</span>
                <span className="font-fa">{language === 'fa' ? sec.titleFa : sec.title}</span>
                <span className="text-[10px] text-white/40">{Math.round(sec.progressStart * 100)}%</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="pointer-events-auto flex items-center gap-3 md:gap-4">
        {/* Bespoke Atelier Trigger */}
        <button
          onClick={() => {
            onOpenBespoke();
            luxuryAudio.playGoldChime(740);
          }}
          className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full border border-[#C8A45A]/40 bg-[#C8A45A]/10 hover:bg-[#C8A45A]/20 text-[#C8A45A] text-xs tracking-wider transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="font-fa">
            {language === 'fa' ? 'سفارش اختصاصی' : 'BESPOKE'}
          </span>
        </button>

        {/* Audio Toggle */}
        <button
          onClick={toggleSound}
          className="p-2.5 rounded-full border border-white/10 bg-[#080808]/70 hover:border-[#C8A45A]/50 text-[#F4F0E8]/80 hover:text-[#C8A45A] transition-all backdrop-blur-md"
          title={isAudioMuted ? 'Unmute Experience Audio' : 'Mute Audio'}
          aria-label="Sound Toggle"
        >
          {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#C8A45A]" />}
        </button>

        {/* Language Toggle */}
        <button
          onClick={() => {
            onToggleLanguage();
            luxuryAudio.playTick();
          }}
          className="px-3 py-1.5 rounded-full border border-white/10 bg-[#080808]/70 hover:border-[#C8A45A]/50 text-[#F4F0E8]/80 hover:text-[#C8A45A] text-xs font-mono tracking-widest transition-all backdrop-blur-md"
          aria-label="Toggle Persian / English"
        >
          {language === 'fa' ? 'EN' : 'فا'}
        </button>

        {/* Cart / Private Bag */}
        <button
          onClick={() => {
            onOpenCart();
            luxuryAudio.playGoldChime(580);
          }}
          className="relative p-2.5 rounded-full border border-[#C8A45A]/30 bg-[#080808]/80 hover:border-[#C8A45A] text-[#F4F0E8] transition-all backdrop-blur-md"
          aria-label="Open Vault Bag"
        >
          <ShoppingBag className="w-4 h-4 text-[#C8A45A]" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#C8A45A] text-[#080808] text-[10px] font-bold flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
