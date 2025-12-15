import type { HTMLAttributes } from 'react';
import { skeletonClass, type ClassValue } from '../recipes';

export type AppSkeletonProps = {
  className?: ClassValue;
} & HTMLAttributes<HTMLDivElement>;

export const AppSkeleton = ({ className, ...props }: AppSkeletonProps) => {
  return <div {...props} className={skeletonClass(className)} />;
};
