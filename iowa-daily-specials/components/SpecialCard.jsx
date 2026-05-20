'use client';

export default function SpecialCard({ special, index }) {
  const { name, happyHour, foodSpecials = [], drinkSpecials = [], notes, source, yelp } = special;

  const stagger = `stagger-${Math.min(index + 1, 6)}`;

  return (
    <article
      className={`card-enter ${stagger} bg-[var(--card-bg)] rounded-2xl border border-[var(--border)] overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col`}
    >
      {/* ── Restaurant image or fallback ───────────────────────────────────── */}
      {yelp?.imageUrl ? (
        <div className="h-36 overflow-hidden bg-[var(--cream-dark)] relative">
          <img
            src={yelp.imageUrl}
            alt={name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)]/40 to-transparent" />
          {yelp.rating && (
            <div className="absolute bottom-2 right-3 flex items-center gap-1 bg-white/90 rounded-full px-2 py-0.5">
              <span className="text-[var(--corn-dark)] text-xs">★</span>
              <span className="text-xs font-bold text-[var(--ink)]">{yelp.rating}</span>
              <span className="text-[9px] text-gray-400">({yelp.reviewCount})</span>
            </div>
          )}
        </div>
      ) : (
        <div className="h-24 bg-gradient-to-br from-[var(--corn-light)] to-[var(--cream-dark)] flex items-center justify-center">
          <span className="text-4xl opacity-30">🍽️</span>
        </div>
      )}

      {/* ── Card body ──────────────────────────────────────────────────────── */}
      <div className="p-4 flex flex-col gap-3 flex-1">

        {/* Header */}
        <div>
          <h2 className="font-display text-lg font-bold text-[var(--ink)] leading-tight">
            {yelp?.url ? (
              <a href={yelp.url} target="_blank" rel="noopener noreferrer"
                 className="hover:text-[var(--soil)] transition-colors">
                {name}
              </a>
            ) : name}
          </h2>
          {yelp?.address && (
            <p className="text-xs text-[var(--soil-light)] mt-0.5 flex items-center gap-1">
              <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
              </svg>
              {yelp.address}
            </p>
          )}
          {yelp?.categories && (
            <p className="text-[10px] text-[var(--soil-light)] mt-0.5 italic">{yelp.categories}</p>
          )}
        </div>

        <div className="flex flex-col gap-2 flex-1">

          {/* Happy Hour */}
          {happyHour?.available && (
            <div className="bg-[var(--corn-light)] border border-[var(--corn)] rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="tag-happy-hour">Happy Hour</span>
                {happyHour.times && (
                  <span className="text-xs text-[var(--soil)] font-semibold">{happyHour.times}</span>
                )}
              </div>
              {happyHour.deals && (
                <p className="text-sm text-[var(--ink)] leading-snug">{happyHour.deals}</p>
              )}
            </div>
          )}

          {/* Food Specials */}
          {foodSpecials.length > 0 && (
            <div className="bg-white border border-[var(--border)] rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <span className="tag-food">Food</span>
              </div>
              <ul className="flex flex-col gap-2">
                {foodSpecials.map((s, i) => (
                  <li key={i} className="flex justify-between items-start gap-2">
                    <div>
                      <p className="text-sm font-semibold text-[var(--ink)]">{s.name}</p>
                      {s.description && (
                        <p className="text-xs text-[var(--soil-light)] leading-snug">{s.description}</p>
                      )}
                      {s.times && s.times !== 'All day' && (
                        <p className="text-[10px] text-[var(--sky)] mt-0.5">⏱ {s.times}</p>
                      )}
                    </div>
                    {s.price && (
                      <span className="text-sm font-bold text-[var(--grass)] whitespace-nowrap">{s.price}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Drink Specials */}
          {drinkSpecials.length > 0 && (
            <div className="bg-white border border-[var(--border)] rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <span className="tag-drink">Drinks</span>
              </div>
              <ul className="flex flex-col gap-2">
                {drinkSpecials.map((s, i) => (
                  <li key={i} className="flex justify-between items-start gap-2">
                    <div>
                      <p className="text-sm font-semibold text-[var(--ink)]">{s.name}</p>
                      {s.description && (
                        <p className="text-xs text-[var(--soil-light)] leading-snug">{s.description}</p>
                      )}
                      {s.times && s.times !== 'All day' && (
                        <p className="text-[10px] text-[var(--sky)] mt-0.5">⏱ {s.times}</p>
                      )}
                    </div>
                    {s.price && (
                      <span className="text-sm font-bold text-[var(--grass)] whitespace-nowrap">{s.price}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        {(notes || source) && (
          <div className="border-t border-[var(--border)] pt-2 mt-auto">
            {notes && <p className="text-[11px] text-[var(--soil-light)] italic">{notes}</p>}
            {source && (
              <p className="text-[10px] text-gray-400 mt-0.5 truncate">
                📌 <a href={source} target="_blank" rel="noopener noreferrer"
                       className="hover:text-[var(--sky)] underline decoration-dotted">{source}</a>
              </p>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
