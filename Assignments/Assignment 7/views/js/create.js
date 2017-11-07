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
                $('#userSuccess').text("Successfully created a reminder");
                $('#userSuccess').show();
        		$('#userSuccess').delay(5000).fadeOut();

        		if(urlPath == "/"){
        			$('#create-user-submit-btn').attr("disabled", "disabled");
        			setTimeout(function(){ location.reload(); }, 3000);
        		}
            },
            error: function(response) {
                $('#userFailure').text("ERROR: " + response.message);
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
			url = $form.attr( "action" );

		var JSONObj = { "title": userName, "description": userEmail } ;

        $.ajax({
            url: referrerUrl + 'reminders',
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
                $('#reminderFailure').text("ERROR: " + response.message);
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
			reminderId = $form.find( "input[name='reminder-id']" ).val();

		//console.log(url);

		//var JSONObj = { "title": userName, "description": userEmail } ;

        $.ajax({
            url: './reminders/' + reminderId,
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
                $('#reminder-title').text("ERROR");
                $('#reminder-description').text(response.message);
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
			reminderId = $form.find( "input[name='reminder-id']" ).val();

		//console.log(url);

		//var JSONObj = { "title": userName, "description": userEmail } ;

        $.ajax({
            url: './reminders/' + reminderId,
            method: 'DELETE',
            contentType: 'application/json',
	  		dataType: 'json',
            success: function(response) {
                $('#reminder-title').text("Success!");
                $('#reminder-description').text("Successfully deleted a reminder");
        		setTimeout(function(){ location.reload(); }, 3000);
            },
            error: function(response) {
                $('#reminder-title').text("ERROR");
                $('#reminder-description').text(response.message);
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
			reminderId = $form.find( "input[name='reminder-id']" ).val();


		//var JSONObj = { "title": userName, "description": userEmail } ;

        $.ajax({
            url: referrerUrl + 'reminders',
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
                $('#reminder-description').text(response.message);
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
                $('#user-email-display').text(response.message);
        		setTimeout(function(){ location.reload(); }, 3000);
            }
        });
    });


});

$(document).ready(function(){
	$('#create-user-submit-btn').removeAttr("disabled");
});
/*function myFunction() {
	$( "#create-user" ).submit(function( event ) {

		console.log("TEST");
	 
	  // Stop form from submitting normally
	  event.preventDefault();
	 
	  // Get some values from elements on the page:
	  var $form = $( this ),
	    userName = $form.find( "input[name='name']" ).val(),
	    userEmail = $form.find( "input[name='email']" ).val(),
	    url = $form.attr( "action" );

	  var JSONObj = { "user": { "name": userName, "email": userEmail } };
	 
	  // Send the data using post
	  //var posting = $.post( url, { user: { name: userName, email: userEmail } } );

	  var posting = $.ajax({
	  	url: '/users',
	  	method: 'POST',
		contentType: 'application/json',
	  	//data: { "user": JSONObj },
	  	data: JSON.stringify(JSONObj),
	  	dataType: 'json'
	  });
	 
	  // Put the results in a div
	  posting.done(function( data ) {
	    //var content = $( data ).find( "name" );
	    //$( "#result" ).empty().append( content );
	    console.log(data);
	  });
	});
}
*/
