const fs = require('fs');
const dayjs = require('dayjs')

var schedule = JSON.parse(fs.readFileSync('schedule.json'));

var series = {
    "PlusTheta": {
        "handle": "PlusTheta"
        , "name": "+Theta"
    }
    , "Unknown": {
        "handle": "Unknown"
        , "name": "Unknown"
    }
};

var anomalies = [
    {
        "date": dayjs(new Date('2025-05-17'))
        , "series": series["PlusTheta"]
        , "subseries": "1"
        , "sites": "Manila, Providence"
    }
    , {
        "date": dayjs(new Date('2025-06-14'))
        , "series": series["PlusTheta"]
        , "subseries": "2"
        , "sites": "Perth, Chemnitz"
    }
    , {
        "date": dayjs(new Date('2025-08-16'))
        , "series": series["Unknown"]
        , "subseries": "1"
        , "sites": "Malacca, Portland"
    }
    , {
        "date": dayjs(new Date('2025-08-23'))
        , "series": series["Unknown"]
        , "subseries": "2"
        , "sites": "Gothenburg, Quebec"
    }
    , {
        "date": dayjs(new Date('2025-09-20'))
        , "series": series["Unknown"]
        , "subseries": "3"
        , "sites": "Denpasar, Cambridge"
    }
];

anomalies.forEach(anomaly => {
    console.log(`<h2 id="h2#${anomaly.series.handle}"><a id="#${anomaly.series.handle}${anomaly.subseries}" href="#${anomaly.series.handle}${anomaly.subseries}" class="header">${anomaly.series.name} ${anomaly.subseries} Sites (${anomaly.date.format("YYYY-MMM-DD")}: ${anomaly.sites})</a></h2><div id="vis${anomaly.series.handle}${anomaly.subseries}"></div>`);
    console.log(`<script type="text/javascript">`);
    console.log(`var ctr${anomaly.series.handle}${anomaly.subseries} = document.getElementById('vis${anomaly.series.handle}${anomaly.subseries}');`);
    console.log(`var grp${anomaly.series.handle}${anomaly.subseries} = new vis.DataSet([{ id: 'Design', content: 'Design'},{ id: 'Store', content: 'Store'},{ id: 'Production', content: 'Production'},{ id: 'Logistics', content: 'Logistics'}]);`);
    console.log(`var itms${anomaly.series.handle}${anomaly.subseries} = new vis.DataSet(`);

    var events = [];
    schedule.forEach(event => {
        start = anomaly.date.add(1 - event["start-days-before"], "day");
        end = anomaly.date.add(1 - event["end-days-before"], "day");
        if (end.isSame(start)) {
            end = end.add(1, "day");
        }
        var data = {
            id: event.id
            , content: event.name
            , title: event.name
            , start: start.format("YYYY-MM-DD")
            , end: end.format("YYYY-MM-DD")
            , className: event["class-name"]
            , group: event.group
            , type: event.type
        };
        events.push(data);
    });
    console.log(JSON.stringify(events));
    console.log(`);`);
    console.log(`var opt${anomaly.series.handle}${anomaly.subseries} = {};`);
    console.log(`var tml${anomaly.series.handle}${anomaly.subseries} = new vis.Timeline(ctr${anomaly.series.handle}${anomaly.subseries}, itms${anomaly.series.handle}${anomaly.subseries}, grp${anomaly.series.handle}${anomaly.subseries}, opt${anomaly.series.handle}${anomaly.subseries});`);
    console.log(`</script>`);
});
