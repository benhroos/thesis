var NumAllelesPlot = (function() {
    var plot;
    function init() {
        plot = $.plot("#numAllelesPlot", [[]], {
            yaxis: {
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