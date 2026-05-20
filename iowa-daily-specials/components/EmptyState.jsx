'use client';

export default function EmptyState({ city, day }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-6xl mb-4 opacity-40">🌽</div>
      <h3 className="font-display text-xl font-bold text-[var(--soil)] mb-2">
        No specials found for {day} in {city}
      </h3>
      <p className="text-sm text-[var(--soil-light)] max-w-xs leading-relaxed">
        AI couldn't find verified specials for those venues right now. 
        Try a different city or day, or check back later.
      </p>
    </div>
  );
}
