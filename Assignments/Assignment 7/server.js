var express = require('express');
var assert = require('assert');
var util = require('util');
var bodyParser = require('body-parser');
var app = express();
//Array to hold list of users
var userList = [];
//Array to hold all reminders
var reminderList = [];
//Counter variable for user IDs
var userIDs = 0;
//Counter variable for reminder IDs
var reminderIDs = 0;

//User object
function User(id, name, email){
	this.id = id;
	this.name = name;
	this.email = email;

	return this;
}

//Reminder object
function Reminder(id, title, desc, userID){
	this.id = id;
	this.title = title;
	this.description = desc;
	this.userID = userID;
	this.created = new Date();

	return this;
}

//Used to increment user ID count
function userIDCounter(){
	return userIDs++;
}

//Used to increment reminder ID count
function reminderIDCounter(){
	return reminderIDs++;
}

//Initialize server
app.set('port', (process.env.PORT || 5000));
// view engine setup
//app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + "/views"));
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

//Verify server is running
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


app.get("/", function(request, response){
	response.render('index', { user_list: userList });
});

app.get("/users/create", function(request, response){
	response.render('createUser');
});


app.get("/users/:userId/reminders/create", function(request, response){
	response.render('createReminder');
});


//Create POST request to insert user data
app.post("/users", function(request, response){
	//Set content type header
	response.set('Content-Type', 'application/json');
	//Check if data was submitted
	if(request.body.user == undefined){
		//Return Bad Request response with error message
		var message = { "error": 400, "message": "No data was provided" };
		response.status(400).send(message);		
	}
	//Valid data provided
	else{
		//Retrieve user object from request
		var newUser = request.body.user;
		//Retrieve ID value
		var newUserID = userIDCounter();

		//Push new User object to user array list
		userList.push(new User(newUserID, newUser.name, newUser.email));

		//Return ID number
		response.status(200).send({"id": newUserID});
	}
});

//Create DELETE request to delete a user
app.delete("/users/:userId", function(request, response){
	//Set content type header
	response.set('Content-Type', 'application/json');
	//Get the ID from the request 
	var searchUserId = request.params.userId;
	//Check if ID was submitted
	if(searchUserId == undefined){
		//Return Bad Request response with error message
		var message = { "error": 400, "message": "No data was provided" };
		response.status(400).send(message);		
	}
	//Valid data provided
	else{
		//Retrieve the index of the object from the User list
		var listIndex = findUserListIndex(searchUserId);

		//Check if User was not found
		if(listIndex == undefined){
			//Return no user data found error message
			var message = { "error": 404, "message": "User with ID: " + searchUserId + " was not found" };
			response.status(400).send(message);		
		}
		//User was found
		else{
			//Remove the User from the 
			userList.splice(listIndex,1);

			//Retrieve a list of indices containing all the reminders for the User
			var userRemindersIndex = findAllUserReminderListIndex(searchUserId);

			//Check if User had any reminders
			if(userRemindersIndex.length > 0){
				//Loop through the list of indices backwards
				//to remove the proper element based on the index
				for(var i = userRemindersIndex.length -1; i >= 0; i--){
					//Index value
					var indexValue = userRemindersIndex[i];
					//Remove Reminder object from the list based on the index provided
					reminderList.splice(indexValue, 1);
				}

				//Return No Content response with message
				//var message = { "message": "No Content"};
		        //response.status(204).send(message);
			}/*
			//User had no reminders
			else{
				//Return no reminder data found error message
				var message = { "warning": 404, "message": "No reminders for user with ID: " + searchUserId + " were found" };
				response.status(404).send(message);		
			}*/
				//Return No Content response with message
				var message = { "message": "No Content"};
		        response.status(204).send(message);

		}
	}
});

//Create GET request to retrieve individual user information
app.get("/users/:userId", function(request, response){
	//Set content type header
	//response.set('Content-Type', 'application/json');
	//Get the ID from the request 
	var searchUserId = request.params.userId;
	//Check if ID was submitted
	if(searchUserId == undefined){
		//Return Bad Request response with error message
		var message = { "error": 400, "message": "No data was provided" };
		response.status(400).send(message);		
	}
	//Valid data provided
	else{
		//Retrieve the index of the object from the User list
		var listIndex = findUserListIndex(searchUserId);
		
		//Check if User was not found
		if(listIndex == undefined){
			//Return no User data found error message
			var message = { "error": 404, "message": "User with ID: " + searchUserId + " was not found" };
			response.status(404).send(message);		
		}
		//User data found
		else{
			//Return valid response with formatted User object output
			//response.status(200).send(formatUserOutput(userList[listIndex]));

			response.render('user', { user: userList[listIndex] });
		}
	}
});

//Create POST request to insert reminder data for a specific user
app.post("/users/:userId/reminders", function(request, response){
	//Set content type header
	response.set('Content-Type', 'application/json');
	//Get the ID from the request 
	var searchUserId = request.params.userId;
	console.log(request.body.reminder);

	//Check if reminder data was submitted
	if(request.body.reminder == undefined){
		//Return Bad Request response with error message
		var message = { "error": 400, "message": "No data was provided" };
		response.status(400).send(message);		
	}
	//Valid data provided
	else{
		//Retrieve the index of the object from the User list
		var listIndex = findUserListIndex(searchUserId);
		
		//Check if User was not found
		if(listIndex == undefined){
			//Return no User data found error message
			var message = { "error": 404, "message": "User with ID: " + searchUserId + " was not found" };
			response.status(404).send(message);		
		}
		//User data found
		else{
			//Retrieve Reminder data from the request
			var newReminder = request.body.reminder;
			//Retrieve new ID for Reminder
			var newReminderID = reminderIDCounter();

			//Push new Reminder object to reminder array list
			reminderList.push(new Reminder(newReminderID, newReminder.title, newReminder.description, searchUserId));

			//Return ID number
			response.status(200).send({"id": newReminderID});
		}
	}
});

//Create GET request to retrieve all reminders for the provided user
app.get("/users/:userId/reminders", function(request, response){
	//Set content type header
	//response.set('Content-Type', 'application/json');
	//Get the ID from the request 
	var searchUserId = request.params.userId;
	//Get the search data from the query parameter
	var searchParam = request.query.title;
	//Check used to define if the user has reminder data
	var hasData = false;

	//Check if ID was submitted
	if(searchUserId == undefined){
		//Return Bad Request response with error message
		var message = { "error": 400, "message": "No data was provided" };
		response.status(400).send(message);		
	}
	//Valid data provided
	else{
		//Retrieve the index of the object from the User list
		var listIndex = findUserListIndex(searchUserId);
		
		//Check if User was not found
		if(listIndex == undefined){
			//Return no User data found error message
			var message = { "error": 404, "message": "User with ID: " + searchUserId + " was not found" };
			response.status(404).send(message);		
		}
		//User data found
		else{
			//Retrieve all the indices from the Reminder list for this User
			var userRemindersIndex = findAllUserReminderListIndex(searchUserId);

			//Check if Reminders were found
			if(userRemindersIndex.length > 0){
				//Temporary list to hold Reminders found
				var tmpList = [];

				//Loop through the list of indices found
				for(var i = 0; i < userRemindersIndex.length; i++){
					//Retrieve the index value from the list
					var indexValue = userRemindersIndex[i];

					//Check if search query parameter was not found
					if(searchParam == undefined){
						//No search provided; push all the reminders found for this user to a temp list
						//tmpList.push(formatReminderOuput(reminderList[indexValue]));
						tmpList.push(reminderList[indexValue]);
						//Data was found flag
						hasData = true;
					}
					//Search query param provided
					else if(searchParam !== ''){
						//Check if the title of the reminder matches the search query parameter provided
						if(reminderList[indexValue].title == searchParam){
							//Match found; push the reminder found to a temp list
							//tmpList.push(formatReminderOuput(reminderList[indexValue]));
							tmpList.push(reminderList[indexValue]);
							//Data was found flag
							hasData = true;
						}
					}
				}

				//Check if data was found
				if(hasData){
					//Data found; Return the new temporary list of reminders found for this User
					//response.status(200).send(tmpList);
					response.render('allReminders', { reminder_list : tmpList });
				}
				//No data found
				else{
					//Return no reminder data found for this search
					var message = { "error": 404, "message": "No reminders with title: '" + searchParam + "' for user with ID: " + searchUserId + " were found" };
					response.status(404).send(message);		
				}
			}
			//No Reminders found
			else{
				//Return no reminder data found
				var message = { "error": 404, "message": "No reminders for user with ID: " + searchUserId + " were found" };
				response.status(404).send(message);		
			}
		}
	}
});

//Create GET request to retrieve individual Reminder, based on an ID value, for the User provided
app.get("/users/:userId/reminders/:reminderId", function(request, response){
	//Set content type header
	//response.set('Content-Type', 'application/json');
	//Get the User ID from the request 
	var searchUserId = request.params.userId;
	//Get the Reminder ID from the request
	var searchReminderId = request.params.reminderId;

	//Check if data was submitted
	if(searchUserId == undefined){
		//Return Bad Request response with error message
		var message = { "error": 400, "message": "No data was provided" };
		response.status(400).send(message);		
	}
	//Valid data provided
	else{
		//Retrieve the index of the object from the User list
		var listIndex = findUserListIndex(searchUserId);

		//Check if User was not found
		if(listIndex == undefined){
			//Return no User data found error message
			var message = { "error": 404, "message": "User with ID: " + searchUserId + " was not found" };
			response.status(404).send(message);		
		}
		//User data found
		else{
			//Retrieve all the indices from the Reminder list for this User
			var userReminders = findAllUserReminderListIndex(searchUserId);

			//Check if Reminders were found
			if(userReminders.length > 0){
				//Retrieve the individual index for the requested Reminder from the list
				var itemIndex = findIndividualUserReminderListIndex(searchReminderId, searchUserId);

				//Check if a Reminder was not found
				if(itemIndex == undefined){
					//Return no Reminder data found for the provided Reminder ID error message
					var message = { "error": 404, "message": "No reminder with ID: " + searchReminderId + " was found for user with ID: " + searchUserId + "" };
					response.status(404).send(message);
				}
				//Reminder was found
				else{
					//Return formatted Reminder output
					response.status(200).send(formatReminderOuput(reminderList[itemIndex]));
					console.log(reminderList[itemIndex]);
					//response.render('reminderDetails', { reminder : reminderList[itemIndex] });					
				}
			}
			//No Reminders were found
			else{
				//Return no Reminder data found error message
				var message = { "error": 404, "message": "No reminders for user with ID: " + searchUserId + " were found" };
				response.status(404).send(message);		
			}
		}
	}
});

//Create DELETE request to delete all the Reminders for the provided User
app.delete("/users/:userId/reminders", function(request, response){
	//Set content type header
	response.set('Content-Type', 'application/json');
	//Get the User ID from the request 
	var searchUserId = request.params.userId;

	//Check if User ID was submitted
	if(searchUserId == undefined){
		//Return Bad Request response with error message
		var message = { "error": 400, "message": "No data was provided" };
		response.status(400).send(message);		
	}
	//Valid data provided
	else{
		//Retrieve the index of the object from the User list
		var listIndex = findUserListIndex(searchUserId);

		//Check if User was not found
		if(listIndex == undefined){
			//Return no User data found error message
			var message = { "error": 404, "message": "User with ID: " + searchUserId + " was not found" };
			response.status(404).send(message);		
		}
		//User data found
		else{
			//Retrieve all the indices from the Reminder list for this User
			var userRemindersIndex = findAllUserReminderListIndex(searchUserId);

			//Check if Reminders for the User were found
			if(userRemindersIndex.length > 0){
				//Loop through the list of indices backwards
				//to remove the proper element based on the index
				for(var i = userRemindersIndex.length -1; i >= 0; i--){
					//Index value
					var indexValue = userRemindersIndex[i];
					//Remove Reminder object from the list based on the index provided
					reminderList.splice(indexValue, 1);
				}

				//Return No Content response with message
				var message = { "message": "No Content"};
		        response.status(204).send(message);
			}
			//User had no Reminders
			else{
				//Return no reminder data found error message
				var message = { "error": 404, "message": "No reminders for user with ID: " + searchUserId + " were found" };
				response.status(404).send(message);		
			}
		}
	}
});

//Create DELETE request to delete a specific Reminder for the provided User
app.delete("/users/:userId/reminders/:reminderId", function(request, response){
	//Set content type header
	response.set('Content-Type', 'application/json');
	//Get the User ID from the request 
	var searchUserId = request.params.userId;
	//Get the Reminder ID from the request
	var searchReminderId = request.params.reminderId;

	//Check if data was submitted
	if(searchUserId == undefined){
		//Return Bad Request response with error message
		var message = { "error": 400, "message": "No data was provided" };
		response.status(400).send(message);		
	}
	//Valid data provided
	else{
		//Retrieve the index of the object from the User list
		var listIndex = findUserListIndex(searchUserId);

		//Check if User was not found
		if(listIndex == undefined){
			//Return no User data found error message
			var message = { "error": 404, "message": "User with ID: " + searchUserId + " was not found" };
			response.status(404).send(message);		
		}
		//User data found
		else{
			//Retrieve all the indices from the Reminder list for this User
			var userReminders = findAllUserReminderListIndex(searchUserId);

			//Check if Reminders for the User were found
			if(userReminders.length > 0){
				//Retrieve the individual index for the requested Reminder from the list
				var itemIndex = findIndividualUserReminderListIndex(searchReminderId, searchUserId);

				//Check if a Reminder was not found
				if(itemIndex == undefined){
					//Return no Reminder data found for the provided Reminder ID error message
					var message = { "error": 404, "message": "No reminder with ID: " + searchReminderId + " was found for user with ID: " + searchUserId + "" };
					response.status(404).send(message);
				}
				//Reminder found
				else{
					//Remove Reminder from the reminder list
					reminderList.splice(itemIndex, 1);

					//Return No Content response with message
					var message = { "message": "No Content"};
			        response.status(204).send(message);
				}
			}
			//No User Reminders found
			else{
				//Return no reminder data found error message
				var message = { "error": 404, "message": "No reminders for user with ID: " + searchUserId + " were found" };
				response.status(404).send(message);		
			}
		}
	}
});

//Function used to retrieve the index of the element in the user list
//based on the User ID value provided
function findUserListIndex(userID){
	//Loop through the user list
	for(var i = 0; i < userList.length; i++){
		//Check if the User ID matches the provided ID
		if(userList[i].id == userID){
			//Return this element's ID
			return i;
		}
	}
}

//Function used to retrieve a list of all the indices in the reminder list
//based on the User ID provided
function findAllUserReminderListIndex(userID){
	//Temporary list
	var userRemindersList = [];

	//Loop through the reminders list
	for(var i = 0; i < reminderList.length; i++){
		//Check if the User ID matches the provided ID
		if(reminderList[i].userID == userID){
			//Add the element's ID to the new list if match is found
			userRemindersList.push(i);
		}
	}

	//Return the list with all the element IDs found
	return userRemindersList;
}

//Function used to retrieve the index of the element in the reminder list
//based on the provided Reminder ID and User ID values
function findIndividualUserReminderListIndex(reminderID, userID){
	//Loop through the reminders list
	for(var i = 0; i < reminderList.length; i++){
		//Check if the Reminder ID and the User ID matches the provided reminder and user IDs
		if(reminderList[i].id == reminderID && reminderList[i].userID == userID){
			//Return this element's ID
			return i;
		}
	}
}

//Function used to format the output of the User JSON object with the desired values
function formatUserOutput(item){
	//Return name and email values
	return { "name" : item.name, "email" : item.email };
}

//Function used to format the output of the Reminder JSON object with the desired values
function formatReminderOuput(item){
	//Return title, description and created values
	return { "title" : item.title, "description" : item.description, "created" : item.created };
}


