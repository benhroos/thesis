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
	var alleleFrequencies = [];
	var numBarriers = 0;
	var isRunning = false;
	var globalNumAlleles = 0;

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
			var cellColor;
			for (var i = 0; i < cells.length; i++) {
				if (cell == cells[i].allele) {
					cellColor = cells[i].color;
					numOccurrences++;
					alleleFound = true;
				}
			}
			// if (!alleleFound) {
			// 	uniqueCells[cells] = false;
			// }
			
			// in order to have the colors in the allele frequency plot match the colors in the grid,
			// push an object instead of an array, set the color in the object, then push the
			// data set below to an array in the object instead of directly to alleleFrequencies
			if (typeof(alleleFrequencies[index]) == "undefined") {
				alleleFrequencies.push({color:cellColor, data:[]});
			}
			alleleFrequencies[index].data.push([numIntervals, numOccurrences/(1024-numBarriers)]);

			/*
			alleleFrequency = [ [[1,11],[2,21],[2,30]], [[1,11],[2,21],[2,30]] ]
			alleleFrequency = [ {color:"#ffffff", data:[[1,11],[2,21],[2,30]]}, {color:"#ffffff", data:[[1,11],[2,21],[2,30]]} ]
			*/

			// switch (index) {
			// 	case 0:
			// 		alleleFrequencies[0].push([numIntervals, numOccurrences/(1024-numBarriers)]);
			// 		break;
			// 	case 1:
			// 		alleleFrequencies[1].push([numIntervals, numOccurrences/(1024-numBarriers)]);
			// 		break;
			// 	case 2:
			// 		alleleFrequencies[2].push([numIntervals, numOccurrences/(1024-numBarriers)]);
			// 		break;
			// 	case 3:
			// 		alleleFrequencies[3].push([numIntervals, numOccurrences/(1024-numBarriers)]);
			// 		break;
			// 	case 4:
			// 		alleleFrequencies[4].push([numIntervals, numOccurrences/(1024-numBarriers)]);
			// 		break;
			// 	case 5:
			// 		alleleFrequencies[5].push([numIntervals, numOccurrences/(1024-numBarriers)]);
			// 		break;
			// 	case 6:
			// 		alleleFrequencies[6].push([numIntervals, numOccurrences/(1024-numBarriers)]);
			// 		break;
			// 	case 7:
			// 		alleleFrequencies[7].push([numIntervals, numOccurrences/(1024-numBarriers)]);
			// 		break;
			// 	case 8:
			// 		alleleFrequencies[8].push([numIntervals, numOccurrences/(1024-numBarriers)]);
			// 		break;
			// 	case 9:
			// 		alleleFrequencies[9].push([numIntervals, numOccurrences/(1024-numBarriers)]);
			// 		break;
			// 	case 10:
			// 		alleleFrequencies[10].push([numIntervals, numOccurrences/(1024-numBarriers)]);
			// 		break;
			// 	case 11:
			// 		alleleFrequencies[11].push([numIntervals, numOccurrences/(1024-numBarriers)]);
			// 		break;
			// 	case 12:
			// 		alleleFrequencies[12].push([numIntervals, numOccurrences/(1024-numBarriers)]);
			// 		break;
			// 	case 13:
			// 		alleleFrequencies[13].push([numIntervals, numOccurrences/(1024-numBarriers)]);
			// 		break;
			// 	case 14:
			// 		alleleFrequencies[14].push([numIntervals, numOccurrences/(1024-numBarriers)]);
			// 		break;
			// 	case 15:
			// 		alleleFrequencies[15].push([numIntervals, numOccurrences/(1024-numBarriers)]);
			// 		break;
			// 	case 16:
			// 		alleleFrequencies[16].push([numIntervals, numOccurrences/(1024-numBarriers)]);
			// 		break;
			// }
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
		globalNumAlleles = numAlleles;
		$("#numAlleles").html("Number of alleles: " + numAlleles);
		$("#numMutations").html("Number of mutations: " + numMutations);
		$("#numActiveMutations").html("Number of mutations: " + numActiveMutations);
	};

	var handleStartButton = function() {
		$("#startStopButton").click(function() {
			if ($(this).html() === "Start") {
				$("#exportButton").addClass("disabled");
				$(this).html("Pause");

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
						isRunning = true;
						// if (numIntervals == 50) {
						// 	// alert("About to capture state");
						// 	for (var i = 0; i < cells.length; i++) {
						// 		stateCapture.push(new cell(cells[i].color, i));
						// 	}
						// }
					}, 200);
				}
			}
			else if ($(this).html() === "Pause") {
				$("#exportButton").removeClass("disabled");
				$(this).html("Start");
				createExportLink();

				clearInterval(simulation);
				isRunning = false;
				generateStatistics();
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
			alleleFrequencies = [];
			numIntervals = 0;
			numMutations = 0;
			numBarriers = 0;
			numAllelesOverTime = [];
			NumAllelesPlot.initPlot();
			AlleleFrequencyPlot.initPlot();
			createExportLink();
		});
	};

	var createExportLink = function() {
		$("#exportButton").unbind("click");
		$("#exportButton").click(function() {
			var returnObj = {
				cells: cells,
				numAlleles: globalNumAlleles,
				numMutations: numMutations
			};
			var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(returnObj));
			window.open("data: " + data);
		});
		//$("#exportButton").html("<a id='exportLink' href='data:" + data + "' download='data.json'>Export Grid</a>");
	};

	var handleExportButton = function() {
		$("#exportButton").click(function() {
			
		});
	};

	var handleBarrier = function() {
		$(".show-cell").mousedown(function() {
			if (!event.shiftKey) {
				var cellNum = $(this).attr("id");
				if (cells[cellNum].allele !== -1) {
					cells[cellNum].color = "#000000";
					cells[cellNum].allele = -1;
					cells[cellNum].mutationNumber = -1;
					cells[cellNum].updateHTML(cellNum);
					numBarriers++;
				}
				else {
					cells[cellNum].allele = -2;
					cells[cellNum].color = "#FFFFFF";
					cells[cellNum].updateHTML(cellNum);
					numBarriers--;
				}
				$(".show-cell").mouseover(function() {
					if (!event.shiftKey) {
						var cellNum = $(this).attr("id");
						if (cells[cellNum].allele !== -1) {
							cells[cellNum].color = "#000000";
							cells[cellNum].allele = -1;
							cells[cellNum].mutationNumber = -1;
							cells[cellNum].updateHTML(cellNum);
							numBarriers++;
						}
						else {
							cells[cellNum].allele = -2;
							cells[cellNum].color = "#FFFFFF";
							cells[cellNum].updateHTML(cellNum);
							numBarriers--;
						}
					}
				});
			}
		});
		$(".show-cell").mouseup(function() {
			$(".show-cell").unbind("mouseover");
			createExportLink();
		});
	};

	var handleBarrierTemplate = function() {
		$("#barrierTemplateButton").click(function() {
			for (var i = 0; i < 1024; i++) {
				if (barrierGrid.cells[i].allele == -1) {
					cells[i].allele = -1;
					cells[i].color = "#000000";
					cells[i].mutationNumber = -1;
					cells[i].updateHTML(i);
					numBarriers++;
				}
			}
		});
	};

	var handleForcedMutation = function() {
		$(".show-cell").mousedown(function(event) {
			if (event.shiftKey) {
				event.preventDefault();
				var cellNum = $(this).attr("id");

				numMutations++;
				var newAllele = 1023 + numMutations;
				var newMutantColor = getMutantColor();
				cells[cellNum].allele = newAllele;
				cells[cellNum].color = newMutantColor;
				cells[cellNum].mutationNumber = numMutations;
				cells[cellNum].updateHTML(cellNum);
				
				$(".show-cell").mouseover(function(event) {
					if (event.shiftKey) {
						var cellNum = $(this).attr("id");

						cells[cellNum].allele = newAllele;
						cells[cellNum].color = newMutantColor;
						cells[cellNum].mutationNumber = numMutations;
						cells[cellNum].updateHTML(cellNum);
					}
				});
			}
		});
		$(".show-cell").mouseup(function() {
			$(".show-cell").unbind("mouseover");
			createExportLink();
		});
	};

	var handleHelpButton = function() {
		$("#helpButton").click(function() {
			window.open("https://github.com/benhroos/thesis/blob/master/README.md");
		});
	};

	var init = function() {
		var gridRowHTML = $("#grid").html();
		for (var count = 0; count < 31; count++) {
			$("#grid").append(gridRowHTML);
		}

		var theta = 2048*.001; // Should be 2N*mutationRate

		$(".show-cell").each(function(index) {
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
		createExportLink();
		handleExportButton();
		handleStartButton();
		handleResetButton();
		handleBarrier();
		handleBarrierTemplate();
		handleForcedMutation();
		handleHelpButton();
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