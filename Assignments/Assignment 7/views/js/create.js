$(function() {
    // CREATE/POST
    $('#create-user').on('submit', function(event) {
		//Stop form from submitting normally
        event.preventDefault();

		var $form = $( this ),
			userName = $form.find( "input[name='create-user-name']" ).val(),
			userEmail = $form.find( "input[name='create-user-email']" ).val();


        var urlPath = $(location).attr("pathname");

		var JSONObj = { "name": userName, "email": userEmail } ;

        $.ajax({
            url: '/users',
            method: 'POST',
            contentType: 'application/json',
	  		dataType: 'json',
            data: JSON.stringify({ user: JSONObj }),
            success: function(response) {
                $('#userSuccess').text("Successfully created a user!");
                $('#userSuccess').show();
        		$('#userSuccess').delay(4000).fadeOut();

        		if(urlPath == "/users"){
        			$('#create-user-submit-btn').attr("disabled", "disabled");
        			setTimeout(function(){ location.reload(); }, 4000);
        		}
                else{
                    $('#create-user-submit-btn').attr("disabled", "disabled");
                    setTimeout(function(){ $('#create-user-submit-btn').removeAttr("disabled"); }, 4200);
                }
            },
            error: function(response) {
                $('#userFailure').text("ERROR: " + response.responseJSON.message);
                $('#userFailure').show();
        		$('#userFailure').delay(10000).fadeOut();
            }
        });
    });


    // CREATE/POST
    $('#create-reminder').on('submit', function(event) {
		//Stop form from submitting normally
        event.preventDefault();
        var referrerUrl = $(location).attr("href");

		var $form = $( this ),
			userName = $form.find( "input[name='title']" ).val(),
			userEmail = $form.find( "input[name='description']" ).val(),
            userId = $('#create-reminder-link').attr('data-user-id');

        console.log(userId);

		var JSONObj = { "title": userName, "description": userEmail } ;

        $.ajax({
            url: '/users/' + userId + '/reminders',//referrerUrl + 'reminders',
            method: 'POST',
            contentType: 'application/json',
	  		dataType: 'json',
            data: JSON.stringify({ reminder: JSONObj }),
            success: function(response) {
                $('#reminderSuccess').text("Successfully created a reminder");
                $('#reminderSuccess').show();
        		$('#reminderSuccess').delay(4000).fadeOut();
    			$('#create-reminder-submit-btn').attr("disabled", "disabled");

    			setTimeout(function(){ $('#create-reminder-submit-btn').removeAttr("disabled"); }, 4500);
            },
            error: function(response) {
                $('#reminderFailure').text("ERROR: " + response.responseJSON.message);
                $('#reminderFailure').show();
        		$('#reminderFailure').delay(10000).fadeOut();
            }
        });
    });

	//View Reminder Info Functions
	$('.get-reminder-link').click(function(){
		var formNumber = $(this).attr('data-reminder-view-id');
		$('#view-reminder-form-' + formNumber).submit();
	});

    //View Reminder Info Functions
    $('.view-reminder-form').on('submit', function(event) {
		//Stop form from submitting normally
        event.preventDefault();
        var referrerUrl = $(location).attr("href");
		var data = $(this).serialize(); 

		var $form = $( this ),
			reminderId = $form.find( "input[name='reminder-id']" ).val(),
            userId = $('#get-reminder-link-' + reminderId).attr('data-reminder-view-user-id');

		//console.log(url);

		//var JSONObj = { "title": userName, "description": userEmail } ;

        $.ajax({
            url: '/users/' + userId + '/reminders/' + reminderId,
            method: 'GET',
            contentType: 'application/json',
            data: data,
	  		dataType: 'json',
            success: function(response) {
                $('#reminder-title').text(response.title);
                $('#reminder-description').text(response.description);
        		$('#reminder-created').text("Created on: " + response.created);
            },
            error: function(response) {
                $('#reminder-description').text('');
                $('#reminder-title').text("ERROR");
                $('#reminder-description').text(response.responseJSON.message);
                $('#reminder-created').text('');
            }
        });
    });

	//Delete Reminder Info Functions
	$('.delete-reminder-link').click(function(){
		var formNumber = $(this).attr('data-reminder-delete-id');
		$('#delete-reminder-form-' + formNumber).submit();
	});

    //Delete Reminder Info Functions
    $('.delete-reminder-form').on('submit', function(event) {
		//Stop form from submitting normally
        event.preventDefault();
        //var referrerUrl = $(location).attr("href");
		//var data = $(this).serialize(); 

		var $form = $( this ),
			reminderId = $form.find( "input[name='reminder-id']" ).val(),
            userId = $('#delete-reminder-link-' + reminderId).attr('data-reminder-delete-user-id');

		//console.log(url);

		//var JSONObj = { "title": userName, "description": userEmail } ;

        $.ajax({
            url: '/users/' + userId + '/reminders/' + reminderId,
            method: 'DELETE',
            contentType: 'application/json',
	  		dataType: 'json',
            success: function(response) {
                $('#reminder-title').text("Success!");
                $('#reminder-description').text("Successfully deleted a reminder");
        		setTimeout(function(){ location.reload(); }, 2000);
            },
            error: function(response) {
                $('#reminder-title').text("ERROR");
                $('#reminder-description').text(response.responseJSON.message);
            }
        });
    });


    //Delete all reminders
	$('#delete-all-reminders-button').click(function(){
		//var formNumber = $(this).attr('data-reminder-delete-id');
		$('#delete-all-reminders').submit();
	});

    $('#delete-all-reminders').on('submit', function(event) {
		//Stop form from submitting normally
        event.preventDefault();
        var referrerUrl = $(location).attr("href");

		var $form = $( this ),
			reminderId = $form.find( "input[name='reminder-id']" ).val(),
            userId = $('#delete-all-reminders-button').attr('data-user-id');


		//var JSONObj = { "title": userName, "description": userEmail } ;

        $.ajax({
            url: '/users/' + userId + '/reminders',
            method: 'DELETE',
            contentType: 'application/json',
	  		dataType: 'json',
            //data: JSON.stringify({ reminder: JSONObj }),
            success: function(response) {
                $('#reminder-title').text("Success!");
                $('#reminder-description').text("Successfully deleted all reminders");
            },
            error: function(response) {
                $('#reminder-title').text("ERROR!");
                $('#reminder-description').text(response.responseJSON.message);
            }
        });
    });



	//Delete User Info Functions
	$('.delete-user-link').click(function(){
		var formNumber = $(this).attr('data-user-delete-id');
		$('#delete-user-form-' + formNumber).submit();
	});

    //Delete User Info Functions
    $('.delete-user-form').on('submit', function(event) {
		//Stop form from submitting normally
        event.preventDefault();
        //var referrerUrl = $(location).attr("href");
		//var data = $(this).serialize(); 

		var $form = $( this ),
			reminderId = $form.find( "input[name='user-id']" ).val();

		//console.log(url);

		//var JSONObj = { "title": userName, "description": userEmail } ;

        $.ajax({
            url: '/users/' + reminderId,
            method: 'DELETE',
            contentType: 'application/json',
	  		dataType: 'json',
            success: function(response) {
            	console.log("hi");
                $('#user-name-display').text("Success!");
                $('#user-email-display').text("Successfully deleted a user");
        		setTimeout(function(){ location.reload(); }, 3000);
            },
            error: function(response) {
                $('#user-name-display').text("ERROR");
                $('#user-email-display').text(response.responseJSON.message);
        		setTimeout(function(){ location.reload(); }, 3000);
            }
        });
    });

    //Search Reminder Info Functions
    $('#search-reminder-form').on('submit', function(event) {
        //Stop form from submitting normally
        event.preventDefault();
        //var referrerUrl = $(location).attr("href");
        var data = $(this).serialize(); 

        var $form = $( this ),
            searchText = $form.find( "input[name='title']" ).val(),
            userId = $('#title').attr('data-reminder-search-user-id');


        $.ajax({
            url: '/users/' + userId + '/reminders/',
            method: 'GET',
            contentType: 'application/json',
            data: data,
            dataType: 'json',
            success: function(response) {
                if(response.length > 0){
                    var searchResults = '';
                    for(var i = 0; i < response.length; i++){

                        searchResults += '<p><b>Title:</b> ' + response[i].title + '<p>'
                            + '<p><b>description:</b> ' + response[i].description + '<p>'
                            + '<p><b>Created:</b> ' + response[i].created + '<p>';

                        if (i !== response.length -1){
                            searchResults += '<hr>';
                        }
                        $('#search-modal-result-content').html('<p>hey ' + i + '</p><p>yo ' + i);
                    }
                        $('#search-result-title').html('Search Results for <i>' + searchText + '</i>')
                        $('#search-modal-result-content').html(searchResults);
                }
            },
            error: function(response) {
                        $('#search-result-title').html('Search Results for <i>' + searchText + '</i>')
                        $('#search-modal-result-content').html(response.responseJSON.message);
                        console.log(response);
            }
        });
    });

});

$(document).ready(function(){
	$('#create-user-submit-btn').removeAttr("disabled");
    var urlPath = $(location).attr("pathname");
    if(urlPath.match(/\/users\/\d+\/info\/reminders/)){
        $('#search-layout-box').show();
    }
});

