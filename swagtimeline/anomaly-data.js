// Core anomaly data service.
//
// The single source of truth for Ingress Anomaly series/event data and the
// site-link normalization every consumer shares. This module is deliberately
// self-contained: it knows nothing about the swag timeline, the swag schedule,
// dayjs, or the DOM. That independence is the point — the same data feeds two
// consumers without either depending on the other:
//   * the browser swag timeline (ingress.js builds Anomaly objects from it), and
//   * the static JSON feed (build-anomalies-feed.js requires this under Node).
// Keep it isomorphic: nothing here may call dayjs or touch the DOM, so it loads
// cleanly both as a classic browser <script> and via Node require().

// The kinds of links a site can carry, in feed/display order. "signup" is the
// Resistance signup page; "hype" is a hype/community chat; "shop" is the swag
// shop. Add a new kind by appending here — normalizeSite and the JSON feed pick
// it up automatically.
const SITE_LINK_KINDS = ["signup", "hype", "shop"];

// A site can be written as a plain "Name" string (no links yet) or as
// { name, signup, hype, shop } once any of those URLs are known. Normalize both
// to the same { name, signup, hype, shop } shape (each link null when unknown)
// so consumers (the timeline header and the JSON feed) only ever deal with one
// form.
function normalizeSite(site) {
    if (typeof site === "string") {
        site = { name: site };
    }
    const out = { name: site.name };
    SITE_LINK_KINDS.forEach(kind => {
        out[kind] = site[kind] !== undefined ? site[kind] : null;
    });
    return out;
}

class Series {
    constructor(handle, name, url) {
        this.handle = handle;
        this.name = name;
        // Link to the public release/overview page for this series on
        // https://ingress.com/news (may be null if no release is published yet).
        this.url = url !== undefined ? url : null;
    }
}

// Single source of truth for series and anomalies. Both the browser timeline
// and the static anomalies.json feed (build-anomalies-feed.js) are built from
// these two arrays, so anomaly dates and release links live in exactly one
// place. `url` is the public release/overview page on https://ingress.com/news.
const seriesData = [
    { handle: "2025Q2", name: "+Theta", url: "https://ingress.com/news/2025-plustheta" }
    , { handle: "2025Q3", name: "+Delta", url: "https://ingress.com/news/2025-plusdelta" }
    , { handle: "2025Q4", name: "+Beta", url: "https://ingress.com/news/2025-plusbeta" }
    , { handle: "2026Q1", name: "+Gamma", url: "https://ingress.com/news/2026-plusgamma" }
    , { handle: "2026Q2", name: "Orion", url: "https://ingress.com/news/2026-orion" }
    , { handle: "2026Q3", name: "Apollo", url: "https://ingress.com/news/2026-apollo" }
];

// Each site is a plain "Name" string until a link is known, then becomes
// { name: "Name", signup/hype/shop: "https://..." } with whichever links exist.
// See normalizeSite() and SITE_LINK_KINDS.
const anomalyData = [
    { date: "2025/06/14", series: "2025Q2", subseries: "2", sites: ["Perth", "Chemnitz"] }
    , { date: "2025/08/16", series: "2025Q3", subseries: "1", sites: ["Malacca", "Portland"] }
    , { date: "2025/08/23", series: "2025Q3", subseries: "2", sites: ["Gothenburg", "Quebec"] }
    , { date: "2025/09/20", series: "2025Q3", subseries: "3", sites: ["Denpasar", "Cambridge"] }
    , { date: "2025/10/18", series: "2025Q4", subseries: "1", sites: ["Valencia", "São Paulo"] }
    , { date: "2025/10/25", series: "2025Q4", subseries: "2", sites: ["Wellington", "Houston"] }
    , { date: "2025/11/15", series: "2025Q4", subseries: "3", sites: ["Taoyuan", "The Hague"] }
    , { date: "2026/02/28", series: "2026Q1", subseries: "1", sites: ["Lisbon", "Charlotte"] }
    , { date: "2026/03/14", series: "2026Q1", subseries: "2", sites: ["Hong Kong", "Zagreb"] }
    , { date: "2026/03/21", series: "2026Q1", subseries: "3", sites: ["Hyderabad", "Buenos Aires"] }
    , { date: "2026/05/16", series: "2026Q2", subseries: "1", sites: ["Sydney", "Prague"] }
    , { date: "2026/05/30", series: "2026Q2", subseries: "2", sites: ["Kure City", "Jersey City"] }
    , { date: "2026/06/20", series: "2026Q2", subseries: "3", sites: [{ name: "Geneva", signup: "https://register.geneva.willbe.blue/" }, { name: "Lima", signup: "https://register.lima.willbe.blue/" }] }
    , { date: "2026/07/18", series: "2026Q3", subseries: "1", sites: [{ name: "Helsinki", signup: "https://register.helsinki.willbe.blue" }, { name: "Bogotá", signup: "https://laresistencia.co/" }] }
    , { date: "2026/08/22", series: "2026Q3", subseries: "2", sites: [{ name: "Seoul", signup: "https://register.seoul.willbe.blue/" }, { name: "Paris", signup: "https://register.paris.willbe.blue/" }] }
    , { date: "2026/09/19", series: "2026Q3", subseries: "3", sites: [{ name: "Singapore", signup: "https://register.singapore.willbe.blue/" }, { name: "Denver", hype: "https://res.blue/group/denver-anomaly-2026-non-secure" }] }
];

// Indexed Series objects, keyed by handle. Pure data (no dayjs), so it's built
// here in the core service and reused by the timeline layer.
const series = {};
seriesData.forEach(s => { series[s.handle] = new Series(s.handle, s.name, s.url); });

// Expose the core data to Node so build-anomalies-feed.js can generate the
// static JSON feed without a browser, dayjs, or the swag schedule. In the
// browser these names are shared with later scripts via top-level script scope.
if (typeof module !== "undefined" && module.exports) {
    module.exports = { SITE_LINK_KINDS, normalizeSite, Series, seriesData, anomalyData, series };
}
