import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import { buttonClass, type ButtonSize, type ButtonVariant, type ClassValue } from '../recipes';

export type AppButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
    className?: ClassValue;
  }
>;

export const AppButton = ({ variant, size, className, children, ...props }: AppButtonProps) => {
  return (
    <button {...props} className={buttonClass({ variant, size, className })}>
      {children}
    </button>
  );
};
