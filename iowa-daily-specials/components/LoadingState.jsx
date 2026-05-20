'use client';

function SkeletonCard() {
  return (
    <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border)] overflow-hidden shadow-sm">
      <div className="h-36 shimmer" />
      <div className="p-4 flex flex-col gap-3">
        <div>
          <div className="h-5 w-3/4 shimmer rounded-md mb-2" />
          <div className="h-3 w-1/2 shimmer rounded-md" />
        </div>
        <div className="h-20 shimmer rounded-xl" />
        <div className="h-16 shimmer rounded-xl" />
      </div>
    </div>
  );
}

export default function LoadingState({ message }) {
  return (
    <div>
      {/* Animated progress message */}
      <div className="flex items-center justify-center gap-3 py-6 mb-4">
        <div className="w-5 h-5 border-2 border-[var(--corn)] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-[var(--soil)] font-display tracking-wide">
          {message || 'Searching for specials…'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
