$(document).ready(function() {
    flotExample();
});

function flotExample() {
    var numAlleles = [];
    var numMutations = [];
    var avgAlleles = [];

    var i;
    for (i = 0; i < 100; i++) {
        numAlleles.push([i, i]);
    }
    for (i = 100; i < 200; i++) {
        numMutations.push([i, i]);
    }
    for (i = 200; i < 300; i++) {
        avgAlleles.push([i, i]);
    }

    $.plot(
    $("#placeholder"), [{
        label: 'Number of alleles',
        data: numAlleles,
        lines: {
            show: true
        }
    }, {
        label: 'Number of mutations',
        data: numMutations,
        lines: {
            show: true
        }
    }, {
        label: 'Average number of alleles',
        data: avgAlleles,
        lines: {
            show: true
        } 
    }],
        {
            xaxis: {
                min: 0,
                max: 300,
                tickSize: 50
            },
            yaxis: {
                min: 0,
                max: 300,
                tickSize: 100
            }
        }
    );
}