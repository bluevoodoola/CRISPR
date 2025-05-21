const fs = require('fs');
const dayjs = require('dayjs');
const anomalydata = require('./anomalies.js');
const schedule_swag = require('./schedule-swag.js');

var script = 'var accordion = document.getElementById("accordion");';

anomalydata.anomalies.forEach(anomaly => {
    script += `
    {
        createAnomaly(accordion, "${anomaly.series.handle}", "${anomaly.uniqueid}", "${anomaly.header}", ${JSON.stringify(anomaly.events(schedule_swag.events))}, ${JSON.stringify(schedule_swag.groups)});
    }
`
    ;

});

fs.writeFileSync("./swagtimeline.js", script);
