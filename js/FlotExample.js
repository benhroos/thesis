var AllelePlot = (function() {
    var plot;
    function flotExample() {
    
        plot = $.plot("#alleleTable", [Grid.getNumAllelesOverTime()], {
            yaxis: {
                min: 0,
                max: 16,
                tickSize: 2
            }
        });
    }

    function updatePlot() {
        var gridLength = Grid.getNumAllelesOverTime().length;
        if (gridLength >= 100) {
            plot.setData([Grid.getNumAllelesOverTime().slice(gridLength - 100, gridLength)])
        }
        else {
            plot.setData([Grid.getNumAllelesOverTime()]);
        }
        plot.setupGrid();
        plot.draw();
    }

    return {
        initPlot: flotExample,
        update: updatePlot,
        getPlot: function() {
            return plot;
        }
    }
})();