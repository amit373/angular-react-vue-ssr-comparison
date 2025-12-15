import type { HTMLAttributes, PropsWithChildren } from 'react';
import { cardClass, type CardVariant, type ClassValue } from '../recipes';

export type AppCardProps = PropsWithChildren<
  HTMLAttributes<HTMLDivElement> & {
    variant?: CardVariant;
    className?: ClassValue;
  }
>;

export const AppCard = ({ variant, className, children, ...props }: AppCardProps) => {
  return (
    <div {...props} className={cardClass({ variant, className })}>
      {children}
    </div>
  );
};
