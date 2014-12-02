var AlleleFrequencyPlot = (function() {
    var plot;
    function init() {
        plot = $.plot("#alleleFrequencyPlot", [[]], {
            yaxis: {
                min: 0,
                max: 100,
                tickSize: 10
            }
        });
    }

    function updatePlot(alleleFrequencies) {
        // plot.setData([alleleFrequencies]);
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