export type Language = 'fa' | 'en';

export type JewelryCategory = 'EVERYDAY' | 'SIGNATURE' | 'WEDDING' | 'BESPOKE' | 'INVESTMENT';

export interface JewelryProduct {
  id: string;
  name: string;
  nameFa: string;
  category: JewelryCategory;
  categoryFa: string;
  subtitle: string;
  subtitleFa: string;
  description: string;
  descriptionFa: string;
  baseWeight: number; // in grams
  karat: 18 | 24;
  gemstone: {
    type: string;
    typeFa: string;
    carat: number;
    cut: string;
    clarity: string;
    color: string;
  };
  craftsmanship: string;
  craftsmanshipFa: string;
  hallmark: string;
  makingFeePerGram: number; // in USD
  gemstoneValue: number; // in USD
  image: string;
  gallery: string[];
  dimensions: {
    bandWidth: string;
    thickness: string;
  };
  limitedEdition?: number;
}

export interface PricingModel {
  goldPricePerGram24K: number; // benchmark
  goldPricePerGram18K: number; // 75% of 24k + premium
  calculatePrice: (weight: number, karat: 18 | 24, makingFee: number, gemValue: number) => {
    goldCost: number;
    makingCost: number;
    stoneCost: number;
    subtotal: number;
    tax: number;
    total: number;
  };
}

export interface NarrativeSection {
  id: string;
  title: string;
  titleFa: string;
  romanNumeral: string;
  progressStart: number;
  progressEnd: number;
  tagline: string;
  taglineFa: string;
  description: string;
  descriptionFa: string;
  quote?: string;
  quoteFa?: string;
}

export interface ArtisanObject {
  id: string;
  title: string;
  titleFa: string;
  badge: string;
  badgeFa: string;
  details: { label: string; value: string }[];
  detailsFa: { label: string; value: string }[];
  coordinates: { x: number; y: number };
}
