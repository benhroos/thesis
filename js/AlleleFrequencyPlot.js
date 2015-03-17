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
        var gridLength = alleleFrequencies[0].data.length;
        var xMin, xMax, maxPan;
        if (gridLength > 100) {
            xMin = gridLength - 100;
            xMax = gridLength - 1;
            maxPan = gridLength - 1;
        }
        else {
            xMin = 0;
            xMax = 100;
            maxPan = 100;
        }

        plot = $.plot("#alleleFrequencyPlot", alleleFrequencies, {
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
                axisLabel: "Allele Frequency",
                min: 0,
                max: 1.,
                tickSize: .1,
                panRange: [0, 1]
            },
            pan: {
                interactive: true
            }
        });
    }

    return {
        initPlot: init,
        update: updatePlot,
        getPlot: function() {
            return plot;
        }
    }
})();