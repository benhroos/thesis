var cell = function(initialColor, initialAllele) {
	this.color = initialColor;
	this.allele = initialAllele;
	this.mutationNumber = -1;

	this.updateHTML = function(cellNum) {
		$($(".show-cell")[cellNum]).css("background-color", this.color);
		if (this.mutationNumber !== -1) {
			$($(".show-cell")[cellNum]).html("");
		}
		else {
			$($(".show-cell")[cellNum]).html("");
		}
	};
}