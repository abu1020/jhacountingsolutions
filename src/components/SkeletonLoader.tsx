import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div
      className={`bg-slate-200/80 dark:bg-slate-800/80 animate-pulse rounded-xl ${className}`}
      style={{ willChange: 'opacity' }}
    />
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-soft space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="w-12 h-12 rounded-xl" />
        <Skeleton className="w-20 h-5 rounded-md" />
      </div>
      <div className="space-y-2 pt-2">
        <Skeleton className="w-3/4 h-5 rounded-md" />
        <Skeleton className="w-full h-4 rounded-md" />
        <Skeleton className="w-5/6 h-4 rounded-md" />
      </div>
      <div className="pt-4 flex justify-between items-center border-t border-slate-100">
        <Skeleton className="w-24 h-4 rounded-md" />
        <Skeleton className="w-16 h-4 rounded-md" />
      </div>
    </div>
  );
};

export const TableRowSkeleton: React.FC = () => {
  return (
    <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 flex-1">
        <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
        <div className="space-y-1.5 flex-1 max-w-xs">
          <Skeleton className="w-full h-4 rounded" />
          <Skeleton className="w-2/3 h-3 rounded" />
        </div>
      </div>
      <Skeleton className="w-24 h-6 rounded-md shrink-0" />
      <Skeleton className="w-20 h-8 rounded-lg shrink-0" />
    </div>
  );
};
