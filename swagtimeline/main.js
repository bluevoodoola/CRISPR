const fs = require('fs');
const ingress = require('./ingress.js');

var script = 'var accordion = document.getElementById("accordion");';

ingress.anomalies.forEach(anomaly => {
    script += `
    {
        createAnomaly(
            accordion
            , ${JSON.stringify(anomaly)}
        );
    }
`
    ;

});

fs.writeFileSync("./swagtimeline.js", script);
