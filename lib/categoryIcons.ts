// Correspondance "icon" (texte stocké en base) → composant lucide.
// La table `categories` ne peut pas stocker un composant React : on mappe ici.
import {
  Droplet, Lock, Stethoscope, Building2, UtensilsCrossed, Lightbulb,
  Wrench, Key, Home, Scissors, Hammer, Car, Scale, Paintbrush,
  Briefcase, type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  // valeurs du seed
  wrench: Wrench,
  key: Key,
  zap: Lightbulb,
  home: Home,
  utensils: UtensilsCrossed,
  scissors: Scissors,
  // alias par slug de métier (repli pratique)
  plombier: Droplet,
  serrurier: Lock,
  electricien: Lightbulb,
  dentiste: Stethoscope,
  immobilier: Building2,
  restaurant: UtensilsCrossed,
  macon: Hammer,
  coiffeur: Scissors,
  // alias divers
  droplet: Droplet,
  lock: Lock,
  hammer: Hammer,
  car: Car,
  scale: Scale,
  paintbrush: Paintbrush,
};

/** Renvoie le composant lucide associé à la valeur `icon` (slug ou nom d'icône), avec repli. */
export function categoryIcon(name?: string | null): LucideIcon {
  if (!name) return Briefcase;
  return ICONS[name.toLowerCase()] ?? Briefcase;
}
