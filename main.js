//Required node modules
var Basic = require("./basic.js");
var ClozeCard = require("./clozecard.js");
var inquirer = require("inquirer");
var fs = require("fs");

//Array of flashcards
var cardDeck = [];

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
			createABasic();
			break;
		case("Create a Cloze card"):
			createACloze();
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

//Creates a Basic flashcard and adds to the cardDeck
var createABasic = function(){
	inquirer.prompt([
	  {
	  	type: "input",
	  	message: "Please enter the front of the card. (The Question)",
	  	name: "front"
	  },
	  {
	  	type: "input",
	  	message: "Please enter the back of the card. (The Answer)",
	  	name: "back"
	  }
	]).then(function(result){
		var flashcard = new Basic(result.front, result.back);
		cardDeck.push(flashcard);
		mainMenu();
	});
};

//Creates a Cloze flashcard and adds to the cardDeck
var createACloze = function(){
	inquirer.prompt([
    {
    	type: "input",
    	message: "Please enter the full text of the card.",
    	name: "fullText"
    },
    {
    	type: "input",
    	message: "Please enter the cloze (deleted portion).",
    	name: "cloze"
    }
	]).then(function(result){
		var flashcard = new ClozeCard(result.fullText, result.cloze);
		cardDeck.push(flashcard);
		mainMenu();
	});
};

//Loop thru the deck, decide which type of card each flashcard is, and call the appropriate review function
var deckReview = function(iteration){
	if(iteration < cardDeck.length){
		if(cardDeck[iteration].type === "Basic"){
			reviewBasicCard(cardDeck[iteration], iteration);
		}
		else if(cardDeck[iteration].type === "ClozeCard"){
			reviewClozeCard(cardDeck[iteration], iteration);
		}
	}
	else{
		mainMenu();
	}
};

//Ask the question on the front of the card, decide if correct
var reviewBasicCard = function(card, iteration){
	i = iteration;
	inquirer.prompt([
    {
    	type: "input",
    	message: card.front,
    	name: "guess"
    }
	]).then(function(result){
		if(result.guess === card.back){
			console.log("That is correct!");
		}else{
			console.log("That is incorrect.");
		}
		console.log("The answer is " + card.back);
		i++;
		deckReview(i);
	});
};

//Request the user to fill in the blank (display partial), decide if answer is correct
var reviewClozeCard = function(card, iteration){
	i = iteration;
	inquirer.prompt([
    {
    	type: "input",
    	message: "Fill in the blank: " + card.partial,
    	name: "guess"
    }
	]).then(function(result){
		if(result.guess === card.cloze){
			console.log("That is correct!");
		}else{
			console.log("That is incorrect.");
		}
		console.log(card.fullText);
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
		fs.writeFile(result.filename, JSON.stringify(cardDeck), function(err){
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
			cardDeck = JSON.parse(data.split(","));
			console.log("Load complete!");
			mainMenu();
		});
	});
};

//Initialize with Main Menu
mainMenu();