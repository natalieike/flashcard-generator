var Basic = require("./basic.js");
var ClozeCard = require("./clozecard.js");
var inquirer = require("inquirer");

function Deck(){
	if (!(this instanceof Deck)){
		return new Deck();
	}

	this.cardArray = [];
	};

//Creates a Basic flashcard and adds to the cardDeck
Deck.prototype.addNewCard = function(type, front, back){
	if(type === "Basic"){
		var flashcard = new Basic(front, back);
	}else if(type === "ClozeCard"){
		var flashcard = new ClozeCard(front, back);
	}
	else{
		console.log("You can only enter Basic or Clozed cards.")
		return;
	}
	this.cardArray.push(flashcard);
};

module.exports = Deck;