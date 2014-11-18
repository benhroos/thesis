var cell = function(initialColor, initialAllele) {
	this.color = initialColor;
	this.allele = initialAllele;
	this.mutationNumber = -1;

	this.updateHTML = function(cellNum) {
		$($("td")[cellNum]).css("background-color", this.color);
		if (this.mutationNumber !== -1) {
			$($("td")[cellNum]).html("+");
		}
		else {
			$($("td")[cellNum]).html("");
		}
	};
}