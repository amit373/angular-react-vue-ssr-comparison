import { skeletonClass } from '@ssr-comparison/ui';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  variant?: 'rect' | 'circle' | 'text';
  shimmer?: boolean;
}

export function Skeleton({ 
  className = '', 
  width, 
  height, 
  variant = 'rect', 
  shimmer = true 
}: SkeletonProps) {
  const baseClasses = skeletonClass();
  const variantClasses = variant === 'circle' ? 'rounded-full' : variant === 'text' ? 'rounded' : 'rounded-lg';
  const classes = `${baseClasses} ${variantClasses} ${className}`;
  
  const styles: React.CSSProperties = {};
  if (width) styles.width = typeof width === 'number' ? `${width}px` : width;
  if (height) styles.height = typeof height === 'number' ? `${height}px` : height;
  
  return (
    <div
      className={classes}
      style={styles}
      aria-hidden="true"
    />
  );
}

export function PostSkeleton() {
  return (
    <div className="space-y-4 p-4 rounded-xl neumorphic">
      <Skeleton className="h-8 w-3/4" variant="text" />
      <Skeleton className="h-4 w-full" variant="text" />
      <Skeleton className="h-4 w-5/6" variant="text" />
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-2xl glass p-6 shadow-premium">
      <Skeleton className="h-6 w-1/2 mb-4" variant="text" />
      <Skeleton className="h-4 w-full mb-2" variant="text" />
      <Skeleton className="h-4 w-4/5" variant="text" />
    </div>
  );
}

export function AvatarSkeleton() {
  return (
    <Skeleton 
      className="rounded-full" 
      width={40} 
      height={40} 
      variant="circle" 
    />
  );
}

export function ImageSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden">
      <Skeleton 
        className="w-full" 
        height={200} 
        variant="rect" 
      />
    </div>
  );
}

export function ListSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-3 rounded-xl neumorphic">
          <AvatarSkeleton />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" variant="text" />
            <Skeleton className="h-3 w-1/2" variant="text" />
          </div>
        </div>
      ))}
    </div>
  );
}

