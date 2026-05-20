import { NextResponse } from 'next/server';
import { getRestaurants } from '@/lib/yelp';
import { getSpecials } from '@/lib/claude';

// Cache each city+day response for 6 hours on the server
export const revalidate = 21600;

const VALID_CITIES = [
  'Des Moines',
  'Cedar Rapids',
  'Iowa City',
  'Waterloo',
  'Cedar Falls',
  'Ames',
  'Dubuque',
];

const VALID_DAYS = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday',
  'Friday', 'Saturday', 'Sunday',
];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city');
  const day  = searchParams.get('day');

  // ── Validate inputs ──────────────────────────────────────────────────────
  if (!city || !VALID_CITIES.includes(city)) {
    return NextResponse.json(
      { error: `Invalid city. Must be one of: ${VALID_CITIES.join(', ')}` },
      { status: 400 }
    );
  }
  if (!day || !VALID_DAYS.includes(day)) {
    return NextResponse.json(
      { error: `Invalid day. Must be one of: ${VALID_DAYS.join(', ')}` },
      { status: 400 }
    );
  }

  try {
    // 1. Pull restaurant list from Yelp (cached 1h)
    const restaurants = await getRestaurants(city);

    if (!restaurants.length) {
      return NextResponse.json({ city, day, specials: [], restaurantCount: 0 });
    }

    // 2. Ask Claude + web search to find specials (cached via revalidate)
    const specials = await getSpecials(restaurants, city, day);

    return NextResponse.json({
      city,
      day,
      specials,
      restaurantCount: restaurants.length,
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[/api/specials] Error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to fetch specials' },
      { status: 500 }
    );
  }
}
