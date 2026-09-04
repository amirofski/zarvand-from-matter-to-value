import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Language, JewelryCategory, JewelryProduct } from '../types';
import { narrativeSections } from '../data/narrative';
import { curatedProducts, liveMarketPricing } from '../data/products';
import { Eye, ArrowUpRight, Filter, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { luxuryAudio } from '../utils/audio';

interface SectionCollectionProps {
  language: Language;
  onSelectProduct: (product: JewelryProduct) => void;
}

const categories: { key: JewelryCategory | 'ALL'; label: string; labelFa: string }[] = [
  { key: 'ALL', label: 'FULL EXHIBITION', labelFa: 'همه آثار' },
  { key: 'SIGNATURE', label: 'SIGNATURE', labelFa: 'امضای زروند' },
  { key: 'EVERYDAY', label: 'EVERYDAY', labelFa: 'روزمره' },
  { key: 'WEDDING', label: 'WEDDING', labelFa: 'حلقه‌های ازدواج' },
  { key: 'BESPOKE', label: 'BESPOKE', labelFa: 'آتلیه سفارشی' },
  { key: 'INVESTMENT', label: 'INVESTMENT', labelFa: 'سرمایه‌گذاری ناب' },
];

interface CardTransform {
  rotateY: number;
  translateZ: number;
  scale: number;
  opacity: number;
  glareShift: number;
  isActive: boolean;
}

export function SectionCollection({ language, onSelectProduct }: SectionCollectionProps) {
  const section = narrativeSections[6];
  const [activeCategory, setActiveCategory] = useState<JewelryCategory | 'ALL'>('ALL');

  const filtered = activeCategory === 'ALL'
    ? curatedProducts
    : curatedProducts.filter((p) => p.category === activeCategory);

  // 3D Horizontal Scroll Engine Refs & State
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [cardTransforms, setCardTransforms] = useState<CardTransform[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredCardIdx, setHoveredCardIdx] = useState<number | null>(null);
  const [hoverTilt, setHoverTilt] = useState<{ x: number; y: number; glareX: number; glareY: number } | null>(null);

  // Drag tracking refs
  const isPointerDownRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);
  const hasMovedRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);

  // Calculate 3D transformation for each card based on container center
  const update3DTransforms = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const containerCenterX = containerRect.left + containerRect.width / 2;
    const halfWidth = containerRect.width * 0.45;

    let minDistance = Infinity;
    let closestIndex = 0;

    const newTransforms: CardTransform[] = filtered.map((_, idx) => {
      const card = cardRefs.current[idx];
      if (!card) {
        return {
          rotateY: 0,
          translateZ: 0,
          scale: 1,
          opacity: 1,
          glareShift: 50,
          isActive: idx === 0,
        };
      }

      const cardRect = card.getBoundingClientRect();
      const cardCenterX = cardRect.left + cardRect.width / 2;
      const offset = cardCenterX - containerCenterX;
      const dist = Math.abs(offset);

      if (dist < minDistance) {
        minDistance = dist;
        closestIndex = idx;
      }

      // Normalized ratio [-1.5, 1.5]
      const ratio = Math.max(-1.5, Math.min(1.5, offset / (halfWidth || 1)));

      // 3D Curvature & Depth Math
      // Items to the left tilt inward toward center; items to right tilt inward
      const rotateY = -ratio * 20; // In degrees
      // Center item pops forward (+45px); receding items descend to -130px
      const translateZ = Math.max(-130, 40 - Math.pow(Math.abs(ratio), 1.3) * 110);
      const scale = Math.max(0.88, 1.03 - Math.abs(ratio) * 0.1);
      const opacity = Math.max(0.55, 1 - Math.abs(ratio) * 0.28);
      const glareShift = 50 + ratio * 30;

      return {
        rotateY,
        translateZ,
        scale,
        opacity,
        glareShift,
        isActive: false,
      };
    });

    if (newTransforms[closestIndex]) {
      newTransforms[closestIndex].isActive = true;
    }

    // Determine if cards exist to the left or right of container center
    let hasLeft = false;
    let hasRight = false;
    cardRefs.current.forEach((card) => {
      if (!card) return;
      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.left + cardRect.width / 2;
      if (cardCenter - containerCenterX < -25) hasLeft = true;
      if (cardCenter - containerCenterX > 25) hasRight = true;
    });

    setCanScrollLeft(hasLeft);
    setCanScrollRight(hasRight);

    setActiveIndex(closestIndex);
    setCardTransforms(newTransforms);
  }, [filtered]);

  // Request Animation Frame scroll listener for smooth 60fps 3D updates
  const handleScroll = useCallback(() => {
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }
    rafIdRef.current = requestAnimationFrame(() => {
      update3DTransforms();
    });
  }, [update3DTransforms]);

  // Handle native wheel event to smoothly scroll horizontally
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const onWheel = (e: WheelEvent) => {
      // Prioritize horizontal movement, convert vertical wheel into smooth horizontal scroll
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        container.scrollLeft += e.deltaY * 0.9;
      } else if (Math.abs(e.deltaX) > 0) {
        e.preventDefault();
        container.scrollLeft += e.deltaX * 0.9;
      }
    };

    container.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', onWheel);
    };
  }, []);

  // Update transforms on mount, category change, and window resize
  useEffect(() => {
    // Initial measurement
    const timer = setTimeout(() => {
      update3DTransforms();
    }, 50);

    const handleResize = () => update3DTransforms();
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [update3DTransforms, activeCategory]);

  // Scroll to a specific card smoothly
  const scrollToCard = useCallback((targetIdx: number) => {
    const container = scrollContainerRef.current;
    const card = cardRefs.current[targetIdx];
    if (!container || !card) return;

    const containerRect = container.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const currentScroll = container.scrollLeft;
    const delta = (cardRect.left + cardRect.width / 2) - (containerRect.left + containerRect.width / 2);

    container.scrollTo({
      left: currentScroll + delta,
      behavior: 'smooth',
    });
    luxuryAudio.playTick();
  }, []);

  // Physical directional scrolling (scroll towards left screen edge or right screen edge)
  const scrollInDirection = useCallback(
    (direction: 'left' | 'right') => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const containerCenter = containerRect.left + containerRect.width / 2;

      const candidates: { idx: number; distance: number }[] = [];

      cardRefs.current.forEach((card, idx) => {
        if (!card) return;
        const cardRect = card.getBoundingClientRect();
        const cardCenter = cardRect.left + cardRect.width / 2;
        const diff = cardCenter - containerCenter;

        if (direction === 'left' && diff < -25) {
          candidates.push({ idx, distance: Math.abs(diff) });
        } else if (direction === 'right' && diff > 25) {
          candidates.push({ idx, distance: Math.abs(diff) });
        }
      });

      if (candidates.length > 0) {
        candidates.sort((a, b) => a.distance - b.distance);
        scrollToCard(candidates[0].idx);
      }
    },
    [scrollToCard]
  );

  // Drag to scroll handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!scrollContainerRef.current) return;
    isPointerDownRef.current = true;
    startXRef.current = e.clientX;
    startScrollLeftRef.current = scrollContainerRef.current.scrollLeft;
    hasMovedRef.current = false;
    setIsDragging(true);
    scrollContainerRef.current.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPointerDownRef.current || !scrollContainerRef.current) return;
    const dx = e.clientX - startXRef.current;
    if (Math.abs(dx) > 4) {
      hasMovedRef.current = true;
    }
    scrollContainerRef.current.scrollLeft = startScrollLeftRef.current - dx;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isPointerDownRef.current) return;
    isPointerDownRef.current = false;
    setIsDragging(false);
    if (scrollContainerRef.current) {
      try {
        scrollContainerRef.current.releasePointerCapture(e.pointerId);
      } catch {
        // Safe fallback
      }
    }
  };

  // Holographic card micro-tilt on mouse move
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>, idx: number) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const normX = (x / rect.width - 0.5) * 2;
    const normY = (y / rect.height - 0.5) * 2;

    setHoveredCardIdx(idx);
    setHoverTilt({
      x: normX * 8, // rotateY tilt
      y: -normY * 8, // rotateX tilt
      glareX: (x / rect.width) * 100,
      glareY: (y / rect.height) * 100,
    });
  };

  const handleCardMouseLeave = () => {
    setHoveredCardIdx(null);
    setHoverTilt(null);
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-between p-8 md:p-16 pointer-events-none">
      {/* Top Header & Category Exhibition Filters */}
      <div className="pt-16 md:pt-20 pointer-events-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
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

          {/* Categories Pill Bar */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-full border border-white/10 bg-[#0c0b0a]/80 backdrop-blur-md">
            <span className="text-xs text-[#C8A45A] px-2 flex items-center gap-1 hidden sm:flex">
              <Filter className="w-3 h-3" />
            </span>
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => {
                  setActiveCategory(cat.key);
                  luxuryAudio.playTick();
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all ${
                  activeCategory === cat.key
                    ? 'bg-[#C8A45A] text-[#080808] font-semibold'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {language === 'fa' ? cat.labelFa : cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Spatial 3D Horizontal Gallery Display */}
      <div className="relative my-auto py-6 md:py-10 pointer-events-auto w-full">
        {/* Floating 3D Navigation Arrows */}
        <div className="absolute inset-y-0 left-2 md:left-6 flex items-center z-30 pointer-events-none">
          <button
            type="button"
            onClick={() => scrollInDirection('left')}
            disabled={!canScrollLeft}
            aria-label={language === 'fa' ? 'اثر سمت چپ' : 'Left masterpiece'}
            className={`pointer-events-auto p-3.5 rounded-full border transition-all duration-300 shadow-xl backdrop-blur-xl ${
              !canScrollLeft
                ? 'border-white/5 text-white/20 bg-black/40 cursor-not-allowed'
                : 'border-[#C8A45A]/40 text-[#C8A45A] bg-[#0e0c0a]/90 hover:bg-[#C8A45A] hover:text-[#080808] hover:scale-110 active:scale-95 hover:shadow-[0_0_20px_rgba(200,164,90,0.3)]'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        <div className="absolute inset-y-0 right-2 md:right-6 flex items-center z-30 pointer-events-none">
          <button
            type="button"
            onClick={() => scrollInDirection('right')}
            disabled={!canScrollRight}
            aria-label={language === 'fa' ? 'اثر سمت راست' : 'Right masterpiece'}
            className={`pointer-events-auto p-3.5 rounded-full border transition-all duration-300 shadow-xl backdrop-blur-xl ${
              !canScrollRight
                ? 'border-white/5 text-white/20 bg-black/40 cursor-not-allowed'
                : 'border-[#C8A45A]/40 text-[#C8A45A] bg-[#0e0c0a]/90 hover:bg-[#C8A45A] hover:text-[#080808] hover:scale-110 active:scale-95 hover:shadow-[0_0_20px_rgba(200,164,90,0.3)]'
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* 3D Perspective Scrollable Stage */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          data-lenis-prevent="true"
          style={{
            perspective: '1400px',
            perspectiveOrigin: '50% 50%',
            WebkitOverflowScrolling: 'touch',
          }}
          className={`overflow-x-auto overflow-y-visible scrollbar-none py-10 px-6 md:px-24 select-none ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
        >
          <div
            style={{ transformStyle: 'preserve-3d' }}
            className="flex items-center gap-8 md:gap-12 min-w-max px-4 py-4"
          >
            {filtered.map((product, idx) => {
              const price = liveMarketPricing.calculatePrice(
                product.baseWeight,
                product.karat,
                product.makingFeePerGram,
                product.gemstoneValue
              );

              const transform = cardTransforms[idx] || {
                rotateY: 0,
                translateZ: 0,
                scale: 1,
                opacity: 1,
                glareShift: 50,
                isActive: idx === 0,
              };

              const isHovered = hoveredCardIdx === idx;
              const hoverY = isHovered && hoverTilt ? hoverTilt.x : 0;
              const hoverX = isHovered && hoverTilt ? hoverTilt.y : 0;
              const finalRotateY = transform.rotateY + hoverY;
              const finalTranslateZ = transform.translateZ + (isHovered ? 25 : 0);
              const finalScale = transform.scale * (isHovered ? 1.02 : 1);

              return (
                <div
                  key={product.id}
                  ref={(el) => {
                    cardRefs.current[idx] = el;
                  }}
                  onMouseMove={(e) => handleCardMouseMove(e, idx)}
                  onMouseLeave={handleCardMouseLeave}
                  onClick={() => {
                    if (hasMovedRef.current) return;
                    onSelectProduct(product);
                    luxuryAudio.playGoldChime(660);
                  }}
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: `perspective(1400px) translateZ(${finalTranslateZ}px) rotateY(${finalRotateY}deg) rotateX(${hoverX}deg) scale(${finalScale})`,
                    transition: isDragging
                      ? 'none'
                      : isHovered
                      ? 'transform 0.08s ease-out, box-shadow 0.3s ease'
                      : 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease, box-shadow 0.35s ease',
                    opacity: transform.opacity,
                    boxShadow: transform.isActive
                      ? '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 35px rgba(200, 164, 90, 0.25)'
                      : '0 15px 35px -10px rgba(0, 0, 0, 0.75)',
                  }}
                  className={`group relative w-76 sm:w-84 md:w-92 rounded-3xl border bg-[#0e0c0a]/90 p-6 md:p-7 backdrop-blur-xl cursor-pointer will-change-transform ${
                    transform.isActive
                      ? 'border-[#C8A45A] bg-[#14100c]/95 ring-1 ring-[#C8A45A]/30'
                      : 'border-[#4A3427]/40 hover:border-[#C8A45A]/70 hover:bg-[#120e0a]/95'
                  }`}
                >
                  {/* Dynamic 3D Specular Light Sheen Overlay */}
                  <div
                    className="absolute inset-0 rounded-3xl pointer-events-none transition-opacity duration-500 overflow-hidden"
                    style={{
                      background: isHovered && hoverTilt
                        ? `radial-gradient(circle at ${hoverTilt.glareX}% ${hoverTilt.glareY}%, rgba(200, 164, 90, 0.22) 0%, transparent 65%)`
                        : `linear-gradient(${120 + transform.rotateY}deg, rgba(200, 164, 90, ${
                            transform.isActive ? '0.14' : '0.06'
                          }) 0%, transparent 60%)`,
                    }}
                  />

                  {/* 3D Depth Visual Image Container */}
                  <div
                    style={{ transform: 'translateZ(20px)' }}
                    className="relative aspect-square rounded-2xl overflow-hidden bg-black/50 border border-white/10 mb-5 group-hover:border-[#C8A45A]/50 transition-all duration-500 shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)]"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 filter brightness-95 contrast-105"
                      draggable={false}
                    />

                    {/* Karat & Weight Badge */}
                    <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-[#C8A45A]/30 text-[10px] font-mono text-[#C8A45A] shadow-lg">
                      {product.karat}K AU • {product.baseWeight}G
                    </div>

                    {/* Active Exhibition Highlight Pill */}
                    {transform.isActive && (
                      <div className="absolute top-3 right-3 rtl:right-auto rtl:left-3 px-2 py-0.5 rounded-full bg-[#C8A45A] text-[#080808] text-[9px] font-mono font-bold tracking-wider uppercase flex items-center gap-1 shadow-md">
                        <Sparkles className="w-2.5 h-2.5" />
                        {language === 'fa' ? 'مرکز نمایش' : 'CENTER'}
                      </div>
                    )}

                    {/* Hover Inspect Icon */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="p-3.5 rounded-full bg-[#C8A45A] text-[#080808] shadow-[0_0_25px_rgba(200,164,90,0.5)] transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <Eye className="w-5 h-5" />
                      </span>
                    </div>
                  </div>

                  {/* Info Hierarchy with Depth Offset */}
                  <div style={{ transform: 'translateZ(15px)' }} className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display text-lg md:text-xl font-semibold text-[#F4F0E8] group-hover:text-[#C8A45A] transition-colors font-fa">
                        {language === 'fa' ? product.nameFa : product.name}
                      </h3>
                      <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-[#C8A45A] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 mt-1" />
                    </div>

                    <p className="text-xs text-[#E6D3A3]/75 font-mono truncate">
                      {language === 'fa' ? product.subtitleFa : product.subtitle}
                    </p>

                    <div className="border-t border-white/10 pt-3 flex items-baseline justify-between">
                      <span className="text-[11px] text-[#F4F0E8]/60 font-mono">
                        {product.gemstone.cut} • {product.gemstone.carat} ct
                      </span>
                      <span className="font-mono text-base md:text-lg font-bold text-[#F4F0E8] group-hover:text-[#C8A45A] transition-colors">
                        ${price.total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Interactive Navigation Dots Timeline */}
        <div className="mt-4 px-4 flex items-center justify-center">
          <div className="flex items-center gap-2 p-1.5 rounded-full border border-white/10 bg-[#0c0b0a]/80 backdrop-blur-md">
            {filtered.map((p, dotIdx) => (
              <button
                key={p.id}
                type="button"
                onClick={() => scrollToCard(dotIdx)}
                aria-label={`Go to piece ${dotIdx + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  activeIndex === dotIdx
                    ? 'w-6 h-2 bg-[#C8A45A] shadow-[0_0_10px_rgba(200,164,90,0.6)]'
                    : 'w-2 h-2 bg-white/25 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
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

