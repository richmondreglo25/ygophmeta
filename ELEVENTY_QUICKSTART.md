# Quick Start: Eleventy Event Pages

## Commands

```bash
npm run 11ty:serve    # Dev server at http://localhost:8080
npm run 11ty:build    # Build to _output/
npm run 11ty:deploy   # Deploy to GitHub Pages
```

## Generated URLs

- Homepage: `https://yourusername.github.io/ygophmeta/`
- Events: `https://yourusername.github.io/ygophmeta/events/<event-id>.html`

## GitHub Pages Setup

1. Go to: **Settings** → **Pages**
2. Source: **GitHub Actions**
3. Push to `main` branch → auto-deploys

## File Structure

```
_site/              # Eleventy templates
  events.njk        # Generates /events/<id>.html
  index.njk         # Generates /index.html
public/data/events/ # Event data (*.json files)
_output/            # Generated site (deploy this)
```

## Add New Events

1. Add/edit JSON files in `public/data/events/`
2. Run `npm run 11ty:build`
3. Deploy (auto on push or run `npm run 11ty:deploy`)

Events with duplicate IDs are automatically deduplicated.
