import { useState } from 'react';
import { JewelryProduct, Language } from '../types';
import { liveMarketPricing } from '../data/products';
import { X, ShieldCheck, Sparkles, Award, Ruler, Check } from 'lucide-react';
import { luxuryAudio } from '../utils/audio';

interface ProductModalProps {
  product: JewelryProduct | null;
  onClose: () => void;
  language: Language;
  onAddToCart: (product: JewelryProduct, size: string) => void;
}

const ringSizes = ['50 (US 5.25)', '52 (US 6.0)', '54 (US 6.75)', '56 (US 7.5)', '58 (US 8.25)', '60 (US 9.0)'];

export function ProductModal({ product, onClose, language, onAddToCart }: ProductModalProps) {
  if (!product) return null;

  const [selectedImage, setSelectedImage] = useState(product.image);
  const [selectedSize, setSelectedSize] = useState(ringSizes[2]);
  const [added, setAdded] = useState(false);

  const pricing = liveMarketPricing.calculatePrice(
    product.baseWeight,
    product.karat,
    product.makingFeePerGram,
    product.gemstoneValue
  );

  const handleAcquire = () => {
    onAddToCart(product, selectedSize);
    luxuryAudio.playGoldChime(880);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-xl animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl rounded-3xl border border-[#C8A45A]/40 bg-[#0c0b0a] shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 rtl:right-auto rtl:left-5 z-20 p-2.5 rounded-full bg-black/60 hover:bg-[#C8A45A] text-white hover:text-black transition-all border border-white/10 cursor-pointer"
          aria-label="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
          {/* Left / Visual High-Resolution Exhibition Gallery (7 cols) */}
          <div className="lg:col-span-7 bg-[#070605] p-6 md:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r rtl:lg:border-r-0 rtl:lg:border-l border-white/10">
            {/* Main Stage Image */}
            <div className="relative aspect-4/3 rounded-2xl overflow-hidden border border-white/10 bg-black/50 group">
              <img
                src={selectedImage}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-3 left-3 rtl:left-auto rtl:right-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-[#C8A45A]/30 text-[11px] font-mono text-[#C8A45A]">
                {product.hallmark}
              </div>
            </div>

            {/* Gallery Thumbnails */}
            <div className="flex items-center gap-3 mt-4 overflow-x-auto">
              {product.gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSelectedImage(img);
                    luxuryAudio.playTick();
                  }}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                    selectedImage === img ? 'border-[#C8A45A] scale-105 shadow-md' : 'border-white/10 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Craftsmanship Note */}
            <div className="mt-6 flex items-center gap-3 p-3.5 rounded-xl bg-white/5 border border-white/5 text-xs text-[#F4F0E8]/70">
              <Award className="w-4 h-4 text-[#C8A45A] shrink-0" />
              <span className="font-fa">
                {language === 'fa' ? product.craftsmanshipFa : product.craftsmanship}
              </span>
            </div>
          </div>

          {/* Right / Technical Specifications & Acquisition (5 cols) */}
          <div className="lg:col-span-5 p-6 md:p-10 flex flex-col justify-between space-y-6">
            <div>
              {/* Category & Title */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono tracking-widest text-[#C8A45A] uppercase">
                  {language === 'fa' ? product.categoryFa : product.category}
                </span>
                {product.limitedEdition && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#9B4D24]/20 text-[#FF8E4D] border border-[#9B4D24]/40">
                    EDITION OF {product.limitedEdition}
                  </span>
                )}
              </div>

              <h2 className={`text-2xl md:text-3xl font-medium text-[#F4F0E8] mt-2 ${
                language === 'fa' ? 'font-heading-fa tracking-normal' : 'font-display'
              }`}>
                {language === 'fa' ? product.nameFa : product.name}
              </h2>
              <p className="text-xs font-mono text-[#E6D3A3]/80 mt-1">
                {language === 'fa' ? product.subtitleFa : product.subtitle}
              </p>

              <p className="text-xs text-[#F4F0E8]/70 mt-4 leading-relaxed font-fa font-light">
                {language === 'fa' ? product.descriptionFa : product.description}
              </p>

              {/* Gemological 4Cs Certificate Matrix */}
              <div className="mt-6 p-4 rounded-2xl border border-white/10 bg-black/40 space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-[#C8A45A] font-mono text-[10px] uppercase flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    {language === 'fa' ? 'گواهی گوهرشناسی' : 'GEMOLOGICAL CERTIFICATE'}
                  </span>
                  <span className="text-[10px] text-white/40 font-mono">GIA VERIFIED</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                  <div>
                    <span className="text-white/40 block text-[9px] uppercase">CARAT WEIGHT</span>
                    <span className="text-[#F4F0E8]">{product.gemstone.carat} Carats</span>
                  </div>
                  <div>
                    <span className="text-white/40 block text-[9px] uppercase">CUT GRADE</span>
                    <span className="text-[#F4F0E8]">{product.gemstone.cut}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block text-[9px] uppercase">COLOR GRADE</span>
                    <span className="text-[#F4F0E8]">{product.gemstone.color}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block text-[9px] uppercase">CLARITY</span>
                    <span className="text-[#F4F0E8]">{product.gemstone.clarity}</span>
                  </div>
                </div>
              </div>

              {/* Ring Size Selector */}
              <div className="mt-5">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-[#F4F0E8]/70 flex items-center gap-1 font-fa">
                    <Ruler className="w-3.5 h-3.5 text-[#C8A45A]" />
                    {language === 'fa' ? 'انتخاب سایز انگشتر' : 'Ring Sizing (EU / US)'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {ringSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        setSelectedSize(size);
                        luxuryAudio.playTick();
                      }}
                      className={`py-2 text-[11px] font-mono rounded-lg border transition-all cursor-pointer ${
                        selectedSize === size
                          ? 'border-[#C8A45A] bg-[#C8A45A]/20 text-[#C8A45A] font-semibold'
                          : 'border-white/10 bg-white/5 text-white/60 hover:border-white/30'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Price and CTA */}
            <div className="border-t border-white/10 pt-5 space-y-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] font-mono text-[#C8A45A] uppercase block">
                    {language === 'fa' ? 'بهای نهایی با مالیات' : 'AUTHENTICATED PRICE'}
                  </span>
                  <span className="text-xs text-white/40 font-mono">
                    {product.karat}K Gold • {product.baseWeight} grams
                  </span>
                </div>
                <span className="font-mono text-2xl md:text-3xl font-bold text-[#F4F0E8]">
                  ${pricing.total.toLocaleString()}
                </span>
              </div>

              <button
                onClick={handleAcquire}
                disabled={added}
                className={`w-full py-4 rounded-full font-semibold text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl ${
                  added
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#C8A45A] hover:bg-[#d6b46b] text-[#080808] shadow-[#C8A45A]/20'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span className="font-fa">
                      {language === 'fa' ? 'به صندوقچه خصوصی افزوده شد' : 'ADDED TO PRIVATE VAULT'}
                    </span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span className="font-fa">
                      {language === 'fa' ? 'تملک و انتقال به صندوقچه' : 'ACQUIRE PIECE'}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
