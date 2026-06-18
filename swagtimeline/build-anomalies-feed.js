// Generates the static public data feed `anomalies.json` from the single source
// of truth in ingress.js (seriesData + anomalyData). Run after editing the
// anomaly/series data:
//
//     node swagtimeline/build-anomalies-feed.js
//
// The feed exposes the *upcoming* anomalies (date today or later, matching the
// swag timeline's own filter), each enriched with its series name and the link
// to the public release page on https://ingress.com/news. It is a snapshot as
// of generation time, so regenerate and commit whenever the data changes.

const fs = require("fs");
const path = require("path");
const { seriesData, anomalyData, normalizeSite } = require("./ingress.js");

const seriesByHandle = Object.fromEntries(seriesData.map(s => [s.handle, s]));

// Compare dates as YYYYMMDD integers to stay free of timezone surprises.
const dateKey = (y, m, d) => y * 10000 + m * 100 + d;
const now = new Date();
const todayKey = dateKey(now.getFullYear(), now.getMonth() + 1, now.getDate());

const upcoming = anomalyData
    .map(a => {
        const [y, m, d] = a.date.split("/").map(Number);
        const series = seriesByHandle[a.series];
        if (series === undefined) {
            throw new Error(`Anomaly ${a.date} references unknown series "${a.series}".`);
        }
        return { key: dateKey(y, m, d), iso: `${a.date.replace(/\//g, "-")}`, a, series };
    })
    .filter(x => x.key >= todayKey)
    .sort((x, y) => x.key - y.key)
    .map(({ iso, a, series }) => ({
        date: iso,
        series: series.name,
        handle: series.handle,
        subseries: a.subseries,
        sites: a.sites.map(normalizeSite),
        release: series.url
    }));

const outPath = path.join(__dirname, "anomalies.json");

// `generatedAt` marks when the upcoming set last *changed*, not every run. If
// the existing feed already lists the same anomalies, reuse its timestamp so
// the output is byte-identical and a daily/CI run produces no noise commit.
let generatedAt = now.toISOString();
try {
    const prev = JSON.parse(fs.readFileSync(outPath, "utf8"));
    if (JSON.stringify(prev.anomalies) === JSON.stringify(upcoming)) {
        generatedAt = prev.generatedAt;
    }
} catch (e) {
    // No existing (or unreadable) feed: fall through to a fresh timestamp.
}

const feed = {
    generatedAt: generatedAt,
    source: "https://ingress.com/news",
    anomalies: upcoming
};

fs.writeFileSync(outPath, JSON.stringify(feed, null, 2) + "\n");
console.log(`Wrote ${upcoming.length} upcoming anomalies to ${outPath}`);
