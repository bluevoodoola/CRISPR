const fs = require('fs');
const dayjs = require('dayjs');
const anomalydata = require('./anomalies.js');
const schedule = require('./schedule.js');

var html = '';
var script = '';

anomalydata.anomalies.forEach(anomaly => {
    html += `<h2 id="h2#${anomaly.series.handle}"><a id="#${anomaly.series.handle}${anomaly.subseries}" href="#${anomaly.series.handle}${anomaly.subseries}" class="header">${anomaly.series.name} ${anomaly.subseries} Sites (${anomaly.date.format("YYYY-MMM-DD")}: ${anomaly.sites})</a></h2><div id="vis${anomaly.series.handle}${anomaly.subseries}"></div>`;
    script += `<script type="text/javascript">`;
    script += `var ctr${anomaly.series.handle}${anomaly.subseries} = document.getElementById('vis${anomaly.series.handle}${anomaly.subseries}');`
    script += `var grp${anomaly.series.handle}${anomaly.subseries} = new vis.DataSet([{ id: 'Design', content: 'Design'},{ id: 'Store', content: 'Store'},{ id: 'Production', content: 'Production'},{ id: 'Logistics', content: 'Logistics'}]);`
    script += `var itms${anomaly.series.handle}${anomaly.subseries} = new vis.DataSet(`

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
    script += JSON.stringify(events)
    script += `);`
    script += `var opt${anomaly.series.handle}${anomaly.subseries} = {};`
    script += `var tml${anomaly.series.handle}${anomaly.subseries} = new vis.Timeline(ctr${anomaly.series.handle}${anomaly.subseries}, itms${anomaly.series.handle}${anomaly.subseries}, grp${anomaly.series.handle}${anomaly.subseries}, opt${anomaly.series.handle}${anomaly.subseries});`
    script += `</script>`
});

console.log(html);
console.log(script);