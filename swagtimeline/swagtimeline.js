var accordion = document.getElementById("accordion");
ingress.anomalies.forEach(anomaly => {
    {
        createAnomalyTimeline(
            accordion
            , anomaly
        );
    }
    ;
});
