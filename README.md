# Typographic Hierarchy Playground

An interactive portfolio demo built with React, Vite, and Tailwind CSS. Drag sliders for font size,
weight, spacing, and contrast to see how typographic hierarchy guides the eye — and switch between
seven presets, each paired with a real layout it's built for (blog article, legal text, notification
card, disclaimer/timestamp, pull-quote, marketing hero).

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the site and publishes it to
GitHub Pages. In the repo's **Settings → Pages**, set the source to **GitHub Actions** once.
