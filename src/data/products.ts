import { JewelryProduct, PricingModel } from '../types';

// Dynamic Pricing Benchmark Engine (Market-ready Architecture)
export const liveMarketPricing: PricingModel = {
  goldPricePerGram24K: 84.50, // Real-world benchmark USD
  goldPricePerGram18K: 63.38, // 750‰ pure gold
  calculatePrice: (weight: number, karat: 18 | 24, makingFee: number, gemValue: number) => {
    const rawGoldRate = karat === 24 ? 84.50 : 63.38;
    const goldCost = Math.round(weight * rawGoldRate);
    const makingCost = Math.round(weight * makingFee);
    const stoneCost = gemValue;
    const subtotal = goldCost + makingCost + stoneCost;
    const tax = Math.round(subtotal * 0.05); // 5% luxury vat / assay fee
    const total = subtotal + tax;

    return {
      goldCost,
      makingCost,
      stoneCost,
      subtotal,
      tax,
      total,
    };
  },
};

export const curatedProducts: JewelryProduct[] = [
  {
    id: 'zarvand-solitaire-or',
    name: 'The Solitaire Éternel',
    nameFa: 'تک‌نگین ابدی زروند',
    category: 'SIGNATURE',
    categoryFa: 'امضای زروند',
    subtitle: '18K Yellow Gold with F-VS1 Brilliant Cut Diamond',
    subtitleFa: 'طلای زرد ۱۸ عیار با الماس برلیان تراش نادر',
    description: 'Forged through the primal heat of the crucible, sculpted into pure architectural harmony. Features an elevated 6-prong platinum-crowned setting with hand-chamfered inner comfort band.',
    descriptionFa: 'برخاسته از حرارت آتشین کوره، پیراسته در هارمونی هندسی ناب. دارای پایه ۶ چنگکی پلاتین با رینگ تراش‌خورده ارگونومیک دستی.',
    baseWeight: 3.4,
    karat: 18,
    gemstone: {
      type: 'Solitaire Diamond',
      typeFa: 'الماس برلیان منفرد',
      carat: 0.85,
      cut: 'Ideal Brilliant',
      clarity: 'VVS1',
      color: 'D (Colorless)',
    },
    craftsmanship: 'Hand-finished in Tehran Atelier by Master Goldsmith',
    craftsmanshipFa: 'پرداخت دست‌ساز در آتلیه تهران توسط استاد زرگر',
    hallmark: 'ZARVAND • Au 750 • № 042',
    makingFeePerGram: 38,
    gemstoneValue: 3200,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=1200&q=85',
    ],
    dimensions: {
      bandWidth: '2.4 mm',
      thickness: '1.8 mm',
    },
    limitedEdition: 50,
  },
  {
    id: 'zarvand-aurum-band',
    name: 'Archetype Satin Band',
    nameFa: 'حلقه آرکتایپ ساتن',
    category: 'EVERYDAY',
    categoryFa: 'پوشش روزانه',
    subtitle: 'Brushed 18K Warm Champagne Gold',
    subtitleFa: 'طلای شامپاینی ۱۸ عیار با فینیش ابریشمی',
    description: 'An understated monolithic band celebrating raw material purity. Micro-brushed with natural diamond paste for a soft matte luster that reflects subtle architectural light.',
    descriptionFa: 'حلقه‌ای ساده و تندیس‌وار که خلوص گوهرین طلا را پاس می‌دارد. پولیش شده با خمیر الماس برای درخششی مات و عمیق.',
    baseWeight: 4.8,
    karat: 18,
    gemstone: {
      type: 'Flush-set Secret Diamond',
      typeFa: 'الماس پنهان در جداره داخلی',
      carat: 0.04,
      cut: 'Round Brilliant',
      clarity: 'VVS2',
      color: 'E',
    },
    craftsmanship: 'Micro-lathe turned & hand satin finished',
    craftsmanshipFa: 'تراش میکرومتری با فینیش ساتن دستی',
    hallmark: 'ZARVAND • 18K • PURE',
    makingFeePerGram: 26,
    gemstoneValue: 350,
    image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85',
    ],
    dimensions: {
      bandWidth: '4.0 mm',
      thickness: '2.0 mm',
    },
  },
  {
    id: 'zarvand-celestial-union',
    name: 'Celestial Union Pavé',
    nameFa: 'حلقه پیمان سلستیکال',
    category: 'WEDDING',
    categoryFa: 'حلقه ازدواج',
    subtitle: 'Dual Harmony 18K Gold with Micro-Pavé Eternity',
    subtitleFa: 'هارمونی دوگانه طلای ۱۸ عیار با ردیف الماس‌های میکروپاوِه',
    description: 'Twenty-four micro-facetted brilliant gems pave the eternity channel, held seamlessly between mirror-polished gold ribs without visible metal claws.',
    descriptionFa: 'بیست و چهار برلیان در شیار ابدی، جای‌گرفته میان دو لبه طلای صیقلی بدون چنگک‌های مزاحم، نماد پیوند جاودان.',
    baseWeight: 5.2,
    karat: 18,
    gemstone: {
      type: 'Micro-Pavé Natural Diamonds',
      typeFa: 'الماس‌های میکروپاوِه طبیعی',
      carat: 0.62,
      cut: 'Hearts & Arrows',
      clarity: 'VS1',
      color: 'F',
    },
    craftsmanship: 'Microscope claw-less channel mounting',
    craftsmanshipFa: 'مخراج‌کاری زیر میکروسکوپ بدون چنگک بیرونی',
    hallmark: 'ZARVAND • UNION • 750',
    makingFeePerGram: 45,
    gemstoneValue: 1450,
    image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85',
    ],
    dimensions: {
      bandWidth: '3.2 mm',
      thickness: '1.9 mm',
    },
  },
  {
    id: 'zarvand-monolith-24k',
    name: 'The Monolith Ingot Ring',
    nameFa: 'انگشتر شمش مونولیت ۲۴ عیار',
    category: 'INVESTMENT',
    categoryFa: 'سرمایه‌گذاری ناب',
    subtitle: 'Pure 999.9 Fine Investment Gold',
    subtitleFa: 'طلای ناب ۹۹۹.۹ عیار خالص سرمایه‌ای',
    description: 'Cast directly from refined 24-karat raw matter into a substantial sculptural signet. Each piece carries an individually registered international assay certificate stamped on its face.',
    descriptionFa: 'ریخته‌گری مستقیم از طلای ناب ۲۴ عیار تصفیه شده در هیبت مهری تندیس‌وار. دارای کد اختصاصی عیارسنجی معتبر بین‌المللی حک شده.',
    baseWeight: 12.5,
    karat: 24,
    gemstone: {
      type: 'Raw Uncut Diamond Inclusion',
      typeFa: 'کانی الماس دست‌نخورده طبیعی',
      carat: 0.35,
      cut: 'Natural Octahedron',
      clarity: 'Natural Mineral',
      color: 'Fancy Amber',
    },
    craftsmanship: 'Traditional crucible sand-cast & cold burnished',
    craftsmanshipFa: 'ریخته‌گری بوته‌ای کهن و صیقل سرد اصیل',
    hallmark: 'ZARVAND • 999.9 • AU-FINE • 12.50G',
    makingFeePerGram: 18,
    gemstoneValue: 900,
    image: 'https://images.unsplash.com/photo-1611591475155-4264738d4361?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1611591475155-4264738d4361?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1200&q=85',
    ],
    dimensions: {
      bandWidth: '7.5 mm',
      thickness: '2.8 mm',
    },
    limitedEdition: 18,
  },
  {
    id: 'zarvand-meteor-bespoke',
    name: 'Kavīr Bespoke Signet',
    nameFa: 'انگشتر سفارشی کویر',
    category: 'BESPOKE',
    categoryFa: 'آتلیه سفارشی',
    subtitle: 'Textured 18K Yellow Gold with Deep Forest Tourmaline',
    subtitleFa: 'طلای ۱۸ عیار با بافت صخره‌ای و سنگ تورمالین جنگلی',
    description: 'Inspired by wind-carved desert dunes. The band features bespoke organic hand-chiseled textures framing a deep emerald-cut green tourmaline stone.',
    descriptionFa: 'الهام‌گرفته از تپه‌های ماسه‌ای کویر مرکزی. شیارهای قلم‌زنی دستی ارگانیک پیرامون سنگ تورمالین سبز تراش زمردی.',
    baseWeight: 7.8,
    karat: 18,
    gemstone: {
      type: 'Natural Forest Tourmaline',
      typeFa: 'تورمالین طبیعی تراش زمردی',
      carat: 2.15,
      cut: 'Emerald Cut',
      clarity: 'Eye-Clean',
      color: 'Deep Verdant Green',
    },
    craftsmanship: 'One-of-a-kind hand chased & granulated',
    craftsmanshipFa: 'قلم‌زنی و ملیله‌کاری یگانه دست‌ساز',
    hallmark: 'ZARVAND • BESPOKE • PIECE UNIQUE',
    makingFeePerGram: 52,
    gemstoneValue: 1800,
    image: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85',
    ],
    dimensions: {
      bandWidth: '6.0 mm',
      thickness: '2.4 mm',
    },
    limitedEdition: 5,
  },
];
