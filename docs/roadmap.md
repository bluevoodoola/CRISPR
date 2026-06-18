# Roadmap

Lightweight list of planned work for this repo. Keep it short; move items into
issues/PRs when picked up.

## Planned

_(nothing open right now)_

## Done

- **Per-site signup links (structure).** `sites` in `anomalyData` is now an
  array of `"Name"` strings or `{ name, signup }` entries, normalized via
  `normalizeSite()`; the `signup` (Resistance signup page) link flows through to
  `anomalies.json`. Populating each site's URL is routine data entry in
  `ingress.js` (replace a string with `{ name, signup: "https://..." }`) as
  signup pages are published — not tracked here.
