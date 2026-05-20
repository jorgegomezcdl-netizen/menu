# 🌽 Iowa Daily Specials

> Find today's best food specials and happy hour deals at bars and restaurants across Iowa — powered by **Yelp Fusion API** and **Claude AI with web search**.

---

## 🗺️ Cities Covered

Des Moines · Cedar Rapids · Iowa City · Waterloo · Cedar Falls · Ames · Dubuque

---

## ⚙️ How It Works

1. User selects a **city** and **day of the week**
2. The app calls **Yelp Fusion API** to fetch the top 20 bars & restaurants in that city
3. That restaurant list is passed to **Claude AI** (with web search enabled) — Claude searches each venue's website, Facebook, and recent mentions to find verified food specials and happy hour deals
4. Results are displayed in a clean, card-based UI with happy hour times, food deals, and drink specials
5. Results are **cached for 6 hours** server-side to reduce API usage

---

## 🚀 Quick Start

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/iowa-daily-specials.git
cd iowa-daily-specials
npm install
```

### 2. Get your API keys

#### Yelp Fusion API (Free — 500 calls/day)
1. Go to [https://www.yelp.com/developers/v3/manage_app](https://www.yelp.com/developers/v3/manage_app)
2. Create a new app
3. Copy the **API Key**

#### Anthropic API
1. Go to [https://console.anthropic.com/](https://console.anthropic.com/)
2. Create an API key under **API Keys**
3. Note: Claude API calls with web search have a cost per call — each "Find Specials" request will use roughly $0.02–$0.10 depending on how many web searches Claude performs

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```
YELP_API_KEY=your_yelp_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📦 Deploying to Vercel

### Option A: Vercel CLI

```bash
npm install -g vercel
vercel
```

### Option B: GitHub + Vercel Dashboard

1. Push this repo to GitHub
2. Go to [https://vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Add environment variables in the Vercel dashboard:
   - `YELP_API_KEY`
   - `ANTHROPIC_API_KEY`
5. Deploy — Vercel auto-detects Next.js

---

## 🗂️ Project Structure

```
iowa-daily-specials/
├── app/
│   ├── layout.js              # Root layout, fonts, metadata
│   ├── page.js                # Main page (city/day selector + results)
│   ├── globals.css            # Iowa-themed design tokens & animations
│   └── api/
│       └── specials/
│           └── route.js       # GET /api/specials?city=...&day=...
├── components/
│   ├── CitySelector.jsx       # Pill buttons for Iowa cities
│   ├── DaySelector.jsx        # Day-of-week tabs (highlights today)
│   ├── SpecialCard.jsx        # Restaurant deal card
│   ├── LoadingState.jsx       # Skeleton + animated message
│   └── EmptyState.jsx         # No results state
├── lib/
│   ├── yelp.js                # Yelp Fusion API wrapper
│   └── claude.js              # Claude API + web search wrapper
├── .env.local.example         # Required environment variables
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── vercel.json
└── package.json
```

---

## 🔌 API Reference

### `GET /api/specials`

| Parameter | Type   | Required | Description                                       |
|-----------|--------|----------|---------------------------------------------------|
| `city`    | string | ✅       | One of the 7 Iowa cities                         |
| `day`     | string | ✅       | Full day name e.g. `Tuesday`                     |

**Response:**
```json
{
  "city": "Des Moines",
  "day": "Tuesday",
  "restaurantCount": 20,
  "generatedAt": "2025-01-07T19:30:00.000Z",
  "specials": [
    {
      "name": "Exile Brewing Co",
      "hasSpecials": true,
      "happyHour": {
        "available": true,
        "times": "3:00 PM – 6:00 PM",
        "deals": "$1 off all pints, half-price appetizers"
      },
      "foodSpecials": [
        { "name": "Taco Tuesday", "description": "$2 street tacos", "price": "$2", "times": "All day" }
      ],
      "drinkSpecials": [
        { "name": "Pint Night", "description": "Featured craft pint", "price": "$4", "times": "All day" }
      ],
      "notes": "Every Tuesday",
      "source": "https://exilebrewing.com/events",
      "yelp": { "rating": 4.5, "imageUrl": "...", ... }
    }
  ]
}
```

---

## 💡 Notes & Limitations

- **AI accuracy**: Claude does its best but may miss specials or occasionally surface outdated info. Always confirm with the venue.
- **Caching**: Results are cached for 6 hours (server-side via Next.js `revalidate`). Force a refresh by clicking "Find Specials" again — the UI will re-hit the endpoint but the server may serve cached results until they expire.
- **Rate limits**: Yelp free tier = 500 calls/day. Each search = 1 Yelp call. Claude AI calls cost real money — cache heavily in production.
- **Expanding**: To add more cities, update `VALID_CITIES` in `app/api/specials/route.js` and add buttons in `components/CitySelector.jsx`.

---

## 📝 License

MIT
