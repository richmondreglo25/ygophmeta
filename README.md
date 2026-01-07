# YGO PH Meta

Yu-Gi-Oh! Philippines Meta Database  
A comprehensive database for the Yu-Gi-Oh! TCG community in the Philippines, featuring events, players, judges, shops, and banlist information.

**Live site:** [https://ygophmeta.com](https://ygophmeta.com)

---

## Features

- 🏆 **Events**: Browse and search official and community Yu-Gi-Oh! events in the Philippines.
- 👤 **Players**: Player profiles, rankings, and statistics.
- 🧑‍⚖️ **Judges**: List of certified judges.
- 🏪 **Shops**: Directory of local game stores.
- 🚫 **Banlist**: Up-to-date banlist information.
- 🔎 **Search & Filter**: Powerful search and filter for all data tables.
- 📱 **Responsive**: Mobile-friendly and fast.

---

## Getting Started

### 1. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### 2. Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

- `app/` - Next.js app directory (pages, layouts, etc.)
- `src/components/` - Reusable React components
- `src/utils/` - Utility functions (environment, banlist, etc.)
- `public/` - Static assets (images, CNAME, etc.)
- `data/` - Static data files (events, players, etc.)

---

## Deployment

This project is deployed as a static site to GitHub Pages at [https://ygophmeta.com](https://ygophmeta.com).

### Custom Domain

- The `public/CNAME` file contains the custom domain for GitHub Pages deployment.
- DNS is configured to point `ygophmeta.com` to GitHub Pages.

### Build & Export

```bash
npm run build
npm run export
```

The static site will be output to the `out/` directory.

---

## Contributing

Contributions are welcome!  
Feel free to open issues or pull requests for features, bug fixes, or data updates.

---

## License

[MIT](LICENSE)

---

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
