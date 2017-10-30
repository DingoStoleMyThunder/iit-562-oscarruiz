var express = require('express');
//var mongoose = require('mongoose');
//var autoIncrement = require('mongoose-auto-increment');
var assert = require('assert');
var util = require('util');
var bodyParser = require('body-parser');
var app = express();
var userList = [];
var reminderList = [];
var userIDs = 0;
var reminderIDs = 0;

function User(id, name, email){
	this.id = id;
	this.name = name;
	this.email = email;

	return this;
}

function Reminder(id, title, desc, userID){
	this.id = id;
	this.title = title;
	this.description = desc;
	this.userID = userID;
	this.created = new Date();

	return this;
}

function userIDCounter(){
	return userIDs++;
}

function reminderIDCounter(){
	return reminderIDs++;
}



//Initialize server
app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

//Verify server is running
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

//Create POST request to insert poker hand data
app.post("/users", function(request, response){
	response.set('Content-Type', 'application/json');
	//Check if data was submitted
	if(request.body.user == undefined){
		//Return Bad Request response with error message
		var message = { "error": 400, "message": "No data was provided" };
		response.status(400).send(message);		
	}
	//Valid data provided
	else{
		var newUser = request.body.user;
		var newUserID = userIDCounter();

		userList.push(new User(newUserID, newUser.name, newUser.email));


		response.status(200).send({"id": newUserID});
	}
});

app.delete("/users/:userId", function(request, response){
	response.set('Content-Type', 'application/json');
	//Get the ID from the request 
	var searchUserId = request.params.userId;
	//Check if data was submitted
	if(searchUserId == undefined){
		//Return Bad Request response with error message
		var message = { "error": 400, "message": "No data was provided" };
		response.status(400).send(message);		
	}
	//Valid data provided
	else{
		var listIndex = findUserListIndex(searchUserId);
		//console.log(tmpUser);
		if(listIndex == undefined){
			var message = { "error": 404, "message": "User with ID: " + searchUserId + " was not found" };
			response.status(400).send(message);		
		}
		else{
			userList.splice(listIndex,1);

			var userRemindersIndex = findAllUserReminderListIndex(searchUserId);

			if(userRemindersIndex.length > 0){
				//var tmpList = [];
				var counter = userRemindersIndex.length;
				for(var i = userRemindersIndex.length -1; i >= 0; i--){
					var indexValue = userRemindersIndex[i];
					//console.log("Delete: " + indexValue);
					reminderList.splice(indexValue, 1);
				}

				//Return No Content response with message
				var message = { "message": "No Content"};
		        response.status(204).send(message);
			}
			else{
				var message = { "warning": 404, "message": "No reminders for user with ID: " + searchUserId + " were found" };
				response.status(404).send(message);		
			}
		}
	}
});

app.get("/users/:userId", function(request, response){
	response.set('Content-Type', 'application/json');
	//Get the ID from the request 
	var searchUserId = request.params.userId;
	//Check if data was submitted
	if(searchUserId == undefined){
		//Return Bad Request response with error message
		var message = { "error": 400, "message": "No data was provided" };
		response.status(400).send(message);		
	}
	//Valid data provided
	else{
		var listIndex = findUserListIndex(searchUserId);
		//console.log(tmpUser);
		if(listIndex == undefined){
			var message = { "error": 404, "message": "User with ID: " + searchUserId + " was not found" };
			response.status(404).send(message);		
		}
		else{
			response.status(200).send(formatUserOutput(userList[listIndex]));
		}
	}
});

//Create POST request to insert reminder data for a specific user
app.post("/users/:userId/reminders", function(request, response){
	response.set('Content-Type', 'application/json');
	//Get the ID from the request 
	var searchUserId = request.params.userId;

	//Check if data was submitted
	if(request.body.reminder == undefined){
		//Return Bad Request response with error message
		var message = { "error": 400, "message": "No data was provided" };
		response.status(400).send(message);		
	}
	//Valid data provided
	else{
		var listIndex = findUserListIndex(searchUserId);
		//console.log(tmpUser);
		if(listIndex == undefined){
			var message = { "error": 404, "message": "User with ID: " + searchUserId + " was not found" };
			response.status(404).send(message);		
		}
		else{
			var newReminder = request.body.reminder;
			var newReminderID = reminderIDCounter();

			reminderList.push(new Reminder(newReminderID, newReminder.title, newReminder.description, searchUserId));


			response.status(200).send({"id": newReminderID});
		}
	}
});


app.get("/users/:userId/reminders", function(request, response){
	response.set('Content-Type', 'application/json');
	//Get the ID from the request 
	var searchUserId = request.params.userId;
	var searchParam = request.query.title;
	var hasData = false;

	//Check if data was submitted
	if(searchUserId == undefined){
		//Return Bad Request response with error message
		var message = { "error": 400, "message": "No data was provided" };
		response.status(400).send(message);		
	}
	//Valid data provided
	else{
		var listIndex = findUserListIndex(searchUserId);
		//console.log(tmpUser);
		if(listIndex == undefined){
			var message = { "error": 404, "message": "User with ID: " + searchUserId + " was not found" };
			response.status(404).send(message);		
		}
		else{
			var userRemindersIndex = findAllUserReminderListIndex(searchUserId);

			if(userRemindersIndex.length > 0){
				var tmpList = [];
				for(var i = 0; i < userRemindersIndex.length; i++){
					var indexValue = userRemindersIndex[i];

					if(searchParam == undefined){
						tmpList.push(formatReminderOuput(reminderList[indexValue]));
						hasData = true;
					}else if(searchParam !== ''){

						if(reminderList[indexValue].title == searchParam){
							//console.log("title match")
							tmpList.push(formatReminderOuput(reminderList[indexValue]));
							hasData = true;
						}
					}
				}

				if(hasData){
					response.status(200).send(tmpList);
				}
				else{
					var message = { "error": 404, "message": "No reminders with title: '" + searchParam + "' for user with ID: " + searchUserId + " were found" };
					response.status(404).send(message);		
				}
			}
			else{
				var message = { "error": 404, "message": "No reminders for user with ID: " + searchUserId + " were found" };
				response.status(404).send(message);		
			}
		}
	}
});

app.get("/users/:userId/reminders/:reminderId", function(request, response){
	response.set('Content-Type', 'application/json');
	//Get the ID from the request 
	var searchUserId = request.params.userId;
	var searchReminderId = request.params.reminderId;

	//Check if data was submitted
	if(searchUserId == undefined){
		//Return Bad Request response with error message
		var message = { "error": 400, "message": "No data was provided" };
		response.status(400).send(message);		
	}
	//Valid data provided
	else{
		var listIndex = findUserListIndex(searchUserId);
		//console.log(tmpUser);
		if(listIndex == undefined){
			var message = { "error": 404, "message": "User with ID: " + searchUserId + " was not found" };
			response.status(404).send(message);		
		}
		else{
			var userReminders = findAllUserReminderListIndex(searchUserId);

			if(userReminders.length > 0){
				var itemIndex = findIndividualUserReminderListIndex(searchReminderId, searchUserId);

				if(itemIndex == undefined){
					var message = { "error": 404, "message": "No reminder with ID: " + searchReminderId + " was found for user with ID: " + searchUserId + "" };
					response.status(404).send(message);
				}
				else{
					response.status(200).send(formatReminderOuput(reminderList[itemIndex]));					
				}
			}
			else{
				var message = { "error": 404, "message": "No reminders for user with ID: " + searchUserId + " were found" };
				response.status(404).send(message);		
			}
		}
	}
});

app.delete("/users/:userId/reminders", function(request, response){
	response.set('Content-Type', 'application/json');
	//Get the ID from the request 
	var searchUserId = request.params.userId;

	//Check if data was submitted
	if(searchUserId == undefined){
		//Return Bad Request response with error message
		var message = { "error": 400, "message": "No data was provided" };
		response.status(400).send(message);		
	}
	//Valid data provided
	else{
		var listIndex = findUserListIndex(searchUserId);
		//console.log(tmpUser);
		if(listIndex == undefined){
			var message = { "error": 404, "message": "User with ID: " + searchUserId + " was not found" };
			response.status(404).send(message);		
		}
		else{
			var userRemindersIndex = findAllUserReminderListIndex(searchUserId);

			if(userRemindersIndex.length > 0){
				//var tmpList = [];
				var counter = userRemindersIndex.length;
				for(var i = userRemindersIndex.length -1; i >= 0; i--){
					var indexValue = userRemindersIndex[i];
					//console.log("Delete: " + indexValue);
					reminderList.splice(indexValue, 1);
				}

				var message = { "message": "No Content"};
		        response.status(204).send(message);
			}
			else{
				var message = { "error": 404, "message": "No reminders for user with ID: " + searchUserId + " were found" };
				response.status(404).send(message);		
			}
		}
	}
});

app.delete("/users/:userId/reminders/:reminderId", function(request, response){
	response.set('Content-Type', 'application/json');
	//Get the ID from the request 
	var searchUserId = request.params.userId;
	var searchReminderId = request.params.reminderId;

	//Check if data was submitted
	if(searchUserId == undefined){
		//Return Bad Request response with error message
		var message = { "error": 400, "message": "No data was provided" };
		response.status(400).send(message);		
	}
	//Valid data provided
	else{
		var listIndex = findUserListIndex(searchUserId);
		//console.log(tmpUser);
		if(listIndex == undefined){
			var message = { "error": 404, "message": "User with ID: " + searchUserId + " was not found" };
			response.status(404).send(message);		
		}
		else{
			var userReminders = findAllUserReminderListIndex(searchUserId);

			if(userReminders.length > 0){
				var itemIndex = findIndividualUserReminderListIndex(searchReminderId, searchUserId);

				if(itemIndex == undefined){
					var message = { "error": 404, "message": "No reminder with ID: " + searchReminderId + " was found for user with ID: " + searchUserId + "" };
					response.status(404).send(message);
				}
				else{
					reminderList.splice(itemIndex, 1);
					var message = { "message": "No Content"};
			        response.status(204).send(message);
				}
			}
			else{
				var message = { "error": 404, "message": "No reminders for user with ID: " + searchUserId + " were found" };
				response.status(404).send(message);		
			}
		}
	}
});

function findUserListIndex(id){
	for(var i = 0; i < userList.length; i++){
		if(userList[i].id == id){
			//console.log(userList[i]);
			return i;
		}
	}
}

function findAllUserReminderListIndex(id){
	var userRemindersList = [];
	for(var i = 0; i < reminderList.length; i++){
		if(reminderList[i].userID == id){
			//console.log(reminderList[i]);
			userRemindersList.push(i);
		}
	}

	//console.log("Reminder IDs: " + userRemindersList + " for user: " + id);
	return userRemindersList;
}

function findIndividualUserReminderListIndex(id, userID){
	for(var i = 0; i < reminderList.length; i++){
		if(reminderList[i].id == id && reminderList[i].userID == userID){
			return i;
		}
	}
}

function formatUserOutput(item){
	return { "name" : item.name, "email" : item.email };
//	return { "user" : { "name" : item.name, "email" : item.email } };
}

function formatReminderOuput(item){
	return { "title" : item.title, "description" : item.description, "created" : item.created };
//	return { "reminder" : { "title" : item.title, "description" : item.description, "created" : item.created } };
}


