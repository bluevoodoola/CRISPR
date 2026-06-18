# Roadmap

Lightweight list of planned work for this repo. Keep it short; move items into
issues/PRs when picked up.

## Planned

- **Untangle the core anomaly data service from the swag timeline.** The
  anomaly data service (series/anomaly data + `normalizeSite`, published as
  `anomalies.json`) is a core service in its own right; the swag timeline is one
  consumer of it. Today they're intermingled in `swagtimeline/ingress.js`, and
  the dependency runs the wrong way — the core data's browser build is gated on
  the swag schedule (`typeof swag !== "undefined"`) and the file lives under
  `swagtimeline/`. Refactor so the core data stands alone with no knowledge of
  swag, and the swag-timeline layer (the `Anomaly` class, schedule resolution,
  `futureAnomalies`) depends on it — not the reverse. The feed generator already
  consumes only the core pieces, so it should ride along cleanly.

## Done

- **Per-site links (structure).** `sites` in `anomalyData` is now an array of
  `"Name"` strings or `{ name, signup, hype, shop }` entries, normalized via
  `normalizeSite()` (link kinds listed in `SITE_LINK_KINDS`); each link flows
  through to `anomalies.json`. Populating each site's URLs is routine data entry
  in `ingress.js` (replace a string with `{ name, signup/hype/shop: "https://..." }`)
  as pages are published — not tracked here.
