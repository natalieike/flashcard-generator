//Required node modules
var Basic = require("./basic.js");
var ClozeCard = require("./clozecard.js");
var Deck = require("./deck.js");
var inquirer = require("inquirer");
var fs = require("fs");

//Array of flashcards
var cardDeck = new Deck();

//Shows the main menu and accepts user choice
var mainMenu = function(){
	inquirer.prompt([
	  {
	  	type: "rawlist",
	  	message: "Please select an option",
	  	choices:["Create a Basic card", "Create a Cloze card", "Review My Deck", "Load a Deck from a File", "Save Current Deck to a File", "Exit"],
	  	name: "menuChoice"
	  }
	]).then(processMainMenu);
};

//Processes main menu choice
var processMainMenu = function(result){
	switch(result.menuChoice){
		case ("Create a Basic card"):
			createACard("Basic");
			break;
		case("Create a Cloze card"):
			createACard("ClozeCard");
			break;
		case("Review My Deck"):
			deckReview(0);
			break;
		case("Load a Deck from a File"):
			loadDeck();
			break;
		case("Save Current Deck to a File"):
			saveDeck();
			break;
		case("Exit"):
			return;
			break;
		default:
			console.log("Please try again");
			mainMenu();
			break;
	}
};

//Creates a new flashcard and adds to the cardDeck array
var createACard = function(type){
	cardType = type;
	var question = "";
	var answer = "";
	switch(type){
		case ("Basic"):
			question = "Please enter the front of the card. (The Question)";
			answer = "Please enter the back of the card. (The Answer)";
			break;
		case ("ClozeCard"):
			question = "Please enter the full text of the card.";
			answer = "Please enter the cloze (deleted portion)."
	}
	inquirer.prompt([
	  {
	  	type: "input",
	  	message: question,
	  	name: "front"
	  },
	  {
	  	type: "input",
	  	message: answer,
	  	name: "back"
	  }
	]).then(function(result){
		cardDeck.addNewCard(cardType, result.front, result.back);
		mainMenu();
	});
};


//Loop thru the deck, decide which type of card each flashcard is, and call the appropriate review function
var deckReview = function(iteration){
	if(cardDeck.cardArray.length <= 0){
		console.log("You need to enter at least 1 flashcard first.");
		mainMenu();
	}
	else if(iteration < cardDeck.cardArray.length){
		reviewCard(cardDeck.cardArray[iteration], iteration);
	}
	else{
		mainMenu();
	}
};

//Ask the question on the front of the card, decide if correct
var reviewCard = function(card, iteration){
	i = iteration;
	type = card.type;
	var question = "";
	var answer = "";
	switch(type){
		case("Basic"):
			question = card.front;
			answer = card.back;
			callback = "The answer is " + card.back;
			break;
		case("ClozeCard"):
			question = "Fill in the blank: " + card.partial;
			answer = card.cloze;
			callback = card.fullText;
			break;
	}
	inquirer.prompt([
    {
    	type: "input",
    	message: question,
    	name: "guess"
    }
	]).then(function(result){
		if(result.guess === answer){
			console.log("That is correct!");
		}else{
			console.log("That is incorrect.");
		}
		console.log(callback);
		i++;
		deckReview(i);
	});
};

//Save the current flashcard deck to a file
var saveDeck = function(){
	inquirer.prompt([
    {
    	type: "input",
    	message: "Please enter a filename.",
    	name: "filename"
    }
	]).then(function(result){
		fs.writeFile(result.filename, JSON.stringify(cardDeck.cardArray), function(err){
			if(err){
				console.log(err);
				return;
			}
			console.log("Save complete!");
			mainMenu();
		});
	});
};

//Load a saved deck from file
var loadDeck = function(){
	inquirer.prompt([
    {
    	type: "input",
    	message: "Please enter the filename of the flashcard deck you would like to load.",
    	name: "filename"
    }
	]).then(function(result){
		fs.readFile(result.filename, "utf8", function(err, data){
			if(err){
				console.log(err);
				return;
			}
			cardDeck.cardArray = JSON.parse(data.split(","));
			console.log("Load complete!");
			mainMenu();
		});
	});
};

//Initialize with Main Menu
mainMenu();