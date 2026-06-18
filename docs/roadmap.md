# Roadmap

Lightweight list of planned work for this repo. Keep it short; move items into
issues/PRs when picked up.

## Planned

_Nothing currently planned._

## Done

- **Untangled the core anomaly data service from the swag timeline.** The core
  data service now lives in `swagtimeline/anomaly-data.js` (series/anomaly data,
  `normalizeSite`, `Series`, the `series` map) with no knowledge of swag, dayjs,
  or the DOM. The swag-timeline layer (`ingress.js` — the `Anomaly` class,
  schedule resolution, `futureAnomalies`) and the JSON feed
  (`build-anomalies-feed.js`) both consume it; the dependency runs one way only.
  A possible follow-up (not planned) is to physically relocate the service out
  of `swagtimeline/`, but that would change the published feed URL
  (`swagtimeline/anomalies.json`), so it's deliberately deferred.
- **Per-site links (structure).** `sites` in `anomalyData` is now an array of
  `"Name"` strings or `{ name, signup, hype, shop }` entries, normalized via
  `normalizeSite()` (link kinds listed in `SITE_LINK_KINDS`); each link flows
  through to `anomalies.json`. Populating each site's URLs is routine data entry
  in `anomaly-data.js` (replace a string with `{ name, signup/hype/shop: "https://..." }`)
  as pages are published — not tracked here.
