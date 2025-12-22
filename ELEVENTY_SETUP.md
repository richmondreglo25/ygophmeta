# Eleventy Implementation Summary

## ✅ What's Been Implemented

Eleventy has been successfully configured to generate static event pages for GitHub Pages deployment at `/events/<id>.html`.

## 📁 Project Structure

```
.eleventy.js                          # Eleventy configuration
_site/                                # Source files for Eleventy
  _data/
    events.js                         # Aggregates event data from JSON files (with deduplication)
  _includes/
    layout.njk                        # Base HTML layout with styling
  events.njk                          # Template that generates individual event pages
  index.njk                           # Homepage listing all events
_output/                              # Generated static site (gitignored)
  events/
    <event-id>.html                   # Individual event pages
  index.html                          # Homepage
public/data/events/                   # Event data source
  2025-01.json through 2025-12.json   # Monthly event data files
.github/workflows/
  eleventy-deploy.yml                 # GitHub Actions workflow for auto-deployment
```

## 🎯 Key Features

1. **Static Event Pages**: Each event gets its own HTML page at `/events/<event-id>.html`
2. **Automatic Deduplication**: Events with duplicate IDs across monthly files are automatically deduplicated
3. **Responsive Design**: Clean, mobile-friendly styling built into the templates
4. **Event Listing**: Homepage displays all events with key information
5. **Rich Event Details**: Individual pages show:
   - Event title, host, date, location
   - Event details (participants count, rounds, format, etc.)
   - Winners with positions and decks
   - Full participant list with decks
   - Additional notes

## 🚀 Available Commands

```bash
# Development server with live reload
npm run 11ty:serve
# Runs at http://localhost:8080

# Build static site
npm run 11ty:build
# Outputs to _output/

# Build and deploy to GitHub Pages
npm run 11ty:deploy
```

## 🔄 GitHub Pages Deployment

### Automatic Deployment

A GitHub Actions workflow has been configured at `.github/workflows/eleventy-deploy.yml`:

- Triggers on push to `main` branch
- Builds the Eleventy site
- Deploys to GitHub Pages automatically

### Setup Instructions

1. Go to Repository Settings → Pages
2. Under "Build and deployment", select **"GitHub Actions"** as the source
3. Push changes to main branch to trigger deployment

### Manual Deployment

```bash
npm run 11ty:deploy
```

Uses gh-pages package to deploy the `_output/` directory

## 📊 Data Format

Events are read from `/public/data/events/*.json` files. Each JSON file contains an array of events:

```json
[
  {
    "id": "unique-event-id",
    "title": "Event Name",
    "host": "Host Name",
    "when": "2025-01-15T13:00:00Z",
    "where": "Location details",
    "desc": [{ "name": "Detail Name", "desc": "Detail Value" }],
    "participants": [{ "name": "Player", "deck": "Deck Type" }],
    "winners": [{ "name": "Winner", "position": 1, "deck": "Deck Type" }],
    "notes": "Additional information"
  }
]
```

## 🛠️ Technical Details

### Filters

- `formatDate`: Converts ISO date strings to readable format
- `ordinal`: Converts numbers to ordinal format (1st, 2nd, 3rd, etc.)

### Deduplication

The `_site/_data/events.js` file automatically deduplicates events by ID when aggregating from multiple JSON files.

### Template Engine

Uses Nunjucks (`.njk`) for templating with:

- Template inheritance (extends/blocks)
- Pagination for generating individual pages
- Filters for data formatting
- Loops and conditionals

## 🎨 Styling

Inline styles are included in the layout template with:

- Responsive grid layouts
- Card-based design
- Clean typography
- Mobile-friendly breakpoints
- Hover effects and transitions

## 📝 Next Steps

To use this system:

1. **Development**: Run `npm run 11ty:serve` to preview locally
2. **Add Events**: Add or modify JSON files in `/public/data/events/`
3. **Build**: Run `npm run 11ty:build` to generate static files
4. **Deploy**: Push to main branch for automatic deployment, or run `npm run 11ty:deploy` manually

## 🔗 Generated URLs

- Homepage: `/index.html` or `/`
- Event pages: `/events/<event-id>.html`
- All static assets from `/public/` are copied to output

## ✨ Benefits

- **Fast**: Static HTML pages load instantly
- **SEO Friendly**: All content is in HTML, easily indexed
- **Free Hosting**: Works perfectly with GitHub Pages
- **No Server Required**: Pure static site
- **Easy Updates**: Just update JSON files and redeploy
