const ANTHROPIC_API = 'https://api.anthropic.com/v1/messages';

/**
 * Uses Claude + web search to find food specials and happy hour deals
 * for a list of restaurants on a specific day.
 *
 * @param {Array}  restaurants  - Array of Yelp restaurant objects
 * @param {string} city         - e.g. "Des Moines"
 * @param {string} day          - e.g. "Tuesday"
 * @returns {Promise<Array>}    - Array of deal objects merged with Yelp data
 */
export async function getSpecials(restaurants, city, day) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error('ANTHROPIC_API_KEY is not set');

  const restaurantList = restaurants
    .map((r) => `- ${r.name} | ${r.address} | ${r.categories}`)
    .join('\n');

  const systemPrompt = `You are a local Iowa food & drinks expert. Your job is to find 
accurate, current food specials and happy hour deals for restaurants. 
Use web search to look up each venue's website, Facebook page, and any recent mentions of specials.
Be thorough but concise. Only report specials you can verify from search results.
ALWAYS respond with ONLY valid JSON — no markdown fences, no preamble, no explanation.`;

  const userPrompt = `Find food specials and happy hour deals for ${day} at bars and restaurants in ${city}, Iowa.

Here are the venues to research:
${restaurantList}

For each venue that HAS specials on ${day}, return a JSON object. 
Skip venues with NO findable specials.

Return a JSON ARRAY with this exact structure (no markdown, raw JSON only):
[
  {
    "name": "Exact restaurant name",
    "hasSpecials": true,
    "happyHour": {
      "available": true,
      "times": "3:00 PM – 6:00 PM",
      "deals": "Half-price appetizers, $2 off drafts, $1 off wine"
    },
    "foodSpecials": [
      {
        "name": "Special name",
        "description": "What it is and what makes it a deal",
        "price": "$X" ,
        "times": "All day / 5pm-close / etc."
      }
    ],
    "drinkSpecials": [
      {
        "name": "Special name",
        "description": "Details",
        "price": "$X",
        "times": "time range"
      }
    ],
    "notes": "Any helpful context, e.g. 'Every Tuesday' or 'First come first served'",
    "source": "URL or source where this was found"
  }
]

If no venues have findable specials, return an empty array: []`;

  const body = {
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4000,
    system: systemPrompt,
    tools: [
      {
        type: 'web_search_20250305',
        name: 'web_search',
      },
    ],
    messages: [{ role: 'user', content: userPrompt }],
  };

  const res = await fetch(ANTHROPIC_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Claude API error ${res.status}: ${errText}`);
  }

  const data = await res.json();

  // Collect all text blocks from the response (tool_use blocks are intermediate)
  const fullText = (data.content || [])
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('');

  let specials = [];
  try {
    const cleaned = fullText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim();

    specials = JSON.parse(cleaned);
    if (!Array.isArray(specials)) specials = [];
  } catch (e) {
    console.error('Failed to parse Claude specials JSON:', e, '\nRaw text:', fullText);
    return [];
  }

  // Enrich each special with the matching Yelp data
  return specials.map((special) => {
    const yelpMatch = restaurants.find((r) => {
      const rn = r.name.toLowerCase();
      const sn = special.name.toLowerCase();
      return rn.includes(sn) || sn.includes(rn) || rn === sn;
    });
    return {
      ...special,
      yelp: yelpMatch ?? null,
    };
  });
}
