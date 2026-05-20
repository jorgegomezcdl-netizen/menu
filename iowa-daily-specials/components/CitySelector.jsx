'use client';

const CITIES = [
  { name: 'Des Moines',   emoji: '🏙️' },
  { name: 'Cedar Rapids', emoji: '🌲' },
  { name: 'Iowa City',    emoji: '🎓' },
  { name: 'Waterloo',     emoji: '🌊' },
  { name: 'Cedar Falls',  emoji: '🍂' },
  { name: 'Ames',         emoji: '🌽' },
  { name: 'Dubuque',      emoji: '⛰️' },
];

export default function CitySelector({ selected, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {CITIES.map((city) => {
        const active = selected === city.name;
        return (
          <button
            key={city.name}
            onClick={() => onChange(city.name)}
            className={`
              flex items-center gap-1.5 px-4 py-2 rounded-full border-2 text-sm font-semibold
              transition-all duration-200 cursor-pointer select-none
              font-display tracking-wide
              ${active
                ? 'bg-[var(--corn)] border-[var(--corn-dark)] text-[var(--ink)] shadow-md scale-105'
                : 'bg-[var(--card-bg)] border-[var(--border)] text-[var(--soil)] hover:border-[var(--corn)] hover:bg-[var(--corn-light)]'
              }
            `}
          >
            <span role="img" aria-hidden="true">{city.emoji}</span>
            {city.name}
          </button>
        );
      })}
    </div>
  );
}
