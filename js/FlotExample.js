var AllelePlot = (function() {
    var plot;
    function flotExample() {
        // var numAlleles = [[0, 4], [10, 3], [5, 6], [11, 17], [6, 1], [19, 2]];
    
        // plot = $.plot("#alleleTable", [Grid.getNumAllelesOverTime()], {
        //     xaxis: {
        //         min: 0,
        //         max: 100,
        //         tickSize: 10
        //     },
        //     yaxis: {
        //         min: 0,
        //         max: 20,
        //         tickSize: 2
        //     }
        // });
    }

    function updatePlot() {
        // plot.setData([Grid.getNumAllelesOverTime()]);
        // plot.setupGrid();
        // plot.draw();
    }

    return {
        initPlot: flotExample,
        update: updatePlot,
        getPlot: function() {
            return plot;
        }
    }
})();