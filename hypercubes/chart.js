function drawChart(canvas, calculator) {
    var ChartTargetXM = Math.max(calculator.TargetXM, calculator.ActualXM);
    var HyperPct = calculator.HyperXM / ChartTargetXM;
    var CubePct = calculator.CubeXM / ChartTargetXM;

    canvas.height = ChartTargetXM / 2000;
    const chartHeight = canvas.height;
    const chartWidth = canvas.width / 4;

    var HyperHeight = chartHeight * HyperPct;
    var CubeHeight = chartHeight * CubePct;
    var padding = 10 ;
    var fontHeight = 28;
    var fontStyle = "normal normal " + fontHeight + "px Coda";

    var ctx = canvas.getContext("2d");
    
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(0, 0, chartWidth, chartHeight);
    ctx.font = fontStyle;
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText(`${ChartTargetXM} Actual XM`, chartWidth / 2, (chartHeight + fontHeight) / 2, chartWidth - padding * 2);
    ctx.fillText(`${calculator.TargetXM} Target XM`, chartWidth / 2, (chartHeight + fontHeight) / 2 + fontHeight, chartWidth - padding * 2);

    ctx.fillStyle = "#0000FF";
    ctx.fillRect(chartWidth, 0, chartWidth, HyperHeight);
    ctx.font = fontStyle;
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    if ( calculator.AL > 0 ) {
        ctx.fillText(`${calculator.HyperXM} Hypercube XM`, 1.5 * chartWidth, (HyperHeight + fontHeight) / 2, chartWidth - padding * 2);
        ctx.fillText(`${calculator.AL} Hypercubes`, 1.5 * chartWidth, (HyperHeight + fontHeight) / 2 + fontHeight, chartWidth - padding * 2);
    }

    ctx.fillStyle = "#0000DD";
    ctx.fillRect(chartWidth, HyperHeight, chartWidth, CubeHeight);
    ctx.font = fontStyle;
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    if (calculator.AddCubes > 0) {
        ctx.fillText(`${calculator.CubeXM} Cube XM`, 1.5 * chartWidth, HyperHeight + (CubeHeight + fontHeight) / 2, chartWidth - padding * 2);
        ctx.fillText(`${calculator.AddCubes} L8 Cubes`, 1.5 * chartWidth, HyperHeight + (CubeHeight + fontHeight) / 2 + fontHeight, chartWidth - padding * 2);
    }

    for (let lp = 0 ; lp < calculator.AL ; lp++) {
        ctx.fillStyle = "#0000EE";
        ctx.fillRect(2 * chartWidth, lp * HyperHeight / calculator.AL, chartWidth, HyperHeight / calculator.AL);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "black";
        ctx.strokeRect(2 * chartWidth, lp * HyperHeight / calculator.AL, chartWidth, HyperHeight / calculator.AL);
    };

    for (let lp = 0 ; lp < calculator.AddCubes ; lp++) {
        ctx.fillStyle = "#0000AA";
        ctx.fillRect(2 * chartWidth, HyperHeight + lp * CubeHeight / calculator.AddCubes, chartWidth, CubeHeight / calculator.AddCubes);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "black";
        ctx.strokeRect(2 * chartWidth, HyperHeight + lp * CubeHeight / calculator.AddCubes, chartWidth, CubeHeight / calculator.AddCubes);
    };

    for (let lp = 0 ; lp < calculator.TargetCount ; lp++) {
        if (lp < calculator.Slots){
            ctx.fillStyle = "#0000AA";
            ctx.fillRect(3 * chartWidth, lp * chartHeight / calculator.TargetCount, chartWidth, chartHeight / calculator.TargetCount);
            ctx.lineWidth = 2;
            ctx.strokeStyle = "black";
            ctx.strokeRect(3 * chartWidth, lp * chartHeight / calculator.TargetCount, chartWidth, chartHeight / calculator.TargetCount);
        }
    }

    ctx.font = fontStyle;
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText(`${calculator.Savings} Slots Freed`, 3.5 * chartWidth, calculator.Slots * chartHeight / calculator.TargetCount + (calculator.TargetCount - calculator.Slots) * chartHeight / (2 * calculator.TargetCount), chartWidth - padding * 2);
}
