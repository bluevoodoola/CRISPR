# CLAUDE.md

Guidance for working in this repository.

## What this is

**CRISPR** — *Collected Resources for Ingress Swag Production: Resistance*.

A small, dependency-free static site that helps plan production logistics for
Ingress Anomaly event swag (T-shirts, patches, badges, etc.). The core artifact
is the **swag timeline**: a per-anomaly Gantt-style schedule that works backwards
from each anomaly's event date to derive design, ordering, production, shipping,
and marketing deadlines.

It also publishes **`data/anomalies.json`**, a static machine-readable
feed of upcoming anomalies — series, per-site Resistance signup links, and the
public release page on https://ingress.com/news.

The repo hosts a second small tool, the **hypercube-equivalence calculator**
(`hypercubes/`), which pulls Ingress game stats at runtime from an external
game-data service (see `hypercubes/game-data.js`). Dependency-free Ingress data
that *we* own lives in the **`core/`** layer (currently the anomaly data
service); apps depend on `core/`, never the reverse, and `core/` never depends
on an app.

## Layout

```
index.html                      Root redirect -> swagtimeline/index.html
README.md
CLAUDE.md
docs/roadmap.md                 Lightweight roadmap of planned/done work
core/                           CORE Ingress data we own (no app/DOM deps)
  anomaly-data.js               Series + source-of-truth anomaly data + normalizeSite (isomorphic: browser + Node)
  build-anomalies-feed.js       Node generator -> ../data/anomalies.json (reads anomaly-data.js only; not served)
swagtimeline/                   The swag-timeline app (consumes core/anomaly-data.js)
  index.html                    Loads CDN deps + the four scripts below, renders tabs
  helper.js                     createElement() DOM helper
  schedules/swag.js             The swag schedule template: groups[] + events[] (DATA)
  ingress.js                    Swag-timeline layer: Anomaly class + schedule resolution (consumes core/anomaly-data.js)
  swagtimeline_tabs.js          Renders one vis-timeline per upcoming anomaly
  swagtimeline.css              Styling (per-group .spt-* colors)
hypercubes/                     The hypercube-equivalence calculator app
  index.html                    Loads CDN deps + the three scripts below
  game-data.js                  Fetches game stats from the external service -> INGRESS_ITEMS
  calculator.js                 Calculator class (reads INGRESS_ITEMS)
  chart.js                      Canvas chart rendering
  hypercubes.css                Styling
data/
  anomalies.json                Generated feed at the site root (gitignored; built at deploy time, not committed)
.github/workflows/
  deploy-pages.yml              Builds the feed + deploys the site to GitHub Pages
```

The site is **pure static files** (root `index.html` does a meta-refresh
redirect to `swagtimeline/`). No bundler, no framework. Browser dependencies
(jQuery/jQuery UI, vis-timeline, dayjs) are loaded from CDNs in
`swagtimeline/index.html`. Scripts are plain classic `<script>` tags and rely on
**shared top-level lexical scope** between files (e.g. `anomalyData`/`series`
from `core/anomaly-data.js` and `swag` from `schedules/swag.js` are read by
`ingress.js`; `ingress` is read by `swagtimeline_tabs.js`) — load order in
`swagtimeline/index.html` matters: `helper.js` → `../core/anomaly-data.js` →
`schedules/swag.js` → `ingress.js` → `swagtimeline_tabs.js`. The dependency
direction is deliberate: the core data service (`core/anomaly-data.js`) stands
alone, and the swag-timeline layer (`ingress.js`) depends on it — never the
reverse.

## Branches & deployment

- **`main`** — default/dev branch. Commit here freely; **pushing to `main` does
  not publish anything.**
- **`publish`** — production. GitHub Pages serves the site at
  `https://bluevoodoola.github.io/CRISPR/` (no custom domain).
- **The gate is promotion to `publish`.** To release, advance `publish` to
  `main` (fast-forward/merge) and push it. That push triggers
  `.github/workflows/deploy-pages.yml`, which generates `data/anomalies.json`
  and deploys the site as a Pages artifact (Pages source = "GitHub Actions"). Nothing
  generated is committed; `main` and `publish` don't accumulate build commits.
- `workflow_dispatch` re-deploys `publish` on demand. There is no cron.

## How the timeline works

`schedules/swag.js` defines a **schedule template** as `events[]`. Each event
declares a `dependency` that anchors it relative to another point, and these are
resolved into concrete dates per anomaly in `ingress.js`'s `Anomaly.events()`
(the swag-timeline layer; the anchoring data itself lives in `anomaly-data.js`):

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

`core/anomaly-data.js` (the core data service) holds **two plain-data
arrays** that are the single place to edit anomaly/series facts:

- `seriesData[]` — `{ handle, name, url }` where `url` is the public
  release/overview page on https://ingress.com/news.
- `anomalyData[]` — `{ date: "YYYY/MM/DD", series: <handle>, subseries, sites }`.
  `sites` is an **array**; each entry is a plain `"Name"` string until a link is
  known, then `{ name, signup, hype, shop }` carrying whichever links exist
  (`signup` = Resistance signup page, `hype` = hype/community chat, `shop` = swag
  shop). `normalizeSite()` collapses both forms to `{ name, signup, hype, shop }`
  (each link `null` when unknown), used by the header rendering and the JSON feed
  alike. The set of link kinds lives in `SITE_LINK_KINDS` — append to it to add a
  new kind; `normalizeSite` and the feed pick it up automatically.

`anomaly-data.js` also builds the `series` map (`Series` objects keyed by
handle) — pure data, no dayjs. It is **isomorphic**: as a browser `<script>` it
shares these names via top-level scope; under Node it does
`module.exports = { SITE_LINK_KINDS, normalizeSite, Series, seriesData, anomalyData, series }`,
which is what lets `build-anomalies-feed.js` reuse the data (and the same site
normalization) without a browser, dayjs, or the swag schedule.

The swag-timeline layer (`swagtimeline/ingress.js`) consumes this data: it
builds the `Anomaly` objects + `futureAnomalies` filter (browser only, guarded
by `typeof dayjs !== "undefined" && typeof swag !== "undefined"`) and exposes
`ingress` for the tab renderer. It is **not** required from Node — the feed
builds straight from the core service.

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

### Site link patterns

A site can carry up to three links (`signup`, `hype`, `shop`); fill in whichever
are published, leaving the rest unset (they normalize to `null`).

- **signup** — Resistance signup page. Observed (not guaranteed): most sites
  follow `https://register.<city>.willbe.blue/` (e.g. Helsinki, Geneva, Lima,
  Seoul, Paris, Singapore). Some run their own domain — e.g. Bogotá uses
  `https://laresistencia.co/`. Treat the `register.<city>.willbe.blue` form only
  as a hint when you don't have one yet.
- **hype** — hype/community chat (set up before signup opens for some sites).
  e.g. Denver uses `https://res.blue/group/denver-anomaly-2026-non-secure`.
- **shop** — swag shop link.

Always use the actual published link, and don't put a non-signup URL in the
`signup` field — a hype chat is `hype`, not a stand-in `signup`.

## Common tasks

**Add/update an anomaly or series:** edit `seriesData`/`anomalyData` in
`core/anomaly-data.js` (the only place), commit to `main`, and promote to
`publish` when ready to release (the deploy rebuilds the feed). To preview the
feed locally first:

```
node core/build-anomalies-feed.js
```

You do **not** commit `data/anomalies.json` — it's gitignored and built fresh at
deploy time by `deploy-pages.yml`. Running the generator locally is only for
previewing. The feed lists the anomalies that are "upcoming" at build time, so
it self-prunes past anomalies on the next deploy. `generatedAt` records when the
upcoming set last *changed* (the generator is idempotent — re-running with no
change reuses the previous timestamp, so output is byte-identical).

**Add a site's link (signup / hype / shop):** in `anomalyData`, change a site
from a plain `"Name"` string to an object carrying the known links, e.g.
`{ name: "Name", signup: "https://..." }` or `{ name: "Name", hype: "https://..." }`
(include any subset). Each flows into `anomalies.json` automatically; the
timeline header is unaffected (it shows site names only). Mixed forms in one
`sites` array are fine.

**Change a production lead time / add a swag item step:** edit `events[]` in
`schedules/swag.js`. New events that anchor to another event must appear after
that event in the array.

**Hypercube calculator game data:** `hypercubes/calculator.js` reads
`INGRESS_ITEMS` (`STATS_POWERCUBE["8"].XM` and `STATS_HYPER[level].XM`).
`hypercubes/game-data.js` populates that at runtime by fetching the external
game-data service (`GAME_DATA_URL`, currently
`https://legendre-web-production.up.railway.app/reference/game.json`) and
adapting it in `adaptGameData()`. The coupling to the service's schema lives
*only* there: it reads `items.power_cube.capacity_xm_by_level` and
`levels[].hypercube_capacity`. If the service moves or changes shape, update
`GAME_DATA_URL` / `adaptGameData()` — the calculator itself needn't change. The
endpoint must stay CORS-enabled (`access-control-allow-origin`) for the browser
fetch to work.

## Conventions

- Vanilla ES (classes, `forEach`/`map`), no TypeScript, no framework.
- Leading-comma formatting in the data arrays (`, { ... }` on its own line) —
  match it when adding entries.
- Keep the core data service isomorphic-safe: nothing at top level of
  `anomaly-data.js` may call `dayjs`/touch the DOM, or the Node feed generator
  breaks. dayjs/DOM/swag usage belongs in the `ingress.js` timeline layer.
- UTF-8 throughout (site names like `Bogotá`, `São Paulo` appear in the data).

## Verifying changes

- Feed: `node core/build-anomalies-feed.js` and inspect `data/anomalies.json`.
- Browser render path (no browser needed): the schedule resolution can be
  exercised by loading `core/anomaly-data.js` + `swagtimeline/schedules/swag.js`
  + `swagtimeline/ingress.js` as
  one combined script in a Node `vm` context with a small `dayjs` shim supporting
  `add(n,'day')`, `startOf('day')`, `isBefore`, `isAfter`, and
  `format('YYYY-MM-DD' | 'YYYY-MMM-DD')`. A passing check yields the expected
  `futureAnomalies` count and per-anomaly `schedule_swag` start/end.
