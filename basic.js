//Constructor for Basic flashcard.  Front = question; Back = answer
function Basic(front, back){
	if (!(this instanceof Basic)) { 
    return new Basic(front, back);
  }
  this.type = "Basic";
  this.front = front;
  this.back = back;
};

//Outputs Front and also returns the Front value for integrating into UI
Basic.prototype.logFront = function(){
  	console.log(this.front);
  	return this.front;
  };

//Outputs Back and also returns the Back value for integrating into UI
Basic.prototype.logBack = function(){
  	console.log(this.back);
  	return this.back;
  };

//Exports Basic constructor for use elsewhere
module.exports = Basic;