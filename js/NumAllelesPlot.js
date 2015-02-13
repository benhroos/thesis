var NumAllelesPlot = (function() {
    var plot;
    function init() {
        plot = $.plot("#numAllelesPlot", [[]], {
            axisLabels: {
                show: true,
            },
            xaxis: {
                axisLabel: "Generation",
                min: 0,
                max: 100,
                tickSize: 10
            },
            yaxis: {
                axisLabel: "Alleles",
                min: 0,
                max: 16,
                tickSize: 2
            }
        });
    }

    function updatePlot(numAllelesOverTime) {
        var gridLength = numAllelesOverTime.length;
        var xMin, xMax, maxPan;
        if (gridLength >= 100) {
            // plot.setData([numAllelesOverTime.slice(gridLength - 100, gridLength)])
            xMin = gridLength - 100;
            xMax = gridLength - 1;
            maxPan = gridLength - 1;
        }
        else {
            // plot.setData([numAllelesOverTime]);
            xMin = 0;
            xMax = 100;
            maxPan = 100;
        }

        plot = $.plot("#numAllelesPlot", [numAllelesOverTime], {
            axisLabels: {
                show: true,
            },
            xaxis: {
                axisLabel: "Generation",
                min: xMin,
                max: xMax,
                tickSize: 10,
                panRange: [0, maxPan]
            },
            yaxis: {
                axisLabel: "Alleles",
                min: 0,
                max: 16,
                tickSize: 2,
                panRange: [0, 16]
            },
            pan: {
                interactive: true
            }
        });

        // plot.setupGrid();
        // plot.draw();
    }

    return {
        initPlot: init,
        update: updatePlot,
        getPlot: function() {
            return plot;
        }
    }
})();