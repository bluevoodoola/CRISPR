const fs = require('fs');
const dayjs = require('dayjs');
const anomalydata = require('./anomalies.js');
const schedule = require('./schedule.js');

var html = '';
var script = '';

script += `
var accordion = document.getElementById("accordion");
var h2;
var a;
var div;
`;

anomalydata.anomalies.forEach(anomaly => {
    var events = [];
    schedule.swag.forEach(event => {
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

    script += `
    h2 = document.createElement("h2");
    h2.id = "h2#${anomaly.series.handle}";
    accordion.appendChild(h2);
    a = document.createElement("a");
    a.id = "#${anomaly.series.handle}${anomaly.subseries}";
    a.href = "#${anomaly.series.handle}${anomaly.subseries}";
    a.class = "header";
    a.innerHTML = "${anomaly.series.name} ${anomaly.subseries} Sites (${anomaly.date.format("YYYY-MMM-DD")}: ${anomaly.sites})";
    h2.appendChild(a);
    div = document.createElement("div");;
    div.id = "vis${anomaly.series.handle}${anomaly.subseries}";
    accordion.appendChild(div);

    var ctr${anomaly.series.handle}${anomaly.subseries} = document.getElementById('vis${anomaly.series.handle}${anomaly.subseries}')
    var grp${anomaly.series.handle}${anomaly.subseries} = new vis.DataSet([{ id: 'Design', content: 'Design'},{ id: 'Store', content: 'Store'},{ id: 'Production', content: 'Production'},{ id: 'Logistics', content: 'Logistics'}])
    var itms${anomaly.series.handle}${anomaly.subseries} = new vis.DataSet(
        ${JSON.stringify(events)}
    );
    var opt${anomaly.series.handle}${anomaly.subseries} = {};
    var tml${anomaly.series.handle}${anomaly.subseries} = new vis.Timeline(ctr${anomaly.series.handle}${anomaly.subseries}, itms${anomaly.series.handle}${anomaly.subseries}, grp${anomaly.series.handle}${anomaly.subseries}, opt${anomaly.series.handle}${anomaly.subseries});
`
    ;

});

fs.writeFileSync("./swagtimeline.js", script);
