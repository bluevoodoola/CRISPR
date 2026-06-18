# Roadmap

Lightweight list of planned work for this repo. Keep it short; move items into
issues/PRs when picked up.

## Planned

- **Surface per-site links in the swag timeline UI.** The site links
  (`signup`/`hype`/`shop`) now exist in `anomalies.json` and on `anomaly.sites`,
  but the timeline only shows site *names* (in the tab header). A per-tab
  list/table linking each site's pages would expose them in the UI. Touch point:
  `createAnomalyTimeline()` in `swagtimeline/swagtimeline_tabs.js` (render from
  `anomaly.sites`, linking each non-null link in `SITE_LINK_KINDS`).

## Done

- **Per-site links (structure).** `sites` in `anomalyData` is now an array of
  `"Name"` strings or `{ name, signup, hype, shop }` entries, normalized via
  `normalizeSite()` (link kinds listed in `SITE_LINK_KINDS`); each link flows
  through to `anomalies.json`. Populating each site's URLs is routine data entry
  in `ingress.js` (replace a string with `{ name, signup/hype/shop: "https://..." }`)
  as pages are published — not tracked here.
