# Eleventy Static Site Generation

This project uses [Eleventy](https://www.11ty.dev/) to generate static event pages for GitHub Pages deployment.

## Project Structure

```
_site/               # Eleventy source files
  _data/            # Data files
    events.js       # Aggregates all events from public/data/events/*.json
  _includes/        # Layout templates
    layout.njk      # Base layout template
  events.njk        # Event page template (generates /events/<id>.html)
  index.njk         # Home page with events list
_output/            # Generated static site (gitignored)
public/             # Static assets (copied to output)
  data/
    events/         # Event JSON files (*.json)
```

## Available Scripts

### Development

```bash
npm run 11ty:serve
```

Starts Eleventy in development mode with hot reload at http://localhost:8080

### Build

```bash
npm run 11ty:build
```

Builds the static site to `_output/` directory

### Deploy

```bash
npm run 11ty:deploy
```

Builds and deploys to GitHub Pages using gh-pages package

## How It Works

1. **Data Collection**: The `_site/_data/events.js` file reads all JSON files from `public/data/events/` and aggregates them into a single collection.

2. **Page Generation**: The `_site/events.njk` template uses Eleventy's pagination feature to generate individual HTML pages for each event at `/events/<event-id>.html`.

3. **Layout**: All pages extend the base layout in `_site/_includes/layout.njk` which includes styling and structure.

4. **Deployment**: The GitHub Actions workflow (`.github/workflows/eleventy-deploy.yml`) automatically builds and deploys to GitHub Pages on push to main branch.

## Event Data Format

Events should be stored in `public/data/events/*.json` with the following structure:

```json
[
  {
    "id": "unique-event-id",
    "title": "Event Title",
    "host": "Host Name",
    "when": "2025-01-15T13:00:00Z",
    "where": "Location",
    "desc": [{ "name": "Detail Name", "desc": "Detail Value" }],
    "participants": [{ "name": "Player Name", "deck": "Deck Name" }],
    "winners": [{ "name": "Winner Name", "position": 1, "deck": "Deck Name" }],
    "notes": "Additional notes"
  }
]
```

## GitHub Pages Setup

To enable GitHub Pages deployment:

1. Go to your repository Settings > Pages
2. Under "Build and deployment", select "GitHub Actions" as the source
3. Push changes to main branch to trigger automatic deployment

## Filters Available

- `formatDate`: Formats ISO date strings to readable format
- `ordinal`: Converts numbers to ordinal format (1st, 2nd, 3rd, etc.)
