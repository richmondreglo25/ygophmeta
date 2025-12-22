# Deployment Checklist for Eleventy Event Pages

## ✅ Pre-Deployment

- [ ] Event data is correct in `/public/data/events/*.json`
- [ ] Test locally with `npm run 11ty:serve`
- [ ] Verify event pages load at `http://localhost:8080/events/<id>.html`
- [ ] Build succeeds with `npm run 11ty:build`
- [ ] Check `_output/` directory contains generated files

## ✅ GitHub Pages Setup (One-time)

1. [ ] Push code to GitHub repository
2. [ ] Go to repository **Settings** → **Pages**
3. [ ] Under "Build and deployment":
   - Source: Select **"GitHub Actions"**
4. [ ] Verify `.github/workflows/eleventy-deploy.yml` exists

## ✅ Deploy

### Automatic (Recommended)

- [ ] Commit changes to `main` branch
- [ ] Push to GitHub
- [ ] Check Actions tab for deployment status
- [ ] Wait 1-2 minutes for deployment
- [ ] Visit your GitHub Pages URL

### Manual

```bash
npm run 11ty:deploy
```

## ✅ Post-Deployment Verification

- [ ] Visit your GitHub Pages site
- [ ] Check homepage loads: `https://yourusername.github.io/ygophmeta/`
- [ ] Test an event page: `https://yourusername.github.io/ygophmeta/events/<event-id>.html`
- [ ] Verify all event details display correctly
- [ ] Check responsive design on mobile

## 🔧 Troubleshooting

### Build fails

- Check for duplicate event IDs in JSON files (should auto-deduplicate)
- Validate JSON syntax in event files
- Run `npm run 11ty:build` to see detailed errors

### Pages don't deploy

- Ensure GitHub Actions is enabled in repository settings
- Check Actions tab for error messages
- Verify `.nojekyll` file exists (created automatically)

### 404 errors

- Check that GitHub Pages is enabled
- Verify the correct branch is selected
- URLs should use `.html` extension

## 📝 Updating Events

1. Edit JSON files in `/public/data/events/`
2. Test locally: `npm run 11ty:serve`
3. Commit and push to `main` branch
4. GitHub Actions will automatically rebuild and deploy

## 🎯 URL Structure

Base URL: `https://yourusername.github.io/ygophmeta/`

| Page  | URL                       |
| ----- | ------------------------- |
| Home  | `/` or `/index.html`      |
| Event | `/events/<event-id>.html` |

Replace `yourusername` with your GitHub username and `ygophmeta` with your repository name.
