// A site can be written as a plain "Name" string (no signup link yet) or as
// { name, signup } once the Resistance signup URL is known. Normalize both to
// the same { name, signup } shape so consumers (the timeline header and the
// JSON feed) only ever deal with one form.
function normalizeSite(site) {
    if (typeof site === "string") {
        return { name: site, signup: null };
    }
    return { name: site.name, signup: site.signup !== undefined ? site.signup : null };
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

class Anomaly {
    constructor(date, series, subseries, sites, schedule_swag) {
        this.date = dayjs(new Date(date));
        this.series = series;
        this.subseries = subseries;
        this.sites = sites.map(normalizeSite);
        this.uniqueid = `${this.series.handle}${this.subseries}`;
        this.header = `${this.series.name} ${this.subseries}: ${this.date.format("YYYY-MMM-DD")} - ${this.sites.map(s => s.name).join(", ")}`;
        this.schedule_swag = this.events(schedule_swag.events);
        this.schedule_swag.groups = schedule_swag.groups;
    }

    events(schedule) {
        var events = [];
        var minstart = null;
        var maxend = null;
        var anchordate;
        schedule.forEach(event => {
            // Scoped per event so a missed assignment fails loudly below
            // instead of silently inheriting the previous event's dates.
            let start;
            let end;
            switch ( event.dependency.anchor.type ) {
                case "anomaly-date":
                    anchordate = this.date;
                    switch ( event.dependency.type ) {
                        case "start-relative": 
                            if ( event.dependency["start-days-before"] !== undefined ) {
                                start = anchordate.add(-event.dependency["start-days-before"], "day");
                            }
                            if ( event.dependency["start-days-after"] !== undefined ) {
                                start = anchordate.add(event.dependency["start-days-after"], "day");
                            }
                            if ( event["duration"] !== undefined ) {
                                end = start.add(event["duration"], "day");
                            }
                            break;
                    }
                    break;
                
                case "event":
                    var anchorevent = events.find(e => e.id === event.dependency.anchor.id);
                    if ( anchorevent === undefined ) {
                        throw new Error(`Event "${event.id}" anchors to unknown event "${event.dependency.anchor.id}" (must be defined earlier in the schedule).`);
                    }
                    switch ( event.dependency.type ) {
                        case "start-relative": 
                            if ( event.dependency["start-days-before"] !== undefined ) {
                                start = anchorevent.internal.startdate.add(-event.dependency["start-days-before"], "day");
                            }
                            if ( event.dependency["start-days-after"] !== undefined ) {
                                start = anchorevent.internal.startdate.add(event.dependency["start-days-after"], "day");
                            }
                            if ( event["duration"] !== undefined ) {
                                end = start.add(event["duration"], "day");
                            }
                            break;
                        case "end-relative": 
                            if ( event.dependency["start-days-before"] !== undefined ) {
                                start = anchorevent.internal.enddate.add(-event.dependency["start-days-before"], "day");
                            }
                            if ( event.dependency["start-days-after"] !== undefined ) {
                                start = anchorevent.internal.enddate.add(event.dependency["start-days-after"], "day");
                            }
                            if ( event["duration"] !== undefined ) {
                                end = start.add(event["duration"], "day");
                            }
                            break;
                        case "mid-relative": 
                            if ( event.dependency["start-days-before"] !== undefined ) {
                                start = anchorevent.internal.startdate.add(anchorevent.internal.duration / 2.0 - event.dependency["start-days-before"], "day");
                            }
                            if ( event.dependency["start-days-after"] !== undefined ) {
                                start = anchorevent.internal.startdate.add(anchorevent.internal.duration / 2.0 + event.dependency["start-days-after"], "day");
                            }
                            if ( event["duration"] !== undefined ) {
                                end = start.add(event["duration"], "day");
                            }
                            break;
                    }
                    break;
            }

            if ( start === undefined || end === undefined ) {
                throw new Error(`Event "${event.id}" did not resolve a start/end date; check its dependency anchor type "${event.dependency.anchor.type}" and dependency type "${event.dependency.type}".`);
            }

            if ( minstart === null || start.isBefore(minstart) ) {
                minstart = start;
            }
            if ( maxend === null || end.isAfter(maxend) ) {
                maxend = end;
            }
            var ev = {
                id: event.id
                , content: (event.content !== undefined ? event.content : event.name)
                , title: (event.title !== undefined ? event.title : event.name)
                , start: start.format("YYYY-MM-DD")
                , end: end.format("YYYY-MM-DD")
                , className: event.className
                , type: (event.type !== undefined ? event.type : "range")
                , group: (event.group !== undefined ? event.group : "UNKNOWN")
                , style: (event.style !== undefined ? event.style : "")
                , internal: {
                    startdate: start
                    , enddate: end
                    , duration: event["duration"]
                }
            }
            events.push(ev);
        });
        return { events: events, start: minstart, end: maxend };
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

// Each site is a plain "Name" string until its Resistance signup page is known,
// then becomes { name: "Name", signup: "https://..." }. See normalizeSite().
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
    , { date: "2026/06/20", series: "2026Q2", subseries: "3", sites: [{ name: "Geneva", signup: "https://register.geneva.willbe.blue/" }, "Lima"] }
    , { date: "2026/07/18", series: "2026Q3", subseries: "1", sites: [{ name: "Helsinki", signup: "https://register.helsinki.willbe.blue" }, { name: "Bogotá", signup: "https://laresistencia.co/" }] }
    , { date: "2026/08/22", series: "2026Q3", subseries: "2", sites: ["Seoul", { name: "Paris", signup: "https://register.paris.willbe.blue/" }] }
    , { date: "2026/09/19", series: "2026Q3", subseries: "3", sites: ["Singapore", "Denver"] }
];

const series = {};
seriesData.forEach(s => { series[s.handle] = new Series(s.handle, s.name, s.url); });

// The Anomaly objects (and the swag schedule they carry) are only built in the
// browser, where dayjs and the swag schedule are loaded. The Node feed
// generator only needs the raw data above, so this block is skipped there.
let anomalies = [];
let futureAnomalies = [];
if (typeof dayjs !== "undefined" && typeof swag !== "undefined") {
    anomalies = anomalyData.map(a => new Anomaly(a.date, series[a.series], a.subseries, a.sites, swag));
    // Only surface anomalies whose date is today or later; past ones stay in
    // anomalyData above for reference but are filtered out automatically.
    const today = dayjs(new Date()).startOf("day");
    futureAnomalies = anomalies.filter(anomaly => !anomaly.date.isBefore(today));
}

const ingress = { series: series, anomalies: futureAnomalies };

// Expose the raw data to Node so build-anomalies-feed.js can generate the
// static JSON feed without a browser, dayjs, or the swag schedule.
if (typeof module !== "undefined" && module.exports) {
    module.exports = { seriesData, anomalyData, normalizeSite };
}