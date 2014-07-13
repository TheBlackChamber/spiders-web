define(['require','jquery','personasupport','jquerycookie'],function(require,$){

	/**
	 * Function which will fetch and return the currently
	 * logged in user if any. Null otherwise.
	 */
	var getLoggedInUser = function(){
	  $.cookie.json = true;
	  if($.cookie('auth') == undefined){
	    return null;
	  }else{
	    return $.cookie('auth');
	  }  
	}

	//Attempt to set User from cookie if page reloaded
	var currentUser = getLoggedInUser();
	var currentUserEmail = null;
	//If user was loaded from cookie update UI

	if(currentUser != null){
	  $('#loginlink').hide();
	  $('#logoutlink').show();
	  $('#display-username').text(currentUser.email);
	  $('#logout-pane').show();
	  currentUserEmail = currentUser.email;
	}

	/**
	 * Function which will be used to require a user be logged into to 
	 * perform an action.
	 * Params: callback - Function to be called if the user is logged in.
	 */
	var requireLogin = function(callback){

	  	var user = getLoggedInUser();

	  	if(user){
	    	callback();
	  	}else{
	    	require('modules/modals').showLoginRequiredModal();
	  	}

	}

	function showLogoutLink(){
  		$('#loginlink').hide();
	    $('#logoutlink').show();
	    $('#display-username').text(currentUser);
	    $('#logout-pane').show();
	}

	function showLoginLink(){
	    $('#loginlink').show();
	    $('#logoutlink').hide();
	    $('#display-username').text('');
	    $('#logout-pane').hide();
	}

	var init = function(){
		//Bind click action on login\logout links
		$('#loginlink').click(function(e){
		  	e.preventDefault();
		  	navigator.id.request();
		});
		$('#login-required-modal-login').click(function(e){
		  	e.preventDefault();
		  	navigator.id.request();
		});
		$('#logoutlink').click(function(e){
		  	navigator.id.logout();
		  	e.preventDefault();
		});

		navigator.id.watch({
		 	loggedInUser: currentUserEmail,
		  	onlogin: function(assertion) {
		    	// A user has logged in! Here you need to:
		    	require('modules/modals').hideLoginRequiredModal();
		    	require('modules/modals').showLoadingModal();
		    	
		    	// 1. Send the assertion to your backend for verification and to create a session.
		    	$.ajax({
		        	type: 'POST',
		        	dataType: "json",
		        	url: 'rest/login.php', // This is a URL on your website.
		        	data: {assertion: assertion},
		        	success: function(res, status, xhr) {
		            	$.cookie.json = true;
		            	$.cookie('auth', res);
		            	window.location.reload();
		        	},
		        	error: function(xhr, status, err) {
		            	alert('Login failure: ' + err);
		        	}
		    	});
		  	},
		  	onlogout: function() {
		    	// A user has logged out! Here you need to:
		    	// Tear down the user's session by redirecting the user or making a call to your backend.
		    	// Also, make sure loggedInUser will get set to null on the next page load.
		    	// (That's a literal JavaScript null. Not false, 0, or undefined. null.)
		     	$.ajax({
		          	type: 'POST',
		          	url: 'rest/logout.php', // This is a URL on your website.
		          	success: function(res, status, xhr) {
		              	$.removeCookie('auth');
		              	window.location.reload();
		          	},
		          	error: function(xhr, status, err) {
		              	alert('Logout failure: ' + err);
		          	}
		      	});
		  	}
		});

		function showLogoutLink(){
		  	$('#loginlink').hide();
		    $('#logoutlink').show();
		    $('#display-username').text(currentUser);
		    $('#logout-pane').show();
		}

		function showLoginLink(){
		    $('#loginlink').show();
		    $('#logoutlink').hide();
		    $('#display-username').text('');
		    $('#logout-pane').hide();
		}
	};
	return {
		init: init,
		getLoggedInUser : getLoggedInUser,
		requireLogin : requireLogin
	};
});