# Roadmap

Lightweight list of planned work for this repo. Keep it short; move items into
issues/PRs when picked up.

## Planned

- **Surface per-site signup links in the swag timeline UI.** The `signup` links
  now exist in `anomalies.json` and on `anomaly.sites`, but the timeline only
  shows site *names* (in the tab header). A per-tab list/table linking each
  site's signup page would expose them in the UI. Touch point:
  `createAnomalyTimeline()` in `swagtimeline/swagtimeline_tabs.js` (render from
  `anomaly.sites`, linking `signup` where non-null).

## Done

- **Per-site signup links (structure).** `sites` in `anomalyData` is now an
  array of `"Name"` strings or `{ name, signup }` entries, normalized via
  `normalizeSite()`; the `signup` (Resistance signup page) link flows through to
  `anomalies.json`. Populating each site's URL is routine data entry in
  `ingress.js` (replace a string with `{ name, signup: "https://..." }`) as
  signup pages are published — not tracked here.
