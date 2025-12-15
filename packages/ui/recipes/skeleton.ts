import { cn, type ClassValue } from './cn';

export const skeletonClass = (className?: ClassValue): string => {
  return cn('animate-pulse rounded-md bg-muted', className);
};
