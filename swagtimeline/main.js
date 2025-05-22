import fs from 'fs';
import ingress from './ingress.js';

var script = 'var accordion = document.getElementById("accordion");';

ingress.anomalies.forEach(anomaly => {
    script += `
    {
        createAnomalyTimeline(
            accordion
            , ${JSON.stringify(anomaly)}
        );
    }
`
    ;

});

fs.writeFileSync("./swagtimeline.js", script);
