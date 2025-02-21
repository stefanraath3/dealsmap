# DealsMap 🗺️

A Next.js application that maps and tracks food & drink specials across Cape Town. Find the best deals near you, from happy hours to weekly specials.

## Features

- 📍 Interactive map showing deal locations
- 🏷️ Daily and recurring specials
- 🕒 Operating hours and time windows for each deal
- 📱 Mobile-friendly interface
- 🔍 Deal filtering by day and category
- 💰 Price tracking (original vs. special prices)

## Tech Stack

- Next.js
- TypeScript
- Drizzle ORM
- Map integration (location services)

## Local Development

1. Clone the repository:

```bash
git clone https://github.com/stefanraath3/dealsmap.git
cd dealsmap
```

2. Install dependencies:

```bash
npm install
```

3. Set up your environment variables:

```bash
cp .env.example .env.local
```

4. Run the development server:

```bash
npm run dev
```

5. Populate the database with sample deals:

```bash
npm run populate-deals
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Database Schema

The application uses a deals table with the following key fields:

- title
- description
- location
- latitude/longitude
- category
- day
- timeWindow
- price/originalPrice
- operatingHours
- isRecurring
- isActive

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for your own purposes.
