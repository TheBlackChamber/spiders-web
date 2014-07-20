define(['ember','jquery','modules/persona','spinjs','bootstrap'],function(Ember,$,Persona,Spinner){
	/**
	 * Function which will show the create project dialog.
	 */
	var showCreateProjectModal = function(model){
	  	var newproject = Ember.Object.create();
	  	model.set('newproject',newproject);
	  	$('#create-project-modal').modal();
	};

	/*
	 * Function which will hide the create project dialog.
	 */
	var hideCreateProjectModal = function(){
		$('#create-project-modal').modal('hide');
	}

	/**
	 * Function which will populate and show the new bug modal.
	 */
	var showNewBugModal = function(model){
	  	var newbug = Ember.Object.create({});
	  	var usr = Persona.getLoggedInUser();
	  	model.set('newbug',newbug);
	  	model.set('newbug.labels',[]);
	  	model.set('newbug.createdby',usr.email);

	  	populatePriorities(model);
	  	populateLabels(model);
	  	$('#create-bug-modal').modal();
	  	$('.autosizedchild > textarea').autosize();
	};

	/*
	 * Function which will hide the new bug modal.
	 */
	var hideNewBugModal = function(){
		$('#create-bug-modal').modal('hide');
	};

	/*
	 * Function which will display the login required modal to the user.
	 */
	var showLoginRequiredModal = function(){
		$('#login-required-modal').modal();
	};

	/*
	 * Function which will display the error modal to the user.
	 */
	var showErrorModal = function(){
		console.log('Display the fucking modal');
		$('#error-modal').modal();
	};

	/*
	 * Function which will hide the login required modal from the user.
	 */
	var hideLoginRequiredModal = function(){
		$('#login-required-modal').modal('hide');
	};

	/*
	 * Function which will show the Loading Modal. 
	 */
	var showLoadingModal = function(){
		var opts = {
		  	lines: 13, // The number of lines to draw
		  	length: 20, // The length of each line
		  	width: 10, // The line thickness
		  	radius: 30, // The radius of the inner circle
		  	corners: 1, // Corner roundness (0..1)
		  	rotate: 0, // The rotation offset
		  	direction: 1, // 1: clockwise, -1: counterclockwise
		  	color: '#FFF', // #rgb or #rrggbb or array of colors
		  	speed: 1, // Rounds per second
		  	trail: 60, // Afterglow percentage
		  	shadow: false, // Whether to render a shadow
		  	hwaccel: false, // Whether to use hardware acceleration
		  	className: 'spinner', // The CSS class to assign to the spinner
		  	zIndex: 2e9, // The z-index (defaults to 2000000000)
		  	top: '50%', // Top position relative to parent
		  	left: '50%' // Left position relative to parent
		};
		var target = document.getElementById('loading-div-background');
		var spinner = new Spinner(opts).spin(target);
		$('#loading-div-background').show();
	}

	/*
	 * Function which will hide the loading modal.
	 */
	var hideLoadingModal = function(){
		$('#loading-div-background').empty();
		$('#loading-div-background').hide();
	}

	return {
		showCreateProjectModal : showCreateProjectModal,
		showLoginRequiredModal : showLoginRequiredModal,
		hideLoginRequiredModal : hideLoginRequiredModal,
		showLoadingModal : showLoadingModal,
		hideLoadingModal : hideLoadingModal,
		hideCreateProjectModal : hideCreateProjectModal,
		showErrorModal : showErrorModal
	};
});