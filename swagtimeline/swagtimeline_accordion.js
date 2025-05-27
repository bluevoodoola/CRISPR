function createAnomalyTimeline(accordion, anomaly) {
    accordion
        .appendChild(createElement("h2", { attributes: { id: "h2#" + anomaly.series.handle } }))
        .appendChild(createElement("a", { attributes: { id: "#" + anomaly.uniqueid, href: "#" + anomaly.uniqueid }, classes: [ "header" ], textContent: anomaly.header }));
    accordion.appendChild(createElement("div", { attributes: { id: "vis" + anomaly.uniqueid } }));

    const tml = new vis.Timeline(
        document.getElementById("vis" + anomaly.uniqueid)
        , new vis.DataSet(anomaly.schedule_swag.events)
        , new vis.DataSet(anomaly.schedule_swag.groups)
        , { timeAxis: {scale: 'day', step: 1}, start: anomaly.schedule_swag.start.format("YYYY-MM-DD"), end: anomaly.schedule_swag.end.format("YYYY-MM-DD") }
    );
}

var accordion = document.getElementById("accordion");

ingress.anomalies.forEach(anomaly => {
    createAnomalyTimeline(
        accordion
        , anomaly
    );
});
