var NumAllelesPlot = (function() {
    var plot;
    function init() {
        plot = $.plot("#numAllelesPlot", [[]], {
            axisLabels: {
                show: true,
            },
            xaxis: {
                axisLabel: "Generation",
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
        if (gridLength >= 100) {
            plot.setData([numAllelesOverTime.slice(gridLength - 100, gridLength)])
        }
        else {
            plot.setData([numAllelesOverTime]);
        }
        plot.setupGrid();
        plot.draw();
    }

    return {
        initPlot: init,
        update: updatePlot,
        getPlot: function() {
            return plot;
        }
    }
})();