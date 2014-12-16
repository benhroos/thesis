var AlleleFrequencyPlot = (function() {
    var plot;
    function init() {
        plot = $.plot("#alleleFrequencyPlot", [[]], {
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
            // for (var i = 0; i < alleleFrequencies.length; i++) {
                // alleleFrequencies[i] = alleleFrequencies[i].slice(gridLength - 100, gridLength);
            // }
            xMin = gridLength - 100;
            xMax = gridLength - 1;
        }
        else {
            xMin = 0;
            xMax = 100;
        }

        plot = $.plot("#alleleFrequencyPlot", alleleFrequencies, {
            axisLabels: {
                show: true,
            },
            xaxis: {
                axisLabel: "Generation",
                min: xMin,
                max: xMax,
                tickSize: 10
            },
            yaxis: {
                axisLabel: "Allele Frequency",
                min: 0,
                max: 1.,
                tickSize: .1
            }
        });

        // plot.setData(alleleFrequencies);
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