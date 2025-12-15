import type { HTMLAttributes } from 'react';
import {
  metricCardClass,
  metricLabelClass,
  metricValueClass,
  type ClassValue,
} from '../recipes';

export type AppMetricCardProps = {
  label: string;
  value: string;
  className?: ClassValue;
} & Omit<HTMLAttributes<HTMLDivElement>, 'children'>;

export const AppMetricCard = ({ label, value, className, ...props }: AppMetricCardProps) => {
  return (
    <div {...props} className={metricCardClass(className)}>
      <div className={metricLabelClass()}>{label}</div>
      <div className={metricValueClass()}>{value}</div>
    </div>
  );
};
