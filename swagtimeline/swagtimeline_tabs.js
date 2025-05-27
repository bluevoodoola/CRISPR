function createAnomalyTimeline(tabs, anomaly) {
    var nav = document.getElementById("nav");
    nav
        .appendChild(createElement("li"))
        .appendChild(createElement("a", { attributes: { href: "#vis" + anomaly.uniqueid } , textContent: anomaly.header } ));
    tabs.appendChild(createElement("div", { attributes: { id: "vis" + anomaly.uniqueid } }));

    const tml = new vis.Timeline(
        document.getElementById("vis" + anomaly.uniqueid)
        , new vis.DataSet(anomaly.schedule_swag.events)
        , new vis.DataSet(anomaly.schedule_swag.groups)
        , { timeAxis: {scale: 'day', step: 1}, start: anomaly.schedule_swag.start.format("YYYY-MM-DD"), end: anomaly.schedule_swag.end.format("YYYY-MM-DD") }
    );
}

var tabs = document.getElementById("tabs");

ingress.anomalies.forEach(anomaly => {
    createAnomalyTimeline(
        tabs
        , anomaly
    );
});
