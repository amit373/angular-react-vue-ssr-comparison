import { cn, type ClassValue } from './cn';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export const buttonClass = (options?: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: ClassValue;
}): string => {
  const variant = options?.variant ?? 'primary';
  const size = options?.size ?? 'md';

  const base =
    'inline-flex items-center justify-center rounded-xl font-medium transition-all select-none outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50';

  const sizes: Record<ButtonSize, string> = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4 text-sm',
    lg: 'h-11 px-5 text-base',
  };

  const variants: Record<ButtonVariant, string> = {
    primary:
      'bg-primary text-primary-foreground shadow-premium hover:shadow-premium-hover hover:-translate-y-0.5 active:translate-y-0',
    secondary:
      'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    ghost: 'bg-transparent hover:bg-muted',
    danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  };

  return cn(base, sizes[size], variants[variant], options?.className);
};
