export type Plan = {
  id: string;
  name: string;
  nameEn: string;
  duration: string;
  durationEn: string;
  price: number;
  original: number;
  perMonth: string;
  save: number;
  featured?: boolean;
  inStock: boolean;
  features: string[];
  featuresEn: string[];
};

export const allApps = [
  "Lightroom",
  "After Effects",
  "Premiere Pro",
  "Illustrator",
  "Photoshop",
  "Dreamweaver",
  "Animate",
  "Audition",
  "Acrobat Pro",
  "XD",
  "InDesign",
];
