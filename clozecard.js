//Constructor for ClozeCard flashcard.  FullText = full text of card; Cloze = deleted part; Partial = text without Cloze
function ClozeCard(fulltext, cloze){
	if (!(this instanceof ClozeCard)) { 
    return new ClozeCard(fulltext, cloze);
  }

	if(fulltext.indexOf(cloze) === -1){
		console.log("The Cloze isn't found in the Full Text.  Please try again, or use a Basic card.")
		return;
	}
	this.type = "ClozeCard";
  this.fullText = fulltext;
  this.cloze = cloze;
  this.partial = getPartial(fulltext, cloze);
};

var getPartial = function(fulltext, cloze){
	var indexFront = fulltext.indexOf(cloze);
	var indexBack = indexFront + cloze.length;
	var partial = "";
	if(indexFront === 0){
		partial = "..." + fulltext.slice(indexBack + 1);
	}
	else if(indexBack === fulltext.length - 1){
		partial = fulltext.slice(0, indexFront -1) + "...";
	}
	else{
		partial = fulltext.slice(0, indexFront -1 ) + "..." + fulltext.slice(indexBack + 1);
	}
	return partial;
};

//Outputs the partial text and also returns the value for integrating into UI
ClozeCard.prototype.logPartial = function(){
  	console.log(this.partial);
  	return this.partial;
  };

//Outputs the cloze text and also returns the value for integrating into UI
ClozeCard.prototype.logCloze = function(){
  	console.log(this.cloze);
  	return this.cloze;
  };

//Outputs the full text and also returns the value for integrating into UI
ClozeCard.prototype.logFullText = function(){
  	console.log(this.fullText);
  	return this.fullText;
};

//Exports ClozeCard constructor for use elsewhere
module.exports = ClozeCard;