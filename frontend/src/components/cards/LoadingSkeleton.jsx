/**
 * Generic shimmer skeleton placeholder.
 * Usage: <LoadingSkeleton className="h-8 w-32 rounded" />
 */
const LoadingSkeleton = ({ className = '' }) => (
  <div className={`skeleton rounded ${className}`} />
)

export const SkeletonCard = () => (
  <div className="glass-card p-5 flex flex-col gap-3">
    <div className="skeleton h-8 w-8 rounded-lg" />
    <div className="skeleton h-3 w-20 rounded" />
    <div className="skeleton h-7 w-32 rounded" />
    <div className="skeleton h-3 w-24 rounded" />
  </div>
)

export const SkeletonRow = () => (
  <div className="flex items-center gap-4 py-3 px-5 border-b border-white/5">
    <div className="skeleton h-3 w-16 rounded" />
    <div className="skeleton h-3 w-24 rounded ml-auto" />
    <div className="skeleton h-3 w-16 rounded" />
    <div className="skeleton h-4 w-12 rounded-full" />
    <div className="skeleton h-3 w-16 rounded" />
  </div>
)

export default LoadingSkeleton
