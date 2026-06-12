# Verification

Use the full verification flow before shipping changes to the public site:

```sh
npm run verify
```

That command runs:

- `npm run check` for Astro and TypeScript diagnostics.
- `npm run build` to verify the static site compiles.
- `npm run test:e2e` for page-level Playwright checks.

The Playwright suite covers the top-level pages, desktop and mobile navigation, Home proof placement, the Contact form field contract, responsive overflow, semantic landmarks, heading structure, keyboard focus, and reduced-motion carousel behavior.
