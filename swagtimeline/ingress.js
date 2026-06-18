// Swag timeline layer.
//
// Consumes the core anomaly data service (anomaly-data.js) plus the swag
// schedule template (schedules/swag.js) to build a resolved per-anomaly swag
// schedule, then exposes the upcoming anomalies for swagtimeline_tabs.js to
// render. The dependency runs one way: this layer depends on the core data
// service, never the reverse.
//
// Browser-only. It reads globals provided by earlier <script> tags
// (seriesData/anomalyData/series/normalizeSite from anomaly-data.js, `swag` from
// schedules/swag.js, plus dayjs), so load order in index.html matters:
// anomaly-data.js -> schedules/swag.js -> ingress.js. The JSON feed builds
// straight from the core data service and never loads this file.

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

// Build Anomaly objects (and the swag schedule they carry) from the core data
// service. Guarded so that if this file is ever loaded without dayjs or the swag
// schedule it stays inert instead of throwing at load time.
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
