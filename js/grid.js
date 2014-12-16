var Grid = function() {
	var cells = [];
	var colors = ["#fb9a99", "#1f78b4", "#a6cee3", "#33a02c", "#b2df8a", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a",
	"#ffff99", "#b15928", "#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462"];
	var mutantColors = ["#6FFF00", "#FF00FF", "#FFFF00", "#4D4DFF", "#FF4105", "#993CF3"];
	var colorsUsed = 0, mutantColorsUsed = 0;
	var stateCapture = [], numMutations = 0, simulation, mutationRate = 0;
	var uniqueCells = {}, uniqueMutations = {};
	var numAlleles;
	var numAllelesOverTime = [];
	var numIntervals = 0;
	var allele0 = [], allele1 = [], allele2 = [], allele3 = [], allele4 = [], allele5 = [], allele6 = [], allele7 = [],
		allele8 = [], allele9 = [], allele10 = [], allele11 = [], allele12 = [], allele13 = [], allele14 = [],
		allele15 = [], allele16 = [];
	var alleleFrequencies = [allele0, allele1, allele2, allele3, allele4, allele5, allele6, allele7, allele8, allele9,
		allele10, allele11, allele12, allele13, allele14, allele15, allele16];

	var getRandomColor = function() {
		var newColor = colors[colorsUsed];
		colorsUsed++;
		if (colorsUsed == 18) {
			colorsUsed = 0;
		}
		return newColor;
	};

	var getMutantColor = function() {
		var newMutantColor = mutantColors[mutantColorsUsed];
		mutantColorsUsed++;
		if (mutantColorsUsed == 6) {
			mutantColorsUsed = 0;
		}
		return newMutantColor;
	};

	var step = function(mutationRate) {
		//Random cell dies
		var cellNum = Math.floor(Math.random() * 1024);

		//Dead cell is randomly replaced by one of it's neighbors
		var numCellsPerRow = 32, neighbors = [];
		var upper, lower, left, right, upperLeft, upperRight, lowerLeft, lowerRight;
		var randomNeighborIndex, randomNeighbor;

		if (cells[cellNum].allele == -1) {
			return;
		}

		if (cellNum === 0 || cellNum === 31 || cellNum === 992 || cellNum === 1023) {
			switch(cellNum) {
				case 0:
				// console.log("Corner cell chosen: " + cellNum);
				right = 1;
				lower = 32;
				lowerRight = 33;
				neighbors = [right, lower, lowerRight];
				break;

				case 31:
				// console.log("Corner cell chosen: " + cellNum);
				left = 30;
				lower = 63;
				lowerLeft = 62;
				neighbors = [left, lower, lowerLeft];
				break;

				case 992:
				// console.log("Corner cell chosen: " + cellNum);
				upper = 960;
				upperRight = 961;
				right = 993;
				neighbors = [upper, upperRight, right];
				// alert("Gotcha");
				break;

				case 1023:
				// console.log("Corner cell chosen: " + cellNum);
				upperLeft = 990;
				upper = 991;
				left = 1022;
				neighbors = [upperLeft, upper, left];
				// alert("Gotcha??");
				break;
			}
		}
		else if (cellNum % 32 === 0) {
			// console.log("Left side cell chosen: " + cellNum);
			upper = cellNum - numCellsPerRow;
			upperRight = upper + 1;
			left = cellNum + 1;
			lower = cellNum + numCellsPerRow;
			lowerRight = lower + 1;
			neighbors = [upper, upperRight, left, lower, lowerRight];

		}
		else if (cellNum % 32 === 31) {
			// console.log("Right side cell chosen: " + cellNum);
			upper = cellNum - numCellsPerRow;
			upperLeft = upper - 1;
			left = cellNum - 1;
			lower = cellNum + numCellsPerRow;
			lowerLeft = lower - 1;
			neighbors = [upper, upperLeft, left, lower, lowerLeft];
		}
		else if (cellNum < 32) {
			// console.log("Top cell chosen: " + cellNum);
			left = cellNum - 1;
			right = cellNum + 1;
			lower = cellNum + 32;
			lowerLeft = lower - 1;
			lowerRight = lower + 1;
			neighbors = [left, right, lower, lowerLeft, lowerRight];
		}
		else if (cellNum > 991) {
			// console.log("Bottom cell chosen: " + cellNum);
			left = cellNum - 1;
			right = cellNum + 1;
			upper = cellNum - 32;
			upperLeft = upper - 1;
			upperRight = upper + 1;
			neighbors = [left, right, upper, upperLeft, upperRight];
		}
		else {
			numCellsPerRow = 32;
			upper = cellNum - numCellsPerRow;
			lower = cellNum + numCellsPerRow;
			left = cellNum - 1;
			right = cellNum + 1;
			upperLeft = upper - 1;
			upperRight = upper + 1;
			lowerLeft = lower - 1;
			lowerRight = lower + 1;
			neighbors = [upperLeft, upper, upperRight, left, right, lowerLeft, lower, lowerRight];
		}

		//New cell will mutate with probability given by mutation rate
		var rand = Math.random();
		if (rand < mutationRate) {
			numMutations++;
			cells[cellNum].allele = 1023 + numMutations;
			cells[cellNum].color = getMutantColor();
			cells[cellNum].mutationNumber = numMutations;
		}
		else {
			randomNeighborIndex = Math.floor(Math.random() * neighbors.length);
			randomNeighbor = neighbors[randomNeighborIndex];
			// make sure that it's not a dead cell
			var maxAttempts = 0;
			while (cells[randomNeighbor].allele == -1 || cells[randomNeighbor].allele == -2) {
				if (maxAttempts == 20)
					return
				randomNeighborIndex = Math.floor(Math.random() * neighbors.length);
				randomNeighbor = neighbors[randomNeighborIndex];
				maxAttempts++;
			}

			cells[cellNum].allele = cells[randomNeighbor].allele;
			cells[cellNum].color = cells[randomNeighbor].color;
			cells[cellNum].mutationNumber = cells[randomNeighbor].mutationNumber;
		}
	};

	var drawGrid = function() {
		uniqueMutations = {};
		numAlleles = 0;
		var numOccurrences;
		for (var i = 0; i < cells.length; i++) {
			cells[i].updateHTML(i);
			if (cells[i].allele !== -1) {
				uniqueCells[cells[i].allele] = true;
			}
		}
		var index = 0;
		for (var cell in uniqueCells) {
			numOccurrences = 0;
			var alleleFound = false;
			for (var i = 0; i < cells.length; i++) {
				if (cell == cells[i].allele) {
					numOccurrences++;
					alleleFound = true;
				}
			}
			if (!alleleFound) {
				uniqueCells[cells] = false;
			}
			switch (index) {
				case 0:
					alleleFrequencies[0].push([numIntervals, numOccurrences/1024]);
					break;
				case 1:
					alleleFrequencies[1].push([numIntervals, numOccurrences/1024]);
					break;
				case 2:
					alleleFrequencies[2].push([numIntervals, numOccurrences/1024]);
					break;
				case 3:
					alleleFrequencies[3].push([numIntervals, numOccurrences/1024]);
					break;
				case 4:
					alleleFrequencies[4].push([numIntervals, numOccurrences/1024]);
					break;
				case 5:
					alleleFrequencies[5].push([numIntervals, numOccurrences/1024]);
					break;
				case 6:
					alleleFrequencies[6].push([numIntervals, numOccurrences/1024]);
					break;
				case 7:
					alleleFrequencies[7].push([numIntervals, numOccurrences/1024]);
					break;
				case 8:
					alleleFrequencies[8].push([numIntervals, numOccurrences/1024]);
					break;
				case 9:
					alleleFrequencies[9].push([numIntervals, numOccurrences/1024]);
					break;
				case 10:
					alleleFrequencies[10].push([numIntervals, numOccurrences/1024]);
					break;
				case 11:
					alleleFrequencies[11].push([numIntervals, numOccurrences/1024]);
					break;
				case 12:
					alleleFrequencies[12].push([numIntervals, numOccurrences/1024]);
					break;
				case 13:
					alleleFrequencies[13].push([numIntervals, numOccurrences/1024]);
					break;
				case 14:
					alleleFrequencies[14].push([numIntervals, numOccurrences/1024]);
					break;
				case 15:
					alleleFrequencies[15].push([numIntervals, numOccurrences/1024]);
					break;
				case 16:
					alleleFrequencies[16].push([numIntervals, numOccurrences/1024]);
					break;
			}
			if (alleleFound) {
				numAlleles++;
			}
			index++;
		}
		$("#numAlleles").html("Number of alleles: " + numAlleles);
		$("#numMutations").html("Number of mutations: " + numMutations);

		numAllelesOverTime.push([numIntervals, numAlleles]);
		NumAllelesPlot.update(numAllelesOverTime);
		AlleleFrequencyPlot.update(alleleFrequencies);
	};

	var generateStatistics = function() {
		var uniqueCells = {};
		var uniqueMutations = {};
		var numAlleles = 0;
		var numActiveMutations = 0;
		for (var i = 0; i < cells.length; i++) {
			uniqueCells[cells[i].allele] = true;
			if (cells[i].allele > 1024) {
				uniqueMutations[cells[i].allele] = true;
			}
		}
		for (var i in uniqueCells) {
			numAlleles++;
		}
		for (var i in uniqueMutations) {
			numActiveMutations++;
		}
		$("#numAlleles").html("Number of alleles: " + numAlleles);
		$("#numMutations").html("Number of mutations: " + numMutations);
		$("#numActiveMutations").html("Number of mutations: " + numActiveMutations);
	};

	var handleStartButton = function() {
		$("#startStopButton").click(function() {
			if ($(this).html() === "Start Simulation") {
				$(this).html("Stop Simulation");
				mutationRate = $("#mutationRate").val();
				if (mutationRate === null || mutationRate === "") {
					alert("Please enter a mutation rate");
				}
				else if (isNaN(mutationRate)) {
					alert("Mutation rate must be numeric");
				}
				else if (mutationRate > 1 || mutationRate < 0) {
					alert("Mutation rate must be between 0 and 1");
				}
				else {
					simulation = setInterval(function() {
						runSimulation();
						drawGrid();
						numIntervals++;
						// if (numIntervals == 50) {
						// 	// alert("About to capture state");
						// 	for (var i = 0; i < cells.length; i++) {
						// 		stateCapture.push(new cell(cells[i].color, i));
						// 	}
						// }
					}, 200);
				}
			}
			else if ($(this).html() === "Stop Simulation") {
				$(this).html("Start Simulation");
				clearInterval(simulation);
				generateStatistics();
			}
		});
	};

	var handleEnterKey = function() {
		$(document).keypress(function(e) {
			if(e.which === 13) {
				if ($("#startStopButton").html() === "Start Simulation") {
					$("#startStopButton").html("Stop Simulation");
				}

				mutationRate = $("#mutationRate").val();
				if (mutationRate === null || mutationRate === "") {
					alert("Please enter a mutation rate");
				}
				else if (isNaN(mutationRate)) {
					alert("Mutation rate must be numeric");
				}
				else if (mutationRate > 1 || mutationRate < 0) {
					alert("Mutation rate must be between 0 and 1");
				}
				else {
					simulation = setInterval(function() {
						runSimulation();
						drawGrid();
						numIntervals++;
						// if (numIntervals == 50) {
						// 	for (var i = 0; i < cells.length; i++) {
						// 		stateCapture.push(new cell(cells[i].color, i));
						// 	}
						// }
					}, 200);
				}
			}
		});
	};

	var runSimulation = function() {
		for (var i = 0; i < 2000; i++) {
			step(mutationRate);
		}
	};

	// var handleRevertButton = function() {
	// 	$("#revertButton").click(function() {
	// 		for (var i = 0; i < 1024; i++) {
	// 			stateCapture[i].updateHTML(i);
	// 		}
	// 		alert("Reverted");
	// 	});
	// };

	var handleResetButton = function() {
		$("#resetButton").click(function() {
			cells = [];
			var theta = 2048*.001; // Should be 2N*mutationRate

			$("td").each(function(index) {
				if (index === 0) {
					var color = getRandomColor();
					cells.push(new cell(color, index));
				}
				else if (Math.random() < index/(index + theta)) {
					var cellNum = Math.floor(Math.random() * (index - 1));
					while (cells[cellNum].allele == -1) {
						cellNum = Math.floor(Math.random() * (index - 1));
					}
					cells.push(new cell(cells[cellNum].color, cells[cellNum].allele));
				}
				else {
					var color = getRandomColor();
					cells.push(new cell(color, index));
				}
				cells[index].updateHTML(index);
				$(this).attr("id", index);
			});
			generateStatistics();
			allele0 = [], allele1 = [], allele2 = [], allele3 = [], allele4 = [], allele5 = [], allele6 = [], allele7 = [],
				allele8 = [], allele9 = [], allele10 = [], allele11 = [], allele12 = [], allele13 = [], allele14 = [],
				allele15 = [], allele16 = [];
			alleleFrequencies = [allele0, allele1, allele2, allele3, allele4, allele5, allele6, allele7, allele8, allele9,
				allele10, allele11, allele12, allele13, allele14, allele15, allele16];
			numIntervals = 0;
			numMutations = 0;
			numAllelesOverTime = [];
			NumAllelesPlot.initPlot();
			AlleleFrequencyPlot.initPlot();
		});
	};

	var handleBarrier = function() {
		$("td").mousedown(function() {
			var cellNum = $(this).attr("id");
			if (cells[cellNum].allele !== -1) {
				cells[cellNum].color = "#000000";
				cells[cellNum].allele = -1;
				cells[cellNum].mutationNumber = -1;
				cells[cellNum].updateHTML(cellNum);
			}
			else {
				cells[cellNum].allele = -2;
				cells[cellNum].color = "#FFFFFF";
				cells[cellNum].updateHTML(cellNum);
			}
			$("td").mouseover(function() {
				var cellNum = $(this).attr("id");
				if (cells[cellNum].allele !== -1) {
					cells[cellNum].color = "#000000";
					cells[cellNum].allele = -1;
					cells[cellNum].mutationNumber = -1;
					cells[cellNum].updateHTML(cellNum);
				}
				else {
					cells[cellNum].allele = -2;
					cells[cellNum].color = "#FFFFFF";
					cells[cellNum].updateHTML(cellNum);
				}
			});
		});
		$("td").mouseup(function() {
			$("td").unbind("mouseover");
		});
	};

	var init = function() {
		var gridRowHTML = $("#grid").html();
		for (var count = 0; count < 31; count++) {
			$("#grid").append(gridRowHTML);
		}

		var theta = 2048*.001; // Should be 2N*mutationRate

		$("td").each(function(index) {
			if (index === 0) {
				var color = getRandomColor();
				cells.push(new cell(color, index));
			}
			else if (Math.random() < index/(index + theta)) {
				var cellNum = Math.floor(Math.random() * (index - 1));
				while (cells[cellNum].allele == -1) {
					cellNum = Math.floor(Math.random() * (index - 1));
				}
				cells.push(new cell(cells[cellNum].color, cells[cellNum].allele));
			}
			else {
				var color = getRandomColor();
				cells.push(new cell(color, index));
			}
			cells[index].updateHTML(index);
			$(this).attr("id", index);
		});
		handleStartButton();
		handleResetButton();
		handleEnterKey();
		handleBarrier();
		generateStatistics();
	};

	return {
		init: init,
		getCells: function() {
			return cells;
		},
		getCapture: function() {
			return stateCapture;
		},
		stats: generateStatistics,
		getUniqueAlleles: function() {
			return uniqueCells;
		},
		getAlleleFrequencies: function() {
			return alleleFrequencies;
		}
	}
}();