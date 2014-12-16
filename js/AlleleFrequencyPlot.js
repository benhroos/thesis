var AlleleFrequencyPlot = (function() {
    var plot;
    function init() {
        plot = $.plot("#alleleFrequencyPlot", [[]], {
            axisLabels: {
                show: true,
            },
            xaxis: {
                axisLabel: "Number of Generations"
            },
            yaxis: {
                axisLabel: "Allele Frequency",
                min: 0,
                max: 1.,
                tickSize: .1
            }
        });
    }

    function updatePlot(alleleFrequencies) {
        var gridLength = alleleFrequencies[0].length;
        if (gridLength >= 100) {
            for (var i = 0; i < alleleFrequencies.length; i++) {
                alleleFrequencies[i] = alleleFrequencies[i].slice(gridLength - 100, gridLength);
            }
        }
        plot.setData(alleleFrequencies);
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