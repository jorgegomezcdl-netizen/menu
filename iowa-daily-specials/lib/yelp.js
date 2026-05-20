const YELP_BASE_URL = 'https://api.yelp.com/v3';

/**
 * Fetches bars and restaurants from Yelp for a given Iowa city.
 * Results are cached by Next.js for 1 hour.
 * @param {string} city
 * @returns {Promise<Array>}
 */
export async function getRestaurants(city) {
  const key = process.env.YELP_API_KEY;
  if (!key) throw new Error('YELP_API_KEY is not set');

  const params = new URLSearchParams({
    location: `${city}, Iowa`,
    categories: 'bars,restaurants,newamerican,tradamerican',
    limit: '20',
    sort_by: 'best_match',
  });

  const res = await fetch(`${YELP_BASE_URL}/businesses/search?${params}`, {
    headers: { Authorization: `Bearer ${key}` },
    next: { revalidate: 3600 }, // Cache Yelp data for 1 hour
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Yelp API error ${res.status}: ${body}`);
  }

  const data = await res.json();

  return (data.businesses || []).map((b) => ({
    id: b.id,
    name: b.name,
    address: b.location?.display_address?.join(', ') ?? '',
    phone: b.display_phone ?? '',
    url: b.url ?? '',
    rating: b.rating ?? null,
    reviewCount: b.review_count ?? 0,
    categories: (b.categories ?? []).map((c) => c.title).join(', '),
    imageUrl: b.image_url ?? null,
    isClosed: b.is_closed ?? false,
    coordinates: b.coordinates ?? null,
  }));
}
