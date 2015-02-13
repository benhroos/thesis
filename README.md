# Ben Roos Thesis Help Page

A Github repository for my Honors Thesis – a genetic simulation programmed and designed with JavaScript, HTML, CSS, jQuery, and Bootstrap

## About the simulation
This simulation is designed to demonstrate gene flow in a finite population. Each cell in the grid represents an individual in the population, and its color represents a unique allele. As the simulations runs, you can obverse the allele frequencies in the population shifting as the colors of individual cells change over time.

## Running the simulation
#### Controls
+ To begin the simulation, press "Start"
+ The stop the simulation, press "Pause"
+ To randomly generate a new initial population and begin the simulation again, press "Reset"
+ To adjust the mutation rate used by the simulation, edit the text field to the left of "Start"
+ To generate a JSON representation of the population at a given point, press "Export" while the simulation is paused. To see a description of the JSON format, see "JSON format" below.
+ To create a barrier on the grid, simply click on the cell in which you want to barrier to appear
+ To remove a barrier, simply click on the cell again. To learn more about barriers, see "Barriers" below
+ To apply a barrier template to the entire grid, press "Template." To learn more about creating your own templates, see "Barriers" below
+ To force a mutation to occur on a cell, click on the cell while holding the SHIFT key. To learn more about mutations, see "Mutations" below

#### Barriers
+ In this simulation, barriers represent physical landmarks on which individual can't live. Cells that are marked as barriers will not be copied into neighboring cells, and neighboring cells cannot be copied onto barriers. Therefore, constructing a line of barriers would create a physical line across which cells cannot be copied. Barriers may then be used to force speciation to occur by isolating sub-populations
+ You can create a barrier by clicking on any cell
+ You can click and drag to create a barrier in many cells
+ To create your own template of barriers, perform the following steps locally
	* On the grid, create a pattern of barriers that you would like to store in a template
	* Export the JSON representation the grid by clicking "Export"
	* Download the JSON file, and name it BarrierTemplate.js
	* In BarrierTemplate.js, write "var barrierGrid = " followed by the JSON object
	* In your local copy of the source code, replace the original coyp of BarrierTemplate.js with your own copy
	* Now, when you launch the simulation again, press "Template" and you should see your template applied

#### Mutations
+ You can adjust the mutation rate used by simulation by editing the text field to the left of "Start"
+ The mutation rate should be realistically low. If the mutation rate is too high, you will see many colors on the grid being repeated for distinct alleles
+ Bright neon colors are reserved for cells with mutant alleles
+ You can force a mutation to occur on a cell by clicking on the cell while holding the SHIFT key. If you click and drag, you can force the same mutation to occur in many cells

#### JSON
The JSON format of the grid is as follows:
{ cells: [ {color: "", allele: "", mutationNumber: ""}, {...}, ... ] }
+ The value for color is a CSS hex value
+ The value for allele is the unique allele number. If the cell is a barrier, the allele is -1. If it is empty, the allele is -2.
+ The value for mutationNumber is -1 for all non-mutant alleles. For mutant alleles, it is a count of the number of mutations that had occured at the time of the first occurrence of that allele