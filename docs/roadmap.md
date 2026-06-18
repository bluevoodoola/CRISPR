# Roadmap

Lightweight list of planned work for this repo. Keep it short; move items into
issues/PRs when picked up.

## Planned

_Nothing currently planned._

## Done

- **Untangled the core anomaly data service from the swag timeline.** The core
  data service now lives in its own top-level `core/` folder — `anomaly-data.js`
  (series/anomaly data, `normalizeSite`, `Series`, the `series` map) and the feed
  generator `build-anomalies-feed.js` — with no knowledge of swag, dayjs, or the
  DOM. The swag-timeline app under `swagtimeline/` (the `Anomaly` class, schedule
  resolution, `futureAnomalies`, renderer) consumes it; the dependency runs one
  way only. The generated feed publishes at the site root under
  `data/anomalies.json` (was `swagtimeline/anomalies.json`) to reflect that it's
  a core-service artifact, not part of the timeline.
- **Hypercube calculator sources game stats from an external service.** The
  bundled `ingress_items.js` data file is gone; `hypercubes/game-data.js` now
  fetches the canonical Niantic stats at runtime from the external game-data
  service (`/reference/game.json`, CORS-enabled) and adapts the slice the
  calculator needs into the `INGRESS_ITEMS` shape it already expects. Removes the
  owned-data dependency from that app; `core/` no longer carries item stats.
- **Per-site links (structure).** `sites` in `anomalyData` is now an array of
  `"Name"` strings or `{ name, signup, hype, shop }` entries, normalized via
  `normalizeSite()` (link kinds listed in `SITE_LINK_KINDS`); each link flows
  through to `anomalies.json`. Populating each site's URLs is routine data entry
  in `core/anomaly-data.js` (replace a string with `{ name, signup/hype/shop: "https://..." }`)
  as pages are published — not tracked here.
