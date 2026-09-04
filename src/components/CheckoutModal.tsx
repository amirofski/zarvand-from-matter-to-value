import { useState } from 'react';
import { JewelryProduct, Language } from '../types';
import { liveMarketPricing } from '../data/products';
import { X, ShieldCheck, Lock, Sparkles, CheckCircle, Truck, Key } from 'lucide-react';
import { luxuryAudio } from '../utils/audio';

export interface CartItem {
  product: JewelryProduct;
  size: string;
  engraving?: string;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
  language: Language;
}

export function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  onRemoveItem,
  onClearCart,
  language,
}: CheckoutModalProps) {
  if (!isOpen) return null;

  const [step, setStep] = useState<'cart' | 'shipping' | 'payment' | 'success'>('cart');
  const [engravings, setEngravings] = useState<{ [index: number]: string }>({});
  const [shippingMethod, setShippingMethod] = useState<'courier' | 'salon' | 'vault'>('courier');
  const [formData, setFormData] = useState({
    name: 'Amir Devel',
    email: 'amir.devel@gmail.com',
    address: 'Velenjak, Tehran, Iran',
    phone: '+98 912 000 0000',
  });
  const [certificateId, setCertificateId] = useState('');

  // Calculate subtotal
  const subtotal = cartItems.reduce((acc, item) => {
    const p = liveMarketPricing.calculatePrice(
      item.product.baseWeight,
      item.product.karat,
      item.product.makingFeePerGram,
      item.product.gemstoneValue
    );
    return acc + p.total;
  }, 0);

  const handleCompleteOrder = () => {
    luxuryAudio.playGoldChime(1040);
    const newCert = `ZAR-${Math.floor(100000 + Math.random() * 900000)}-AU`;
    setCertificateId(newCert);
    setStep('success');
    onClearCart();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-xl animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl rounded-3xl border border-[#C8A45A]/40 bg-[#0c0b0a] shadow-2xl overflow-hidden my-auto p-6 md:p-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-[#C8A45A]/15 border border-[#C8A45A]/30 text-[#C8A45A]">
              <Lock className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-display text-lg md:text-xl font-semibold text-[#F4F0E8] font-fa">
                {language === 'fa' ? 'صندوقچه اختصاصی و نهایی‌سازی سفارش' : 'Private Vault & Seamless Acquisition'}
              </h3>
              <span className="text-[10px] font-mono text-[#C8A45A] tracking-wider uppercase">
                {step === 'cart' && (language === 'fa' ? 'مرحله ۱: بررسی قطعات' : 'STEP 1: VAULT MANIFEST')}
                {step === 'shipping' && (language === 'fa' ? 'مرحله ۲: نحوه تحویل و شخصی‌سازی' : 'STEP 2: DISPATCH & ENGRAVING')}
                {step === 'payment' && (language === 'fa' ? 'مرحله ۳: تایید تسویه امن' : 'STEP 3: SECURE SETTLEMENT')}
                {step === 'success' && (language === 'fa' ? 'صدور گواهی مالکیت رسمی' : 'CERTIFICATE OF TITLE ISSUED')}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ================= STEP 1: CART REVIEW ================= */}
        {step === 'cart' && (
          <div className="py-6 space-y-6">
            {cartItems.length === 0 ? (
              <div className="py-12 text-center space-y-4">
                <Sparkles className="w-8 h-8 text-[#C8A45A]/40 mx-auto" />
                <p className="text-sm text-[#F4F0E8]/60 font-fa">
                  {language === 'fa' ? 'صندوقچه شما در حال حاضر خالی است.' : 'Your private vault bag is currently empty.'}
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-full bg-[#C8A45A]/20 hover:bg-[#C8A45A]/30 text-[#C8A45A] text-xs font-mono uppercase tracking-wider"
                >
                  {language === 'fa' ? 'بازگشت به گالری آثار' : 'EXPLORE COLLECTION'}
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {cartItems.map((item, idx) => {
                    const price = liveMarketPricing.calculatePrice(
                      item.product.baseWeight,
                      item.product.karat,
                      item.product.makingFeePerGram,
                      item.product.gemstoneValue
                    );

                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-4 rounded-2xl border border-white/10 bg-white/5 gap-4"
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          referrerPolicy="no-referrer"
                          className="w-16 h-16 rounded-xl object-cover border border-white/10"
                        />
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-[#F4F0E8] font-fa">
                            {language === 'fa' ? item.product.nameFa : item.product.name}
                          </h4>
                          <span className="text-[11px] font-mono text-[#E6D3A3]">
                            Size: {item.size} • {item.product.karat}K Gold • {item.product.baseWeight}g
                          </span>
                        </div>
                        <div className="text-right rtl:text-left">
                          <span className="font-mono text-base font-bold text-[#F4F0E8] block">
                            ${price.total.toLocaleString()}
                          </span>
                          <button
                            onClick={() => {
                              onRemoveItem(idx);
                              luxuryAudio.playTick();
                            }}
                            className="text-[10px] text-red-400/80 hover:text-red-400 font-mono tracking-wider cursor-pointer"
                          >
                            REMOVE
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-white/10 pt-4 flex items-baseline justify-between">
                  <span className="text-xs text-white/50 uppercase font-mono">
                    {language === 'fa' ? 'جمع کل به همراه مالیات و شناسنامه' : 'TOTAL VAULT ALLOCATION'}
                  </span>
                  <span className="font-mono text-2xl font-bold text-[#C8A45A]">
                    ${subtotal.toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={() => {
                    setStep('shipping');
                    luxuryAudio.playTick();
                  }}
                  className="w-full py-4 rounded-full bg-[#C8A45A] hover:bg-[#d6b46b] text-[#080808] font-semibold text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#C8A45A]/20"
                >
                  <span className="font-fa">
                    {language === 'fa' ? 'ادامه به مرحله تحویل و شخصی‌سازی' : 'PROCEED TO DISPATCH & ENGRAVING'}
                  </span>
                </button>
              </>
            )}
          </div>
        )}

        {/* ================= STEP 2: DISPATCH & ENGRAVING ================= */}
        {step === 'shipping' && (
          <div className="py-6 space-y-6">
            {/* Custom Engraving */}
            <div className="p-5 rounded-2xl border border-white/10 bg-black/40 space-y-3">
              <div className="flex items-center gap-2 text-xs text-[#C8A45A] font-mono">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{language === 'fa' ? 'حکاکی لیزری اختصاصی (رایگان)' : 'COMPLIMENTARY LASER ENGRAVING'}</span>
              </div>
              <p className="text-xs text-white/60 font-fa">
                {language === 'fa'
                  ? 'متن کوتاه، تاریخ یا حروف مد نظر برای حک شدن روی جداره داخلی انگشتر (حداکثر ۲۰ حرف):'
                  : 'Specify initials, significant date, or coordinates to be laser-engraved inside the inner shank:'}
              </p>
              <input
                type="text"
                placeholder="e.g. ZARVAND • 2026 • A & M"
                maxLength={24}
                value={engravings[0] || ''}
                onChange={(e) => setEngravings({ ...engravings, 0: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-[#F4F0E8] font-mono focus:border-[#C8A45A] focus:outline-none"
              />
            </div>

            {/* Delivery Method */}
            <div className="space-y-3">
              <span className="text-xs text-white/50 uppercase font-mono block">
                {language === 'fa' ? 'روش ترخیص و تحویل مرسوله' : 'DISPATCH PROTOCOL'}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setShippingMethod('courier')}
                  className={`p-4 rounded-xl border text-left rtl:text-right transition-all cursor-pointer ${
                    shippingMethod === 'courier'
                      ? 'border-[#C8A45A] bg-[#C8A45A]/15 text-white'
                      : 'border-white/10 bg-white/5 text-white/60 hover:border-white/25'
                  }`}
                >
                  <Truck className="w-4 h-4 text-[#C8A45A] mb-2" />
                  <span className="text-xs font-semibold block font-fa">
                    {language === 'fa' ? 'پیک زره‌پوش بیمه‌شده' : 'Armored Courier'}
                  </span>
                  <span className="text-[10px] text-white/50 block font-mono mt-1">100% Insured Global</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShippingMethod('salon')}
                  className={`p-4 rounded-xl border text-left rtl:text-right transition-all cursor-pointer ${
                    shippingMethod === 'salon'
                      ? 'border-[#C8A45A] bg-[#C8A45A]/15 text-white'
                      : 'border-white/10 bg-white/5 text-white/60 hover:border-white/25'
                  }`}
                >
                  <Key className="w-4 h-4 text-[#C8A45A] mb-2" />
                  <span className="text-xs font-semibold block font-fa">
                    {language === 'fa' ? 'تحویل در سالن اختصاصی' : 'Atelier VIP Salon'}
                  </span>
                  <span className="text-[10px] text-white/50 block font-mono mt-1">Tehran / Zurich Private</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShippingMethod('vault')}
                  className={`p-4 rounded-xl border text-left rtl:text-right transition-all cursor-pointer ${
                    shippingMethod === 'vault'
                      ? 'border-[#C8A45A] bg-[#C8A45A]/15 text-white'
                      : 'border-white/10 bg-white/5 text-white/60 hover:border-white/25'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-[#C8A45A] mb-2" />
                  <span className="text-xs font-semibold block font-fa">
                    {language === 'fa' ? 'امانت در خزانه امن' : 'Bonded Freeport'}
                  </span>
                  <span className="text-[10px] text-white/50 block font-mono mt-1">Allocated Storage</span>
                </button>
              </div>
            </div>

            {/* Recipient Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-mono text-white/40 block mb-1">RECIPIENT NAME</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-[#F4F0E8] focus:border-[#C8A45A] focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono text-white/40 block mb-1">SECURE EMAIL</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-[#F4F0E8] focus:border-[#C8A45A] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep('cart')}
                className="px-6 py-3 rounded-full border border-white/10 hover:border-white/30 text-xs text-white/70 font-mono uppercase"
              >
                {language === 'fa' ? 'بازگشت' : 'BACK'}
              </button>
              <button
                onClick={() => {
                  setStep('payment');
                  luxuryAudio.playTick();
                }}
                className="flex-1 py-3.5 rounded-full bg-[#C8A45A] hover:bg-[#d6b46b] text-[#080808] font-semibold text-xs tracking-widest uppercase transition-all flex items-center justify-center cursor-pointer shadow-lg"
              >
                <span className="font-fa">
                  {language === 'fa' ? 'ادامه به تسویه نهایی' : 'CONTINUE TO SETTLEMENT'}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: PAYMENT ================= */}
        {step === 'payment' && (
          <div className="py-6 space-y-6">
            <div className="p-5 rounded-2xl border border-white/10 bg-black/40 space-y-4">
              <div className="flex justify-between items-center text-xs pb-3 border-b border-white/5">
                <span className="text-white/60 font-fa">{language === 'fa' ? 'تعداد قطعات' : 'Total Items'}</span>
                <span className="font-mono text-white">{cartItems.length} Pieces</span>
              </div>
              <div className="flex justify-between items-center text-xs pb-3 border-b border-white/5">
                <span className="text-white/60 font-fa">{language === 'fa' ? 'ارسال زره‌پوش و بیمه' : 'Armored Logistics & Insurance'}</span>
                <span className="font-mono text-emerald-400">COMPLIMENTARY</span>
              </div>
              <div className="flex justify-between items-center text-sm pt-1">
                <span className="font-semibold text-white font-fa">{language === 'fa' ? 'مبلغ قابل پرداخت' : 'Total Acquisition Amount'}</span>
                <span className="font-mono text-2xl font-bold text-[#C8A45A]">${subtotal.toLocaleString()}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-950/20 text-xs text-emerald-300/90 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-400" />
              <span className="font-fa">
                {language === 'fa'
                  ? 'تمامی تراکنش‌ها توسط دفتر اسناد و عیارسنجی رسمی بیمه شده و شناسه اختصاصی صادر می‌شود.'
                  : 'All acquisitions are legally registered with the Official Assay Bureau and backed by a lifetime title deed.'}
              </span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep('shipping')}
                className="px-6 py-3 rounded-full border border-white/10 hover:border-white/30 text-xs text-white/70 font-mono uppercase"
              >
                {language === 'fa' ? 'بازگشت' : 'BACK'}
              </button>
              <button
                onClick={handleCompleteOrder}
                className="flex-1 py-4 rounded-full bg-[#C8A45A] hover:bg-[#d6b46b] text-[#080808] font-bold text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-[#C8A45A]/30"
              >
                <Sparkles className="w-4 h-4" />
                <span className="font-fa">
                  {language === 'fa' ? 'تایید و ثبت نهایی مالکیت' : 'AUTHORIZE ACQUISITION'}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 4: SUCCESS & CERTIFICATE ================= */}
        {step === 'success' && (
          <div className="py-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#C8A45A]/20 border border-[#C8A45A] flex items-center justify-center mx-auto text-[#C8A45A]">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] font-mono tracking-widest text-[#C8A45A] uppercase block">
                {language === 'fa' ? 'سند رسمی مالکیت اثر' : 'DEED OF TITLE & PROVENANCE'}
              </span>
              <h3 className="font-display text-2xl font-bold text-[#F4F0E8] mt-1 font-fa">
                {language === 'fa' ? 'مالکیت اثر با موفقیت به نام شما ثبت گردید' : 'Title Successfully Registered'}
              </h3>
              <p className="text-xs text-white/60 font-fa mt-2 max-w-md mx-auto">
                {language === 'fa'
                  ? 'نسخه دیجیتال شناسنامه و جزییات تحویل به ایمیل شما ارسال شد. نماینده ویژه آتلیه جهت هماهنگی با شما تماس خواهد گرفت.'
                  : 'The digital certificate of title and courier dispatch coordinates have been routed to your private email.'}
              </p>
            </div>

            {/* Official Certificate Badge Box */}
            <div className="max-w-md mx-auto p-5 rounded-2xl border border-[#C8A45A]/50 bg-black/60 backdrop-blur-xl text-left rtl:text-right font-mono text-xs space-y-2">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-white/40">CERTIFICATE NO:</span>
                <span className="text-[#C8A45A] font-bold">{certificateId}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-white/40">REGISTERED HOLDER:</span>
                <span className="text-[#F4F0E8]">{formData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">ATELIER REGISTRY:</span>
                <span className="text-emerald-400">VERIFIED & SEALED</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="px-8 py-3.5 rounded-full bg-[#C8A45A] hover:bg-[#d6b46b] text-[#080808] font-bold text-xs font-mono tracking-widest uppercase cursor-pointer"
            >
              {language === 'fa' ? 'بستن و بازگشت به تجربه' : 'RETURN TO EXPERIENCE'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
