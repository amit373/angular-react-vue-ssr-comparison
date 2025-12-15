import { cn, type ClassValue } from './cn';

export const metricCardClass = (className?: ClassValue): string => {
  return cn('rounded-xl neumorphic p-4 transition-all duration-300 hover:shadow-premium-hover', className);
};

export const metricLabelClass = (className?: ClassValue): string => {
  return cn('text-sm text-muted-foreground font-medium', className);
};

export const metricValueClass = (className?: ClassValue): string => {
  return cn('mt-1 text-2xl font-bold gradient-text', className);
};
