var express = require('express');
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var assert = require('assert');
var util = require('util');
var bodyParser = require('body-parser');
var app = express();

//Connect to MongoDB
mongoose.connect('mongodb://localhost/oruiz-week7', { useMongoClient: true });

//Check DB connection
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'DB connection error:'));
db.once('open', function() {
  console.log("Connected correctly to DB server.");
});

//Initialize sequence
autoIncrement.initialize(db);

//Define DB schema
var PokerHandSchema = mongoose.Schema({
	cards: [{ 
		rank: String,
		suit: String
	}]
});

//Define model and custom auto-increment field
PokerHandSchema.plugin(autoIncrement.plugin, { model: 'PokerHand', field: 'id' });
//Map model to the schema
var PokerHand = mongoose.model("PokerHand", PokerHandSchema);

//Initialize server
app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

//Verify server is running
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

//Create POST request to insert poker hand data
app.post("/hands", function(request, response){
	//Check if data was submitted
	if(request.body.cards == undefined){
		//Return Bad Request response with error message
		var message = { "error": 400, "message": "No data was provided" };
		response.status(400).send(message);		
	}
	//Valid data provided
	else{
		//Format the input array	
		var formattedArray = parseArrayValues(request.body.cards);

		//Create a new instance of our model with the formatted data
		var newHand = new PokerHand({ "cards": formattedArray});

		//Save the information to the DB
		newHand.save(function(err, result){
			//Check for errors
			if(err !== null){
				console.log(err);
			}
			//No errors
			else{
				//Get the next value in the sequence
		        newHand.nextCount(function(err, count) {
		        	//Subtract 1 from the count to return the ID
		        	//that was just added
		 			var currentVal = count - 1;
		 			//Send JSON response with ID value
			    	response.status(200).send({"id": currentVal});
		        });
			}
		});
	}
});

//Create GET request to search for a poker hand based on a specific ID
app.get("/hands/:handId", function(request, response){
	//Get the ID from the request 
	var searchHandId = request.params.handId;

	//Search DB for poker hand based on custom ID field
	PokerHand.findOne({"id" : searchHandId}, function(err, cards){
		//Verify query returned poker hand data
		if(cards !== null){
			//Format the output array
			var formattedArray = parseArrayValues(cards.cards);
			//Send JSON response with valid poker hand data
	    	response.status(200).send({ "id": cards.Id, "cards": formattedArray });
		}
		//No data found
		else{
			//Return Not Found response with error message
			var message = { "id": searchHandId, "error": 404, "message": "Poker Hand with ID: " + searchHandId + " was not found" };
			response.status(404).send(message);
	    }
	});
});

//Create GET request to search the cards in a poker hand based on a specific ID
app.get("/hands/:handId/cards", function(request, response){
	//Get the ID from the request 
	var searchHandId = request.params.handId;

	//Search DB for poker hand based on custom ID field
	PokerHand.findOne({"id" : searchHandId}, function(err, cards){
		//Verify query returned poker hand data
		if(cards !== null){
			//Verify poker hand has cards array data
			if(cards.cards.length == 0){
				//Return Not Found response with error message
				var message = { "id": searchHandId, "error": 404, "message": "Poker Hand with ID: " + searchHandId + " does not contain any cards." };
				response.status(404).send(message);
			}
			//Array has data
			else{
				//Format the output array
				var formattedArray = parseArrayValues(cards.cards);
				//Send JSON response with valid poker hand card data
		    	response.status(200).send({"cards": formattedArray});
		    }
		}
		//No data found
		else{
			//Return Not Found response with error message
			var message = { "id": searchHandId, "error": 404, "message": "Poker Hand with ID: " + searchHandId + " was not found" };
			response.status(404).send(message);
	    }
	});
});

//Create PUT request to update cards information in a poker hand based on a specific ID
app.put("/hands/:handId", function(request, response){
	//Get the ID from the request 
	var searchHandId = request.params.handId;

	//Search DB for poker hand based on custom ID field
	PokerHand.findOne({"id" : searchHandId}, function(err, cards){
		//Verify query returned poker hand data
		if(cards == null){
			//Return Not Found response with error message
			var message = { "id": searchHandId, "error": 404, "message": "Poker Hand with ID: " + searchHandId + " was not found" };
			response.status(404).send(message);
		}
		//Data found
		else{
			//Retrieve the card data from the request and format the output array
			var formattedArray = parseArrayValues(request.body.cards);

			//Set the cards property to the formatted array value
			cards.cards = formattedArray;

			//Save the data
			cards.save(function(err, result){
				//Check for errors
				if(err !== null){
					console.log(err);
				}
				//No errors
				else{
					//Return No Content response with message
					var message = { "message": "No Content"};
			        response.status(204).send(message);
				}
			});
		}
	});
});


function parseArrayValues(array){
	var newArray = [];

	//Loop through provided array
	for(var i = 0; i < array.length; i++){
		//JSON placeholder
		var output = {};
		//Check for rank of "Ace" or value of 1
		//Set rank to "a", lower case the suit name
		//and add output to new array
		if(array[i].rank.toLowerCase() == "ace".toLowerCase() || array[i].rank == 1){
			output["rank"] = "a";
			output["suit"] = array[i].suit.toLowerCase();
			newArray.push(output);
		}
		//Check for rank of "King" or value of 13
		//Set rank to "k", lower case the suit name
		//and add output to new array
		else if(array[i].rank.toLowerCase() == "king".toLowerCase() || array[i].rank == 13){
			output["rank"] = "k";
			output["suit"] = array[i].suit.toLowerCase();
			newArray.push(output);
		}
		//Check for rank of "Queen" or value of 12
		//Set rank to "q", lower case the suit name
		//and add output to new array
		else if(array[i].rank.toLowerCase() == "queen".toLowerCase() || array[i].rank == 12){
			output["rank"] = "q";
			output["suit"] = array[i].suit.toLowerCase();
			newArray.push(output);
		}
		//Check for rank of "King" or value of 11
		//Set rank to "j", lower case the suit name
		//and add output to new array
		else if(array[i].rank.toLowerCase() == "jack".toLowerCase() || array[i].rank == 11){
			output["rank"] = "j";
			output["suit"] = array[i].suit.toLowerCase();
			newArray.push(output);
		}
		//Check for rank of "King" or value of 10
		//Set rank to "10", lower case the suit name
		//and add output to new array
		else if(array[i].rank.toLowerCase() == "ten".toLowerCase() || array[i].rank == 10){
			output["rank"] = "10";
			output["suit"] = array[i].suit.toLowerCase();
			newArray.push(output);
		}
		//Check for rank of "King" or value of 9
		//Set rank to "9", lower case the suit name
		//and add output to new array
		else if(array[i].rank.toLowerCase() == "nine".toLowerCase() || array[i].rank == 9){
			output["rank"] = "9";
			output["suit"] = array[i].suit.toLowerCase();
			newArray.push(output);
		}
		//Check for rank of "King" or value of 8
		//Set rank to "8", lower case the suit name
		//and add output to new array
		else if(array[i].rank.toLowerCase() == "eight".toLowerCase() || array[i].rank == 8){
			output["rank"] = "8";
			output["suit"] = array[i].suit.toLowerCase();
			newArray.push(output);
		}
		//Check for rank of "King" or value of 7
		//Set rank to "7", lower case the suit name
		//and add output to new array
		else if(array[i].rank.toLowerCase() == "seven".toLowerCase() || array[i].rank == 7){
			output["rank"] = "7";
			output["suit"] = array[i].suit.toLowerCase();
			newArray.push(output);
		}
		//Check for rank of "King" or value of 6
		//Set rank to "6", lower case the suit name
		//and add output to new array
		else if(array[i].rank.toLowerCase() == "six".toLowerCase() || array[i].rank == 6){
			output["rank"] = "6";
			output["suit"] = array[i].suit.toLowerCase();
			newArray.push(output);
		}
		//Check for rank of "King" or value of 5
		//Set rank to "3", lower case the suit name
		//and add output to new array
		else if(array[i].rank.toLowerCase() == "five".toLowerCase() || array[i].rank == 5){
			output["rank"] = "5";
			output["suit"] = array[i].suit.toLowerCase();
			newArray.push(output);
		}
		//Check for rank of "King" or value of 4
		//Set rank to "4", lower case the suit name
		//and add output to new array
		else if(array[i].rank.toLowerCase() == "four".toLowerCase() || array[i].rank == 4){
			output["rank"] = "4";
			output["suit"] = array[i].suit.toLowerCase();
			newArray.push(output);
		}
		//Check for rank of "King" or value of 3
		//Set rank to "3", lower case the suit name
		//and add output to new array
		else if(array[i].rank.toLowerCase() == "three".toLowerCase() || array[i].rank == 3){
			output["rank"] = "3";
			output["suit"] = array[i].suit.toLowerCase();
			newArray.push(output);
		}
		//Check for rank of "King" or value of 2
		//Set rank to "2", lower case the suit name
		//and add output to new array
		else if(array[i].rank.toLowerCase() == "two".toLowerCase() || array[i].rank == 2){
			output["rank"] = "2";
			output["suit"] = array[i].suit.toLowerCase();
			newArray.push(output);
		}
		//Safegard for all other cases
		else{
			output["rank"] = array[i].rank.toLowerCase();
			output["suit"] = array[i].suit.toLowerCase();
			newArray.push(output);
		}
	}
	//Return new formatted array
	return newArray;
}


