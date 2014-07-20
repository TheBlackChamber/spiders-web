
/*
 * Module which will define and provide all functionality for the Bugs (Main) bug page.
 */
define(['jquery','ember','modules/dao','modules/modals','modules/persona'],function($,Ember,Dao,Modals,Persona){
	//Filter used on bugs page and other places to filter bugs to be displayed.
	//This is not in the model as we want to retain the values as we nav from page
	//to page. that way when we go BACK we can restore the previous state.
	var filter = new Object();
	filter.assignment = 'all';
	filter.project = '';
	filter.status = 'opentoggle';

	//Generic Bug Listing Page model. Most pages will just be displaying a bug list and a loading spinner.
	BugListModel = Ember.Object.extend({
		showloading:null,
		buglist:null
	});

	/*
	 * Updates the UI based on the filter object. This will propulate forms or
	 * update the selected filters on the bugs list page.
	 */
	var updateUIFromFilter = function(){
		//Update Project Filter
		$(".projfilterlink").parent().removeClass('active');
		if(filter.project){
			$("a[lid='"+filter.project+"']").parent().addClass('active');
		}

		//Update Assigment Filter
		$(".assignment").parent().removeClass('active');
		$("a[lid='"+filter.assignment+"']").parent().addClass('active');
		$("input[id='"+filter.status+"']").parent().addClass('active');
	}

	/*
	 * Function which will be called during initializing of the application. It will define route, view, and controller.
	 */
	var init = function(App){
		/*
		 * Route for the Bugs page.
		 */
		App.BugsRoute = Ember.Route.extend({
		 	model: function(params) {
		 		var model = BugListModel.create({
		 			showloading:true,
		 			showprojloading:true,
		 			buglist:[],
		 			projectlist:[]
		 		});

		      	//Async get the bug list from the server.
		      	Dao.fetchBugList(model,filter);

		     	//Async get the project list from the server.
		     	Dao.fetchProjectList(model, 'projectlist.php');

		      	return model;

		  	}
		});

		/*
		 * View for the Bugs page.
		 */
		App.BugsView = Ember.View.extend({
		 	didInsertElement: function(event) {
		      	//Whenever the page loads we will update the filters UI.
		      	updateUIFromFilter();
		  	}
		});


		/*
		 * Controller for the Bugs page.
		 */
		App.BugsController = Ember.ObjectController.extend({
		 	actions: {
		 		assignment: function(assigned) {
			    	//Action function to handle when a user clicks the assignement filters.

			    	var model = this.get('model');
			    	var filterfunction = function(){
			    		filter.assignment = assigned;
			    		updateUIFromFilter();

			    		Dao.fetchBugList(model,filter);

			    	};

			    	if(assigned == 'mine'){
			    		Persona.requireLogin(filterfunction);
			    	}else{
			    		filterfunction();
			    	}
			    },
			    showcreateproject: function(){
			      	//Show create project modal
			      	var model = this.get('model');
			      	Persona.requireLogin(function(){
			      		Modals.showCreateProjectModal(model);
			      	});
			  	},
			  	showcreatebug: function(){
			    	//Edit/Create action function.
			    	var model = this.get('model');
			    	Persona.requireLogin(function(){
			    		showNewBugModal(model);
			    	});
			    },
			    removelabelnewbug: function(label){
			      	//Action function to remove assigned label from a new bug
			      	var model = this.get('model');
			      	for (var i = model.bug.labels.length - 1; i >= 0; i--) {
			      		if(model.bug.labels[i].label == label.label){
			      			model.bug.labels.removeAt(i);
			      		}
			      	};
			  	},
			  	createproject: function(){
			      	//Action function to create a project
			      	var model = this.get('model');
			      	var project = model.get('newproject');

			      	project.key = project.label.toLowerCase()
			      	project.key = project.key.replace(/\s+/g, '');

			      	var projectlist = model.get('projectlist');

			      	//Add project to project list
			      	projectlist.addObject(project);

			      	//AJAX call to create project
			      	Dao.createProject({key:project.key,label:project.label},{
			      		successCallBack: function(){
			      			//Things are good... nothing to do.
			      		},
			      		errCallBack: function(){
			      			//Rollback UI
			      			projectlist.removeObject(project);
			      			Modals.showErrorModal();
			      		}
			      	});

			      	Modals.hideCreateProjectModal();

			  	},
			  	createbug: function(){
			      	//Action function to create a bug

			      	var model = this.get('model');
			      	var bug = model.get('newbug');
			      	bug.set('modified',new Date());

			      	//Add bug to list
			      	model.get('buglist').addObject(bug);

			      	//AJAX call to create bug
			      	//Update ID on bug when return from create

			      	$('#create-bug-modal').modal('hide');
//TODO
			      	//Simulate ajax return
			      	setTimeout(function(){
			      		bug.set('id',12);
			      	},2000);


			  	},
			  	editprioritynewbug: function(priority){
			      	//Action function to handle when the user selects a priority for a new bug
			      	var model = this.get('model');

			      	//Because the class name is unbound we need to manually update it. :-(
			      	if(model.newbug.priority == null){
			      		$('#newbug-priority-display').removeClass('badge-');
			      	}else{
			      		$('#newbug-priority-display').removeClass('badge-' + model.newbug.priority.css_class);
			      	}

			      	$('#newbug-priority-display').addClass('badge-' + priority.css_class);

			      	model.set('newbug.priority',priority);
			    },
			    addnewbuglabel: function(label){
			      	//Action function for when user adds label to newbug
			      	//Get model
			      	var model = this.get('model');

			      	//Dont assign the same label twice.
			      	if(model.newbug.labels != null){
			      		for (var i = model.newbug.labels.length - 1; i >= 0; i--) {
			      			if(model.newbug.labels[i].label == label.label){
			      				return;
			      			}
			      		};
			      	}else{
			      		model.newbug.labels = Ember.A([]);
			      	}

			      	//Add label to bug
			      	model.newbug.labels.addObject(label);
			  	},
			  	viewbug: function(bug){
			    	//Action function to handle a user clicking on a bug link.
			    	showbacklink = true;
			    	this.transitionToRoute('bug', bug.id);
			    },
			    project: function(project){
			    	//Action function to handle when a user clicks on a project filter.
			    	if(project.key == filter.project){
			    		//If the clicked the already selected project. Remove the filter
			    		filter.project = '';
			    	}else{
			    		//If they clicked on a new project, add that project to the filter
			    		filter.project = project.key;
			    	}    
			    	updateUIFromFilter();
			    	var model = this.get('model');
			    	Dao.fetchBugList(model,filter);	
			    },
			    filterstatus: function(status){
			    	filter.status = status;
			    	updateUIFromFilter();
			    	var model = this.get('model');
			    	Dao.fetchBugList(model,filter);	
			    }
			}
		});
	};
	return {
		init : init
	}
});