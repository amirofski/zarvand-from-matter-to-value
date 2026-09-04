import { useState, useEffect, useRef, useCallback } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Language, JewelryProduct } from './types';
import { curatedProducts } from './data/products';
import { narrativeSections } from './data/narrative';
import { Canvas3D } from './components/Canvas3D';
import { HeaderNav } from './components/HeaderNav';
import { SectionMatter } from './sections/SectionMatter';
import { SectionFire } from './sections/SectionFire';
import { SectionForm } from './sections/SectionForm';
import { SectionCraft } from './sections/SectionCraft';
import { SectionIdentity } from './sections/SectionIdentity';
import { SectionValue } from './sections/SectionValue';
import { SectionCollection } from './sections/SectionCollection';
import { SectionOwnership } from './sections/SectionOwnership';
import { ProductModal } from './components/ProductModal';
import { CheckoutModal, CartItem } from './components/CheckoutModal';
import { BespokeModal } from './components/BespokeModal';
import { StudioAtmosphereControls, LightingMode } from './components/StudioAtmosphereControls';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [language, setLanguage] = useState<Language>('fa');
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [weightGrams, setWeightGrams] = useState(3.4);
  const [lightingMode, setLightingMode] = useState<LightingMode>('atelier');

  // Modals & E-commerce State
  const [selectedProduct, setSelectedProduct] = useState<JewelryProduct | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isBespokeOpen, setIsBespokeOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([
    // Initial sample piece ready for seamless checkout inspection
    {
      product: curatedProducts[0],
      size: '54 (US 6.75)',
      engraving: 'ZARVAND • 2026',
    },
  ]);

  const lenisRef = useRef<Lenis | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastSectionRef = useRef(0);

  // Synchronize document direction with language
  useEffect(() => {
    document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  // Initialize Lenis and GSAP ScrollTrigger
  useEffect(() => {
    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const lenis = new Lenis({
      duration: prefersReducedMotion ? 0.2 : 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: !prefersReducedMotion,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    // Master ScrollTrigger tracking whole page progress [0, 1]
    const trigger = ScrollTrigger.create({
      trigger: scrollContainerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;
        setScrollProgress(p);

        // Determine current chapter index
        let activeIdx = 0;
        for (let i = 0; i < narrativeSections.length; i++) {
          if (p >= narrativeSections[i].progressStart && p <= narrativeSections[i].progressEnd) {
            activeIdx = i;
            break;
          }
          if (p > narrativeSections[narrativeSections.length - 1].progressStart) {
            activeIdx = narrativeSections.length - 1;
          }
        }

        if (activeIdx !== lastSectionRef.current) {
          lastSectionRef.current = activeIdx;
          setCurrentSectionIndex(activeIdx);
        }
      },
    });

    return () => {
      trigger.kill();
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Programmatic smooth scroll to chapter
  const scrollToSection = useCallback((index: number) => {
    if (!lenisRef.current) return;
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const targetProgress = narrativeSections[index]?.progressStart || 0;
    const targetY = totalHeight * targetProgress;

    lenisRef.current.scrollTo(targetY, {
      duration: 1.4,
    });
  }, []);

  // Cart operations
  const handleAddToCart = (product: JewelryProduct, size: string) => {
    setCartItems((prev) => [...prev, { product, size }]);
  };

  const handleRemoveFromCart = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Add custom configured piece from Section 06 (Value)
  const handleAcquireConfiguration = (config: { weight: number; karat: 18 | 24; total: number }) => {
    const customConfiguredProduct: JewelryProduct = {
      ...curatedProducts[0],
      id: `custom-config-${Date.now()}`,
      name: `Solitaire Custom (${config.weight}g • ${config.karat}K)`,
      nameFa: `سفارشی اختصاصی (${config.weight} گرم • ${config.karat} عیار)`,
      baseWeight: config.weight,
      karat: config.karat,
    };
    handleAddToCart(customConfiguredProduct, '54 (US 6.75)');
    setIsCheckoutOpen(true);
  };

  return (
    <div className="relative bg-[#080808] text-[#F4F0E8] min-h-screen selection:bg-[#C8A45A] selection:text-[#080808]">
      {/* 3D WebGL Background Scene */}
      <Canvas3D scrollProgress={scrollProgress} weightGrams={weightGrams} lightingMode={lightingMode} />

      {/* Floating Header Navigation */}
      <HeaderNav
        currentSectionIndex={currentSectionIndex}
        language={language}
        onToggleLanguage={() => setLanguage((prev) => (prev === 'fa' ? 'en' : 'fa'))}
        onSelectSection={scrollToSection}
        cartCount={cartItems.length}
        onOpenCart={() => setIsCheckoutOpen(true)}
        onOpenBespoke={() => setIsBespokeOpen(true)}
      />

      {/* Studio Lighting & Atmosphere Switcher */}
      <StudioAtmosphereControls
        language={language}
        currentMode={lightingMode}
        onSelectMode={setLightingMode}
      />

      {/* Narrative Overlay Chapters */}
      <main ref={scrollContainerRef} className="relative z-10">
        {/* CHAPTER 01: MATTER (0.00 -> 0.12) */}
        <div id="section-matter" className="min-h-screen">
          <SectionMatter language={language} />
        </div>

        {/* CHAPTER 02: FIRE (0.12 -> 0.24) */}
        <div id="section-fire" className="min-h-screen">
          <SectionFire language={language} />
        </div>

        {/* CHAPTER 03: FORM (0.24 -> 0.36) */}
        <div id="section-form" className="min-h-screen">
          <SectionForm language={language} />
        </div>

        {/* CHAPTER 04: CRAFT (0.36 -> 0.50) */}
        <div id="section-craft" className="min-h-screen">
          <SectionCraft language={language} />
        </div>

        {/* CHAPTER 05: IDENTITY (0.50 -> 0.63) */}
        <div id="section-identity" className="min-h-screen">
          <SectionIdentity language={language} />
        </div>

        {/* CHAPTER 06: VALUE (0.63 -> 0.76) */}
        <div id="section-value" className="min-h-screen">
          <SectionValue
            language={language}
            currentWeight={weightGrams}
            onWeightChange={setWeightGrams}
            onAcquireConfiguration={handleAcquireConfiguration}
          />
        </div>

        {/* CHAPTER 07: COLLECTION (0.76 -> 0.90) */}
        <div id="section-collection" className="min-h-screen">
          <SectionCollection
            language={language}
            onSelectProduct={(p) => setSelectedProduct(p)}
          />
        </div>

        {/* CHAPTER 08: OWNERSHIP (0.90 -> 1.00) */}
        <div id="section-ownership" className="min-h-screen">
          <SectionOwnership
            language={language}
            onDiscoverCollection={() => scrollToSection(6)}
            onCreatePiece={() => setIsBespokeOpen(true)}
          />
        </div>
      </main>

      {/* High-Resolution Product Inspection Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        language={language}
        onAddToCart={handleAddToCart}
      />

      {/* Seamless Luxury Checkout Process Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        language={language}
      />

      {/* Atelier Bespoke Commission Studio Modal */}
      <BespokeModal
        isOpen={isBespokeOpen}
        onClose={() => setIsBespokeOpen(false)}
        language={language}
      />
    </div>
  );
}
