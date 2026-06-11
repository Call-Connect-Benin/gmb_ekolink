// Correspondance "icon" (texte stocké en base) → composant lucide.
// La table `categories` ne peut pas stocker un composant React : on mappe ici.
import {
  Droplet, Lock, Key, Lightbulb, Wrench, Home, Scissors, Hammer, Car, Scale, Paintbrush,
  Stethoscope, Building2, UtensilsCrossed, Briefcase,
  Grid3x3, Flame, Sprout, Trees, PawPrint, Pill, HeartPulse, Glasses, Stamp, Calculator, Ruler,
  Croissant, CakeSlice, Beef, Flower2, ShoppingBasket, Coffee, Wine, BedDouble, Truck, Sparkles,
  Shirt, Footprints, Dumbbell, Activity, Brush, Camera, Printer, Laptop, Smartphone, Umbrella,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  // noms d'icônes
  wrench: Wrench, key: Key, zap: Lightbulb, lightbulb: Lightbulb, home: Home,
  utensils: UtensilsCrossed, scissors: Scissors, droplet: Droplet, lock: Lock,
  hammer: Hammer, car: Car, scale: Scale, paintbrush: Paintbrush, brush: Brush,
  grid: Grid3x3, flame: Flame, sprout: Sprout, trees: Trees, stethoscope: Stethoscope,
  paw: PawPrint, pill: Pill, "heart-pulse": HeartPulse, glasses: Glasses, stamp: Stamp,
  calculator: Calculator, ruler: Ruler, building: Building2, croissant: Croissant,
  cake: CakeSlice, beef: Beef, flower: Flower2, basket: ShoppingBasket, coffee: Coffee,
  wine: Wine, bed: BedDouble, truck: Truck, sparkles: Sparkles, shirt: Shirt,
  footprints: Footprints, dumbbell: Dumbbell, activity: Activity, camera: Camera,
  printer: Printer, laptop: Laptop, smartphone: Smartphone, umbrella: Umbrella,
  // alias par slug de métier (repli pratique)
  plombier: Droplet, serrurier: Lock, electricien: Lightbulb, macon: Hammer,
  coiffeur: Scissors, dentiste: Stethoscope, medecin: Stethoscope, veterinaire: PawPrint,
  pharmacie: Pill, immobilier: Building2, restaurant: UtensilsCrossed,
};

/** Renvoie le composant lucide associé à la valeur `icon` (slug ou nom d'icône), avec repli. */
export function categoryIcon(name?: string | null): LucideIcon {
  if (!name) return Briefcase;
  return ICONS[name.toLowerCase()] ?? Briefcase;
}
