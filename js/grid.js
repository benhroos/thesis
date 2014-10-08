var Grid = function() {
	var cells = [], colors = [], stateCapture = [], numMutations = 0, simulation, mutationRate = 0;

	var getRandomColor = function() {
		var red = Math.floor(Math.random() * 256);
		var green = Math.floor(Math.random() * 256);
		var blue = Math.floor(Math.random() * 256);

		red = Math.floor((red + 255)/2);
		green = Math.floor((green + 255)/2);
		blue = Math.floor((blue + 255)/2);

		return "rgb(" + red + "," + green + "," + blue + ")";
	};

	var step = function(mutationRate) {
		//Random cell dies
		var cellNum = Math.floor(Math.random() * 1024);
		cells[cellNum].allele = -1;
		cells[cellNum].color = "rgb(255, 255, 255)";

		//Dead cell is randomly replaced by one of it's neighbors
		var numCellsPerRow = 32, neighbors = [];
		var upper, lower, left, right, upperLeft, upperRight, lowerLeft, lowerRight;
		var randomNeighborIndex, randomNeighbor;

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
				right = 992;
				neighbors = [upper, upperRight, right];
				break;

				case 1023:
				// console.log("Corner cell chosen: " + cellNum);
				upperLeft = 990;
				upper = 991;
				left = 1022;
				neighbors = [upperLeft, upper, left];
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
			cells[cellNum].color = getRandomColor();
			cells[cellNum].mutationNumber = numMutations;
		}
		else {
			randomNeighborIndex = Math.floor(Math.random() * neighbors.length);
			randomNeighbor = neighbors[randomNeighborIndex];
			cells[cellNum].allele = cells[randomNeighbor].allele;
			cells[cellNum].color = cells[randomNeighbor].color;
			cells[cellNum].mutationNumber = cells[randomNeighbor].mutationNumber;
		}
	};

	var drawGrid = function() {
		for (var i = 0; i < 1024; i++) {
			cells[i].updateHTML(i);
		}
		// $("#timer").append(".");
	};

	var handleStartButton = function() {
		var numIntervals = 0;
		$("#startSimulationButton").click(function() {
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
					if (numIntervals == 50) {
						for (var i = 0; i < cells.length; i++) {
							stateCapture.push(new cell(cells[i].color, i));
						}
						alert("Captured state");
					}
				}, 200);
			}
		});
	};

	var handleEnterKey = function() {
		$(document).keypress(function(e) {
			if(e.which === 13) {
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
						if (numIntervals == 50) {
							for (var i = 0; i < cells.length; i++) {
								stateCapture.push(new cell(cells[i].color, i));
							}
							alert("Captured state");
						}
					}, 200);
				}
			}
		});
	};

	var runSimulation = function() {
		for (var i = 0; i < 2000; i++) {
			step(mutationRate);
		}
		console.log(numMutations + " mutations occurred");
	};

	var handleStopButton = function() {
		$("#stopSimulationButton").click(function() {
			clearInterval(simulation);
		});
	};

	var handleRevertButton = function() {
		$("#revertButton").click(function() {
			for (var i = 0; i < 1024; i++) {
				stateCapture[i].updateHTML(i);
			}
			alert("Reverted");
		});
	};

	var handleResetButton = function() {
		$("#resetButton").click(function() {
			cells = [];
			colors = [];
			for (var count = 0; count < 128; count++) {
				colors.push(getRandomColor());
			}

			$("td").each(function(index) {
				var colorIndex = index % colors.length;
				$(this).css("background-color", colors[colorIndex]);
				cells.push(new cell(colors[colorIndex], index));
				$(this).html("");
			});
		});
	};

	var init = function() {
		// var gridTimer = setInterval(function(){drawGrid()}, 500);
		var gridRowHTML = $("#grid").html();
		for (var count = 0; count < 31; count++) {
			$("#grid").append(gridRowHTML);
		}

		for (var count = 0; count < 128; count++) {
			colors.push(getRandomColor());
		}

		$("td").each(function(index) {
			var colorIndex = index % colors.length;
			$(this).css("background-color", colors[colorIndex]);
			cells.push(new cell(colors[colorIndex], index));
			$(this).attr("id", index);
			// $(this).html(index);
		});
		handleStartButton();
		handleStopButton();
		handleResetButton();
		handleRevertButton();
		handleEnterKey();
		$("#mutationRate").focus();
	};

	return {
		init: init,
		getCells: function() {
			return cells;
		},
		getCapture: function() {
			return stateCapture;
		}
	}
}();