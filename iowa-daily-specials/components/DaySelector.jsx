'use client';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// Get today's day name in Iowa (Central Time)
function getTodayName() {
  const ct = new Date().toLocaleDateString('en-US', {
    timeZone: 'America/Chicago',
    weekday: 'long',
  });
  return ct;
}

export default function DaySelector({ selected, onChange }) {
  const today = getTodayName();

  return (
    <div className="flex gap-1.5 flex-wrap">
      {DAYS.map((day, i) => {
        const active  = selected === day;
        const isToday = day === today;
        return (
          <button
            key={day}
            onClick={() => onChange(day)}
            className={`
              relative flex flex-col items-center px-3 py-2 rounded-lg border-2
              transition-all duration-200 cursor-pointer select-none min-w-[52px]
              ${active
                ? 'bg-[var(--soil)] border-[var(--soil)] text-[var(--corn)] shadow-md'
                : 'bg-[var(--card-bg)] border-[var(--border)] text-[var(--soil)] hover:border-[var(--soil-light)] hover:bg-[var(--cream-dark)]'
              }
            `}
          >
            {isToday && (
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] font-bold uppercase tracking-widest text-[var(--grass)] bg-white px-1 rounded-sm border border-[var(--grass)] leading-tight">
                Today
              </span>
            )}
            <span className={`text-xs font-bold font-display tracking-wider ${active ? 'text-[var(--corn)]' : 'text-[var(--soil-light)]'}`}>
              {SHORT[i]}
            </span>
            <span className={`hidden sm:block text-xs mt-0.5 ${active ? 'text-[var(--corn-light)]' : 'text-[var(--soil)]'} opacity-70`}>
              {day.slice(0, 3)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
