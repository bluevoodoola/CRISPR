# Roadmap

Lightweight list of planned work for this repo. Keep it short; move items into
issues/PRs when picked up.

## Planned

- **Per-site registration links.** Expose a registration link for each anomaly
  site (e.g. on the anomaly data and in `anomalies.json`).

  Requires refactoring: an anomaly date can have **multiple sites**, and today
  sites are a single comma-separated string in `anomalyData`
  (`sites: "Helsinki, Bogotá"` in [swagtimeline/ingress.js](../swagtimeline/ingress.js)).
  The feed generator
  ([swagtimeline/build-anomalies-feed.js](../swagtimeline/build-anomalies-feed.js))
  currently just splits that string into a names array. To attach a link per
  site, model sites as structured entries instead, e.g.:

  ```js
  sites: [
    { name: "Helsinki", registration: "https://..." },
    { name: "Bogotá",   registration: "https://..." }
  ]
  ```

  Touch points to update: `anomalyData` shape, the `Anomaly` class /
  `header` rendering, the feed generator's `sites` mapping, and any consumers of
  the current `sites` string.
