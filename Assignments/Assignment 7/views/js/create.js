$(function() {
    //AJAX POST call to create a user
    $('#create-user').on('submit', function(event) {
		//Stop form from submitting normally
        event.preventDefault();

        //Retrieve form information
		var $form = $( this ),
			userName = $form.find( "input[name='create-user-name']" ).val(),
			userEmail = $form.find( "input[name='create-user-email']" ).val();

        //Retrieve current URL path
        var urlPath = $(location).attr("pathname");

        //Generate JSON User object
		var JSONObj = { "name": userName, "email": userEmail } ;

        //AJAX call to create a user
        $.ajax({
            url: '/users',
            method: 'POST',
            contentType: 'application/json',
	  		dataType: 'json',
            data: JSON.stringify({ user: JSONObj }),
            success: function(response) {
                //Output success alert and fade after 4 seconds
                $('#userSuccess').text("Successfully created a user!");
                $('#userSuccess').show();
        		$('#userSuccess').delay(4000).fadeOut();

                //If on display all users page, disable the submit button
                //after creating a new users and reload page after 4 seconds
        		if(urlPath == "/users"){
        			$('#create-user-submit-btn').attr("disabled", "disabled");
        			setTimeout(function(){ location.reload(); }, 4000);
        		}
                //Otherwise, re-enable submit button
                else{
                    $('#create-user-submit-btn').attr("disabled", "disabled");
                    setTimeout(function(){ $('#create-user-submit-btn').removeAttr("disabled"); }, 4200);
                }
            },
            //Display error messages
            error: function(response) {
                $('#userFailure').text("ERROR: " + response.responseJSON.message);
                $('#userFailure').show();
        		$('#userFailure').delay(10000).fadeOut();
            }
        });
    });


    //AJAX POST call to create a reminder
    $('#create-reminder').on('submit', function(event) {
		//Stop form from submitting normally
        event.preventDefault();

        //Retrieve form information
		var $form = $( this ),
			userName = $form.find( "input[name='title']" ).val(),
			userEmail = $form.find( "input[name='description']" ).val(),
            userId = $('#create-reminder-link').attr('data-user-id');

        //Generate JSON Reminder object
		var JSONObj = { "title": userName, "description": userEmail } ;

        //AJAX call to create a reminder
        $.ajax({
            url: '/users/' + userId + '/reminders',
            method: 'POST',
            contentType: 'application/json',
	  		dataType: 'json',
            data: JSON.stringify({ reminder: JSONObj }),
            success: function(response) {
                //Output success message and disable the submit button
                $('#reminderSuccess').text("Successfully created a reminder");
                $('#reminderSuccess').show();
        		$('#reminderSuccess').delay(4000).fadeOut();
    			$('#create-reminder-submit-btn').attr("disabled", "disabled");

                //Re-enable the submit button after 4.5 seconds
    			setTimeout(function(){ $('#create-reminder-submit-btn').removeAttr("disabled"); }, 4500);
            },
            //Display error messages
            error: function(response) {
                $('#reminderFailure').text("ERROR: " + response.responseJSON.message);
                $('#reminderFailure').show();
        		$('#reminderFailure').delay(10000).fadeOut();
            }
        });
    });

	//Check for click event on the view reminder link
	$('.get-reminder-link').click(function(){
        //Retrieve the Reminder ID
		var formNumber = $(this).attr('data-reminder-view-id');
        //Submit the form for the particular reminder
		$('#view-reminder-form-' + formNumber).submit();
	});

    //Check for submit event on the view reminder form
    $('.view-reminder-form').on('submit', function(event) {
		//Stop form from submitting normally
        event.preventDefault();
		var data = $(this).serialize(); 

        //Retrieve form information and User ID
		var $form = $( this ),
			reminderId = $form.find( "input[name='reminder-id']" ).val(),
            userId = $('#get-reminder-link-' + reminderId).attr('data-reminder-view-user-id');

        //AJAX call to retrieve individual reminder information
        $.ajax({
            url: '/users/' + userId + '/reminders/' + reminderId,
            method: 'GET',
            contentType: 'application/json',
            data: data,
	  		dataType: 'json',
            success: function(response) {
                //Display reminder information
                $('#reminder-title').text(response.title);
                $('#reminder-description').text(response.description);
        		$('#reminder-created').text("Created on: " + response.created);
            },
            //Display error messages
            error: function(response) {
                $('#reminder-description').text('');
                $('#reminder-title').text("ERROR");
                $('#reminder-description').text(response.responseJSON.message);
                $('#reminder-created').text('');
            }
        });
    });

	//Check for click event on the delete reminder link
	$('.delete-reminder-link').click(function(){
        //Retrieve the Reminder ID
		var formNumber = $(this).attr('data-reminder-delete-id');
        //Submit the form for the particular reminder
		$('#delete-reminder-form-' + formNumber).submit();
	});

    //Check for submit event on the delete reminder form
    $('.delete-reminder-form').on('submit', function(event) {
		//Stop form from submitting normally
        event.preventDefault();

        //Retrieve form information and the User ID
		var $form = $( this ),
			reminderId = $form.find( "input[name='reminder-id']" ).val(),
            userId = $('#delete-reminder-link-' + reminderId).attr('data-reminder-delete-user-id');

        //AJAX call to delete an individual reminder
        $.ajax({
            url: '/users/' + userId + '/reminders/' + reminderId,
            method: 'DELETE',
            contentType: 'application/json',
	  		dataType: 'json',
            success: function(response) {
                //Display success message
                $('#reminder-title').text("Success!");
                $('#reminder-description').text("Successfully deleted a reminder");
        		setTimeout(function(){ location.reload(); }, 2000);
            },
            //Display error messages
            error: function(response) {
                $('#reminder-title').text("ERROR");
                $('#reminder-description').text(response.responseJSON.message);
            }
        });
    });


    //Check for click event on the delete all reminders button
	$('#delete-all-reminders-button').click(function(){
		//Submit the form to delete all reminders
		$('#delete-all-reminders').submit();
	});

    //Check for submit even on the delete all reminders form
    $('#delete-all-reminders').on('submit', function(event) {
		//Stop form from submitting normally
        event.preventDefault();

        //Retrieve form information and the User ID
		var $form = $( this ),
			reminderId = $form.find( "input[name='reminder-id']" ).val(),
            userId = $('#delete-all-reminders-button').attr('data-user-id');

        //AJAX call to delete all reminders for a user
        $.ajax({
            url: '/users/' + userId + '/reminders',
            method: 'DELETE',
            contentType: 'application/json',
	  		dataType: 'json',
            success: function(response) {
                //Display success message
                $('#reminder-title').text("Success!");
                $('#reminder-description').text("Successfully deleted all reminders");
            },
            //Display error messages
            error: function(response) {
                $('#reminder-title').text("ERROR!");
                $('#reminder-description').text(response.responseJSON.message);
            }
        });
    });



	//Check for click event on the delete user link
	$('.delete-user-link').click(function(){
        //Retrieve the User ID field
		var formNumber = $(this).attr('data-user-delete-id');
        //Submit the form to delete a user
		$('#delete-user-form-' + formNumber).submit();
	});

    //Check for submit event on the delete user form
    $('.delete-user-form').on('submit', function(event) {
		//Stop form from submitting normally
        event.preventDefault(); 

        //Retrieve form information
		var $form = $( this ),
			reminderId = $form.find( "input[name='user-id']" ).val();

        //AJAX call to delete a particular user
        $.ajax({
            url: '/users/' + reminderId,
            method: 'DELETE',
            contentType: 'application/json',
	  		dataType: 'json',
            success: function(response) {
            	//Display success message and reload page
                $('#user-name-display').text("Success!");
                $('#user-email-display').text("Successfully deleted a user");
        		setTimeout(function(){ location.reload(); }, 3000);
            },
            //Display error messages and reload page
            error: function(response) {
                $('#user-name-display').text("ERROR");
                $('#user-email-display').text(response.responseJSON.message);
        		setTimeout(function(){ location.reload(); }, 3000);
            }
        });
    });

    //Check for submit event on the search reminder form
    $('#search-reminder-form').on('submit', function(event) {
        //Stop form from submitting normally
        event.preventDefault();
        var data = $(this).serialize(); 

        //Retrieve form information and User ID
        var $form = $( this ),
            searchText = $form.find( "input[name='title']" ).val(),
            userId = $('#title').attr('data-reminder-search-user-id');

        //AJAX call to search for a particular reminder
        $.ajax({
            url: '/users/' + userId + '/reminders/',
            method: 'GET',
            contentType: 'application/json',
            data: data,
            dataType: 'json',
            success: function(response) {
                //Check for valid results
                if(response.length > 0){
                    var searchResults = '';
                    //For each valid result build the display HTML
                    for(var i = 0; i < response.length; i++){

                        searchResults += '<p><b>Title:</b> ' + response[i].title + '<p>'
                            + '<p><b>Description:</b> ' + response[i].description + '<p>'
                            + '<p><b>Created:</b> ' + response[i].created + '<p>';

                        //Add a horizontal line after each result
                        //except for the last one
                        if (i !== response.length -1){
                            searchResults += '<hr>';
                        }
                    }
                    //Display all results in modal window
                    $('#search-result-title').html('Search Results for <i>' + searchText + '</i>')
                    $('#search-modal-result-content').html(searchResults);
                }
            },
            //Display error messages
            error: function(response) {
                $('#search-result-title').html('Search Results for <i>' + searchText + '</i>')
                $('#search-modal-result-content').html(response.responseJSON.message);
            }
        });
    });

});

//On Page load
$(document).ready(function(){
    //Enable submit button on create user form
	$('#create-user-submit-btn').removeAttr("disabled");
    //Retrieve the current path
    var urlPath = $(location).attr("pathname");

    //Display the reminder search box only in the
    //all user's reminders page
    if(urlPath.match(/\/users\/\d+\/info\/reminders/)){
        $('#search-layout-box').show();
    }
});

