import { cn, type ClassValue } from './cn';

export type CardVariant = 'default' | 'glass' | 'neumorphic';

export const cardClass = (options?: {
  variant?: CardVariant;
  className?: ClassValue;
}): string => {
  const variant = options?.variant ?? 'default';

  const base = 'rounded-2xl border bg-card text-card-foreground';
  const padding = 'p-6';

  const variants: Record<CardVariant, string> = {
    default: 'shadow-premium',
    glass: 'glass shadow-premium',
    neumorphic: 'neumorphic shadow-premium',
  };

  return cn(base, padding, variants[variant], options?.className);
};
