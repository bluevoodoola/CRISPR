# CLAUDE.md

Guidance for working in this repository.

## What this is

**CRISPR** — *Collected Resources for Ingress Swag Production: Resistance*.

A small, dependency-free static site that helps plan production logistics for
Ingress Anomaly event swag (T-shirts, patches, badges, etc.). The core artifact
is the **swag timeline**: a per-anomaly Gantt-style schedule that works backwards
from each anomaly's event date to derive design, ordering, production, shipping,
and marketing deadlines.

It also publishes **`swagtimeline/anomalies.json`**, a static machine-readable
feed of upcoming anomalies — series, per-site Resistance signup links, and the
public release page on https://ingress.com/news.

## Layout

```
index.html                      Root redirect -> swagtimeline/index.html
README.md
CLAUDE.md
docs/roadmap.md                 Lightweight roadmap of planned/done work
swagtimeline/
  index.html                    Loads CDN deps + the four scripts below, renders tabs
  helper.js                     createElement() DOM helper
  schedules/swag.js             The swag schedule template: groups[] + events[] (DATA)
  ingress.js                    Series/Anomaly classes + the source-of-truth data
  swagtimeline_tabs.js          Renders one vis-timeline per upcoming anomaly
  swagtimeline.css              Styling (per-group .spt-* colors)
  build-anomalies-feed.js       Node generator -> anomalies.json
  anomalies.json                Generated feed (gitignored; built at deploy time, not committed)
.github/workflows/
  deploy-pages.yml              Builds the feed + deploys the site to GitHub Pages
```

The site is **pure static files** (root `index.html` does a meta-refresh
redirect to `swagtimeline/`). No bundler, no framework. Browser dependencies
(jQuery/jQuery UI, vis-timeline, dayjs) are loaded from CDNs in
`swagtimeline/index.html`. Scripts are plain classic `<script>` tags and rely on
**shared top-level lexical scope** between files (e.g. `swag` from
`schedules/swag.js` is read by `ingress.js`; `ingress` is read by
`swagtimeline_tabs.js`) — load order in `index.html` matters:
`helper.js` → `schedules/swag.js` → `ingress.js` → `swagtimeline_tabs.js`.

## Branches & deployment

- **`main`** — default/dev branch. Commit here freely; **pushing to `main` does
  not publish anything.**
- **`publish`** — production. GitHub Pages serves the site at
  `https://bluevoodoola.github.io/CRISPR/` (no custom domain).
- **The gate is promotion to `publish`.** To release, advance `publish` to
  `main` (fast-forward/merge) and push it. That push triggers
  `.github/workflows/deploy-pages.yml`, which generates `anomalies.json` and
  deploys the site as a Pages artifact (Pages source = "GitHub Actions"). Nothing
  generated is committed; `main` and `publish` don't accumulate build commits.
- `workflow_dispatch` re-deploys `publish` on demand. There is no cron.

## How the timeline works

`schedules/swag.js` defines a **schedule template** as `events[]`. Each event
declares a `dependency` that anchors it relative to another point, and these are
resolved into concrete dates per anomaly in `ingress.js`'s `Anomaly.events()`:

- `dependency.anchor.type`:
  - `anomaly-date` — relative to the anomaly's own date
  - `event` — relative to another already-resolved event (must be defined
    **earlier** in `events[]`; resolution is single-pass and throws on a
    forward/unknown reference)
- `dependency.type`: `start-relative`, `end-relative`, or `mid-relative`
  (mid uses the anchor's `duration/2`)
- offsets: `start-days-before` / `start-days-after`; `duration` sets the span

`Anomaly.events()` throws loudly if any event fails to resolve a start/end —
keep that behavior; don't make resolution silently skip.

## Source of truth for anomaly data

`swagtimeline/ingress.js` holds **two plain-data arrays** that are the single
place to edit anomaly/series facts:

- `seriesData[]` — `{ handle, name, url }` where `url` is the public
  release/overview page on https://ingress.com/news.
- `anomalyData[]` — `{ date: "YYYY/MM/DD", series: <handle>, subseries, sites }`.
  `sites` is an **array**; each entry is a plain `"Name"` string until its
  Resistance signup page is known, then `{ name, signup }`. `normalizeSite()`
  collapses both forms to `{ name, signup }` (signup `null` when unknown), used
  by the header rendering and the JSON feed alike.

From these, `ingress.js` builds `Series` objects and (in the browser only)
`Anomaly` objects + the `futureAnomalies` filter. The browser build is guarded
by `typeof dayjs !== "undefined" && typeof swag !== "undefined"`, and the file
`module.exports = { seriesData, anomalyData, normalizeSite }` when required from
Node — this is what lets the feed generator reuse the data (and the same site
normalization) without dayjs or the swag schedule.

Only **upcoming** anomalies (date today-or-later) surface in both the timeline
and the feed; past entries stay in `anomalyData` for reference.

### Series ↔ release URL pattern

Release overview pages follow `https://ingress.com/news/<year>-<series>`:

| handle  | name    | release slug          |
|---------|---------|-----------------------|
| 2025Q2  | +Theta  | `2025-plustheta`      |
| 2025Q3  | +Delta  | `2025-plusdelta`      |
| 2025Q4  | +Beta   | `2025-plusbeta`       |
| 2026Q1  | +Gamma  | `2026-plusgamma`      |
| 2026Q2  | Orion   | `2026-orion`          |
| 2026Q3  | Apollo  | `2026-apollo`         |

`+`-prefixed series use the `plus<name>` slug; named series use the bare name.
The news index is paginated (`/news?page=N`), oldest series on higher pages.

### Site ↔ signup URL pattern

Observed (not guaranteed) for Resistance signup pages: most sites follow
`https://register.<city>.willbe.blue/` (e.g. Helsinki, Geneva, Lima, Seoul,
Paris). Some sites run their own domain — e.g. Bogotá uses
`https://laresistencia.co/`. Always use the actual published link; treat the
`register.<city>.willbe.blue` form only as a hint when you don't have one yet.

## Common tasks

**Add/update an anomaly or series:** edit `seriesData`/`anomalyData` in
`swagtimeline/ingress.js` (the only place), commit to `main`, and promote to
`publish` when ready to release (the deploy rebuilds the feed). To preview the
feed locally first:

```
node swagtimeline/build-anomalies-feed.js
```

You do **not** commit `anomalies.json` — it's gitignored and built fresh at
deploy time by `deploy-pages.yml`. Running the generator locally is only for
previewing. The feed lists the anomalies that are "upcoming" at build time, so
it self-prunes past anomalies on the next deploy. `generatedAt` records when the
upcoming set last *changed* (the generator is idempotent — re-running with no
change reuses the previous timestamp, so output is byte-identical).

**Add a site's Resistance signup link:** in `anomalyData`, change a site from a
plain `"Name"` string to `{ name: "Name", signup: "https://..." }`. It flows
into `anomalies.json` automatically; the timeline header is unaffected (it shows
site names only). Mixed forms in one `sites` array are fine.

**Change a production lead time / add a swag item step:** edit `events[]` in
`schedules/swag.js`. New events that anchor to another event must appear after
that event in the array.

## Conventions

- Vanilla ES (classes, `forEach`/`map`), no TypeScript, no framework.
- Leading-comma formatting in the data arrays (`, { ... }` on its own line) —
  match it when adding entries.
- Keep data isomorphic-safe: nothing at top level of `ingress.js` may call
  `dayjs`/touch the DOM outside the `typeof` guard, or the Node generator breaks.
- UTF-8 throughout (site names like `Bogotá`, `São Paulo` appear in the data).

## Verifying changes

- Feed: `node swagtimeline/build-anomalies-feed.js` and inspect `anomalies.json`.
- Browser render path (no browser needed): the schedule resolution can be
  exercised by loading `schedules/swag.js` + `ingress.js` as one combined script
  in a Node `vm` context with a small `dayjs` shim supporting
  `add(n,'day')`, `startOf('day')`, `isBefore`, `isAfter`, and
  `format('YYYY-MM-DD' | 'YYYY-MMM-DD')`. A passing check yields the expected
  `futureAnomalies` count and per-anomaly `schedule_swag` start/end.
