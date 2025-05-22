class Series {
    constructor(handle, name) {
        this.handle = handle;
        this.name = name;
    }
}

class Anomaly {
    constructor(date, series, subseries, sites, schedule_swag) {
        this.date = dayjs(new Date(date));
        this.series = series;
        this.subseries = subseries;
        this.sites = sites;
        this.uniqueid = `${this.series.handle}${this.subseries}`;
        this.header = `${this.series.name} ${this.subseries} Sites (${this.date.format("YYYY-MMM-DD")}: ${this.sites})`;
        this.schedule_swag = {
            events: this.events(schedule_swag.events)
            , groups: schedule_swag.groups
        }
    }

    events(schedule) {
        var events = [];
        schedule.forEach(event => {
            var start = this.date.add(1 - event["start-days-before"], "day");
            var end = this.date.add(1 - event["end-days-before"], "day");
            if (end.isSame(start)) {
                end = end.add(1, "day");
            }
            events.push({
                id: event.id
                , content: event.name
                , title: event.name
                , start: start.format("YYYY-MM-DD")
                , end: end.format("YYYY-MM-DD")
                , className: event["class-name"]
                , group: event.group
                , type: event.type
            });
        });
        return events;
    }
}

const series = {
    "2025Q2": new Series("2025Q2", "+Theta")
    , "2025Q3": new Series("2025Q3", "+Delta")
    , "2025Q4": new Series("2025Q4", "Unknown")
}
;

const anomalies = [
    /* new Anomaly('2025-05-17', series["2025Q2"], "1", "Manila, Providence")
    , */new Anomaly('2025-06-14', series["2025Q2"], "2", "Perth, Chemnitz", swag)
    , new Anomaly('2025-08-16', series["2025Q3"], "1", "Malacca, Portland", swag)
    , new Anomaly('2025-08-23', series["2025Q3"], "2", "Gothenburg, Quebec", swag)
    , new Anomaly('2025-09-20', series["2025Q3"], "3", "Denpasar, Cambridge", swag)
    , new Anomaly('2025-10-18', series["2025Q4"], "1", "Valencia, São Paulo", swag)
    , new Anomaly('2025-10-25', series["2025Q4"], "2", "Wellington, Houston", swag)
    , new Anomaly('2025-11-15', series["2025Q4"], "3", "Taoyuan, The Hague", swag)
]
;

const ingress = { series: series, anomalies: anomalies };