'use client';

import { useState, useEffect, useCallback } from 'react';
import CitySelector from '@/components/CitySelector';
import DaySelector from '@/components/DaySelector';
import SpecialCard from '@/components/SpecialCard';
import LoadingState from '@/components/LoadingState';
import EmptyState from '@/components/EmptyState';

const LOADING_MESSAGES = [
  'Scouting bars and restaurants on Yelp…',
  'Searching menus and social pages…',
  'AI is hunting down happy hours…',
  'Almost there — cross-referencing deals…',
];

function getTodayName() {
  return new Date().toLocaleDateString('en-US', {
    timeZone: 'America/Chicago',
    weekday: 'long',
  });
}

export default function HomePage() {
  const [city, setCity]       = useState('Des Moines');
  const [day, setDay]         = useState(getTodayName());
  const [specials, setSpecials] = useState([]);
  const [status, setStatus]   = useState('idle'); // idle | loading | success | error
  const [error, setError]     = useState(null);
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MESSAGES[0]);
  const [generatedAt, setGeneratedAt] = useState(null);
  const [restCount, setRestCount] = useState(0);

  // Rotate loading messages every 5s
  useEffect(() => {
    if (status !== 'loading') return;
    let i = 0;
    const id = setInterval(() => {
      i = (i + 1) % LOADING_MESSAGES.length;
      setLoadingMsg(LOADING_MESSAGES[i]);
    }, 5000);
    return () => clearInterval(id);
  }, [status]);

  const fetchSpecials = useCallback(async () => {
    setStatus('loading');
    setError(null);
    setLoadingMsg(LOADING_MESSAGES[0]);

    try {
      const params = new URLSearchParams({ city, day });
      const res = await fetch(`/api/specials?${params}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Unknown error');

      setSpecials(data.specials ?? []);
      setRestCount(data.restaurantCount ?? 0);
      setGeneratedAt(data.generatedAt ?? null);
      setStatus('success');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  }, [city, day]);

  // Auto-fetch on mount
  useEffect(() => {
    fetchSpecials();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen flex flex-col">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header className="relative overflow-hidden border-b-2 border-[var(--corn)]"
              style={{ background: 'linear-gradient(135deg, var(--ink) 0%, var(--soil) 100%)' }}>
        {/* Decorative wheat stalks / corn pattern */}
        <div className="absolute inset-0 opacity-[0.04]"
             style={{ backgroundImage: 'repeating-linear-gradient(45deg, #FFD000 0px, #FFD000 1px, transparent 1px, transparent 12px)' }} />

        <div className="relative max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-3xl">🌽</span>
                <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight"
                    style={{ color: 'var(--corn)' }}>
                  Iowa Daily Specials
                </h1>
              </div>
              <p className="text-sm sm:text-base text-[var(--corn-light)] opacity-80 font-body ml-12">
                Happy hour deals &amp; food specials across the Hawkeye State
              </p>
            </div>
            <div className="hidden sm:flex flex-col items-end text-right text-[var(--corn-light)] opacity-50">
              <span className="text-2xl">🍺</span>
              <span className="text-xs mt-1 font-display tracking-wider">AI-Powered</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Controls ────────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-[var(--border)] sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-4">

          {/* City */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--soil-light)] mb-2">City</p>
            <CitySelector selected={city} onChange={(c) => { setCity(c); setStatus('idle'); }} />
          </div>

          {/* Day + Search button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--soil-light)] mb-2">Day</p>
              <DaySelector selected={day} onChange={(d) => { setDay(d); setStatus('idle'); }} />
            </div>
            <button
              onClick={fetchSpecials}
              disabled={status === 'loading'}
              className={`
                self-end sm:self-auto flex items-center gap-2 px-6 py-3 rounded-full font-display font-bold
                text-sm tracking-wide transition-all duration-200 border-2 shadow-md
                ${status === 'loading'
                  ? 'bg-[var(--cream-dark)] border-[var(--border)] text-[var(--soil-light)] cursor-not-allowed'
                  : 'bg-[var(--corn)] border-[var(--corn-dark)] text-[var(--ink)] hover:bg-[var(--corn-dark)] hover:scale-105 active:scale-95'
                }
              `}
            >
              {status === 'loading' ? (
                <>
                  <span className="w-4 h-4 border-2 border-[var(--soil-light)] border-t-transparent rounded-full animate-spin" />
                  Searching…
                </>
              ) : (
                <>🔍 Find Specials</>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Results area ────────────────────────────────────────────────────── */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">

        {/* Meta bar */}
        {status === 'success' && (
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-[var(--border)]">
            <div>
              <h2 className="font-display text-xl font-bold text-[var(--ink)]">
                {day} in {city}
              </h2>
              <p className="text-xs text-[var(--soil-light)] mt-0.5">
                Checked {restCount} venues · {specials.length} with findable specials
              </p>
            </div>
            {generatedAt && (
              <p className="text-[10px] text-gray-400 hidden sm:block">
                Refreshed {new Date(generatedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </p>
            )}
          </div>
        )}

        {/* States */}
        {status === 'idle' && (
          <div className="flex flex-col items-center py-20 text-center">
            <span className="text-5xl mb-4">🍻</span>
            <p className="font-display text-xl text-[var(--soil)] font-bold mb-1">Ready to find deals</p>
            <p className="text-sm text-[var(--soil-light)]">Select a city &amp; day, then hit Find Specials</p>
          </div>
        )}

        {status === 'loading' && <LoadingState message={loadingMsg} />}

        {status === 'error' && (
          <div className="flex flex-col items-center py-20 text-center">
            <span className="text-5xl mb-4">⚠️</span>
            <p className="font-display text-xl text-red-700 font-bold mb-2">Something went wrong</p>
            <p className="text-sm text-[var(--soil-light)] max-w-sm">{error}</p>
            <button onClick={fetchSpecials}
                    className="mt-5 px-5 py-2 bg-[var(--corn)] rounded-full font-display font-bold text-sm hover:bg-[var(--corn-dark)] transition-colors">
              Retry
            </button>
          </div>
        )}

        {status === 'success' && specials.length === 0 && (
          <EmptyState city={city} day={day} />
        )}

        {status === 'success' && specials.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {specials.map((s, i) => (
              <SpecialCard key={s.name + i} special={s} index={i} />
            ))}
          </div>
        )}
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="border-t border-[var(--border)] bg-white">
        <div className="max-w-6xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-[var(--soil-light)]">
            🌽 Iowa Daily Specials — Powered by Yelp &amp; Claude AI
          </p>
          <p className="text-[10px] text-gray-400 text-center">
            Deals verified by AI web search. Always confirm with the venue before visiting.
          </p>
        </div>
      </footer>
    </div>
  );
}
