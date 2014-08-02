/*
 * Module which will define and provide all functionality for the Bug page.
 */
 define(['jquery','ember','modules/dao','modules/modals','modules/persona'],function($,Ember,Dao,Modals,Persona){

 	/*
	 * Function which will be called during initializing of the application. It will define route, view, and controller.
	 */
	var init = function(App){
		/*
		 * Route for the Bug page.
		 */
		App.BugRoute = Ember.Route.extend({
		  model: function(params) {
			  	var bugmodel = Ember.Object.create();
			  	if(window.showbacklink == undefined){
			  		bugmodel.set('showbacklink',false);
			  	}else{
			  		window.showbacklink = undefined;
					bugmodel.set('showbacklink',true);
			  	}
		  		Dao.fetchBug(bugmodel,params.bug_id);
		      	Dao.populatePriorities(bugmodel);
		      	Dao.populateLabels(bugmodel);

			    return bugmodel;

		    }
		});

		/*
		 * Controller for the Bug page.
		 */
		App.BugController = Ember.ObjectController.extend({
		  	actions: {
		    	backtolist: function() {
		    		//Action function for when a user clicks the back to list link
		    		this.transitionToRoute('bugs');
		    	},
		    	showcreatebug: function(){
		      		//Action function to handle user clicking the create bug button
		      		var model = this.get('model');
		      		Persona.requireLogin(function(){
		        		Modals.showNewBugModal(model);
		      		});
		    	},
		    	removelabelnewbug: function(label){
		      		//Action function to remove assigned label from a new bug
		      		var model = this.get('model');
		      		Persona.requireLogin(function(){
		        		for (var i = model.newbug.labels.length - 1; i >= 0; i--) {
		          			if(model.newbug.labels[i].label == label.label){
		            			model.newbug.labels.removeAt(i);
		          			}
		        		};
		      		});
		    	},
		    	createbug: function(){
		      		//Action function to handle when the user clicks the create bug button in modal
		      		var model = this.get('model');
		      		Persona.requireLogin(function(){
		      			Modals.hideNewBugModal();
		        		//TODO Create bug and navigate to bug.
		      		});
		    	},
		    	editprioritynewbug: function(priority){
		      		//Action function to handle when the user selects a priority for a new bug
		      		var model = this.get('model');
		      		Persona.requireLogin(function(){
		        		//Because the class name is unbound we need to manually update it. :-(
		        		if(model.newbug.priority == null){
		          			$('#newbug-priority-display').removeClass('badge-');
		        		}else{
		          			$('#newbug-priority-display').removeClass('badge-' + model.newbug.priority.css_class);
		        		}

		        		$('#newbug-priority-display').addClass('badge-' + priority.css_class);

		        		model.set('newbug.priority',priority);
		      		});
		    	},
		    	addnewbuglabel: function(label){
		      		//Action function for when user adds label to newbug
		      		//Get model
		      		var model = this.get('model');
		      		Persona.requireLogin(function(){
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
		      		});
		    	},
		    	comment : function(){
		      		//Action function to save a comment to the bug
		      		var model = this.get('model');
		      		Persona.requireLogin(function(){
		        		var rightnow = new Date();
		        		var user = Persona.getLoggedInUser();
		        		var comment = {};

		        		comment.comment = model.get('newcomment');
		        		comment.bugid = model.bug.id;
		        		comment.date = rightnow;
		        		comment.user = user.email.substring(0,user.email.indexOf('@'));
		        		comment.saving = true;
		        
		        		var callbacks = {
		        			success: function(commentid){
		        				model.bug.comments.addObject(comment);
				        		model.set('newcomment','');
				        		comment.id = commentid;
				        		comment.saving = false;
		        			},
		        			error: function(){
		        				comment.saving = false;
		        				Modals.showErrorModal();
		        			}
		        		};

		        		Dao.saveComment(comment,callbacks);
		        		
		      		});
		    	},
		    	reopen: function(){
		      		//Action function to save a comment to the bug and change bug to closed
		      		var model = this.get('model');
		      		Persona.requireLogin(function(){
				        var rightnow = new Date();
				        var user = Persona.getLoggedInUser();
				        var comment = {};

				        comment.comment = model.get('newcomment');
				        comment.date = rightnow;
				        comment.bugid = model.bug.id;
				        comment.user = user.email.substring(0,user.email.indexOf('@'));
				        comment.saving = true;

				        model.bug.comments.addObject(comment);
				        model.set('newcomment','');
				        model.set('bug.status','Open');
				        model.set('bug.isopen',true);

				        var callbacks = {
				        	success: function(commentid){
				        		comment.id = commentid;
				        		comment.saving = false;
				        	},
				        	error: function(){
				        		model.set('bug.status','Closed');
						        model.set('bug.isopen',false);
				        		comment.saving = false;
				        		model.set('newcomment',comment.comment);
				        		model.bug.comments.removeObject(comment);
		        				Modals.showErrorModal();
				        	}
				        };

				        Dao.commentAndReopen(comment,callbacks);

			      	});
		    	},
		    	close : function(){
		      		//Action function to save a comment to the bug and change bug to closed
		      		var model = this.get('model');
		      		Persona.requireLogin(function(){
				        var rightnow = new Date();
				        var user = Persona.getLoggedInUser();
				        var comment = {};

				        comment.comment = model.get('newcomment');
				        comment.date = rightnow;
				        comment.bugid = model.bug.id;
				        comment.user = user.email.substring(0,user.email.indexOf('@'));
				        comment.saving = true;

				        model.bug.comments.addObject(comment);
				        model.set('newcomment','');
				        model.set('bug.status','Closed');
				        model.set('bug.isopen',false);

				        var callbacks = {
				        	success: function(commentid){
				        		comment.id = commentid;
				        		comment.saving = false;
				        	},
				        	error: function(){
				        		model.set('bug.status','Open');
						        model.set('bug.isopen',true);
				        		comment.saving = false;
				        		model.set('newcomment',comment.comment);
				        		model.bug.comments.removeObject(comment);
		        				Modals.showErrorModal();
				        	}
				        };

				        Dao.commentAndClose(comment,callbacks);

			      	});
			    },
		    	take: function(){
		    		//Action function to assign the current bug to the current logged in user
		    		//Update JSON Object (bug)
			    	var model = this.get('model');

			      	Persona.requireLogin(function(){
			      		//Get Logged In User
		    			var user = Persona.getLoggedInUser();

		      			model.set('bug.assigned',user.email.substring(0,user.email.indexOf('@')));
		      			model.set('bug.ismine',true);

						var callbacks = {
				    		successCallBack:function(){
				    			//Nothing to do
				    		},
				    		errorCallback:function(bug){
				    			model.set('bug.assigned',null);
						    	model.set('bug.ismine',false);
						    	Modals.showErrorModal();
				    		}
				    	};
				    	Dao.takeBug(model.get('bug'),callbacks);
		      		});
		    	},
		    	clearassignment: function(){
		      		//Action function to handle a use clicking the clear assignment link
		      		var model = this.get('model');
		      		var assignment = model.get('bug.assigned');
		      		var ismine = model.get('bug.ismine');
		      		Persona.requireLogin(function(){
		        		model.set('bug.assigned',null);
		        		model.set('bug.ismine',null);

		        		var callbacks = {
				    		successCallBack:function(){
				    			//Nothing to do
				    		},
				    		errorCallback:function(bug){
				    			model.set('bug.assigned',assignment);
						    	model.set('bug.ismine',ismine);
						    	Modals.showErrorModal();
				    		}
				    	};

		      		});
		    	},
		    	deletecomment:function(comment){
		      		//Action function to delete comment from bug

		      		//Get model
		      		var model = this.get('model');
		      		Persona.requireLogin(function(){
		        		//Remove from comments list
		        		var rollbackindex;
		        		for (var i = model.bug.comments.length - 1; i >= 0; i--) {
		          			if(model.bug.comments[i].id == comment.id){
		          				rollbackindex = i;
		            			model.bug.comments.removeAt(i);
		          			}
		        		};

		        		var callbacks = {
		        			success: function(){
		        				//Nothing to do
		        			},
		        			error: function(){
		        				model.bug.comments.insertAt(rollbackindex,comment);
		        				Modals.showErrorModal();
		        			}
		        		};

		        		Dao.deleteComment({id:comment.id},callbacks);

		      		});
		    	},
		    	editcomment: function(comment){
		      		//Action function to edit a comment in a bug

		      		//Get model from controller
		      		var model = this.get('model');
		      		Persona.requireLogin(function(){
		        		//Create new editable instance
		        		var newComment = {
			          		comment: comment.comment,
			          		rollback: comment.comment,
			          		date: comment.date,
			          		user: comment.user,
			          		editing: true,
		          			id: comment.id
		        		};

		        		//Remove from comments list and readd to redraw display
		        		for (var i = model.bug.comments.length - 1; i >= 0; i--) {
		          			if(model.bug.comments[i].id == comment.id){
		            			model.bug.comments.removeAt(i);
		            			model.bug.comments.insertAt(i,newComment);
		          			}
		        		};
		      		});
		    	},
		    	saveedit: function(comment){
		      		//Action function which will save the edit to a comment
		      		//Get model from controller
		      		var model = this.get('model');
		      		Persona.requireLogin(function(){
		        		//Create new editable instance
		        		var newComment = Ember.Object.create({
		          			comment: comment.comment,
		          			date: comment.date,
		          			user: comment.user,
		          			editing: false,
		          			saving:true,
		          			id: comment.id
		        		});

		        		//Remove from comments list and readd to redraw display
		        		for (var i = model.bug.comments.length - 1; i >= 0; i--) {
		          			if(model.bug.comments[i].id == comment.id){
		            			model.bug.comments.removeAt(i);
		            			model.bug.comments.insertAt(i,newComment);
		          			}
		        		};

		        		var callbacks = {
		        			success: function(){
		        				newComment.saving = false;
		        				for (var i = model.bug.comments.length - 1; i >= 0; i--) {
				          			if(model.bug.comments[i].id == comment.id){
				            			model.bug.comments.removeAt(i);
				            			model.bug.comments.insertAt(i,newComment);
				          			}
				        		};
		        			},
		        			error: function(){
		        				newComment.saving = false;
		        				newComment.comment = comment.rollback;
		        				for (var i = model.bug.comments.length - 1; i >= 0; i--) {
				          			if(model.bug.comments[i].id == comment.id){
				            			model.bug.comments.removeAt(i);
				            			model.bug.comments.insertAt(i,newComment);
				          			}
				        		};
		        			}
		        		};

		        		var data = {
		        			comment: newComment.comment,
		        			id: newComment.id
		        		};

		        		Dao.saveComment(data,callbacks);
		        		
		      		});
		    	},
		    	editdescription: function(){
		      		//Action function when user clicks to edit subject of the bug
		      		//Get model from controller
		      		var model = this.get('model');
		      		Persona.requireLogin(function(){
		        		//Save rollback text
		        		model.set('bug.rollbackdesc',model.get('bug.description'));

		        		//Display editing subject
		        		model.toggleProperty('bug.editingdesc');
		      		});
		    	},
		    	saveeditdesc: function(){
		      		//Action function when user saves edit description
		      		//Get model from controller
		      		var model = this.get('model');
		      		Persona.requireLogin(function(){
		        		

		        		//Display editing subject
		        		model.toggleProperty('bug.editingdesc');

		        		//Display saving icon
		        		model.toggleProperty('bug.savingdescription');

		        		var callbacks = {
				    		successCallBack:function(){
				    			//Reset rollback text
				        		model.set('bug.rollbackdesc',null);

								//Display saving icon
				        		model.toggleProperty('bug.savingdescription');

				        		console.log('Its on: ' + model.get('bug.savingdescription'));

				    		},
				    		errorCallback:function(bug){
				    			//Display saving icon
				        		model.toggleProperty('bug.savingdescription');

				        		//Rollback edit
				        		model.set('bug.description',model.get('bug.rollbackdesc'))

				        		//Reset rollback text
				        		model.set('bug.rollbackdesc',null);

						    	Modals.showErrorModal();
				    		}
				    	};

		        		Dao.saveBugDescription(model.get('bug'),callbacks);

		      		});
		    	},
		    	canceleditdesc: function(){
		      		//Action function when user cancels edit description
		      		//Get model from controller
		      		var model = this.get('model');
		      		//Reset rollback text
		      		model.set('bug.description',model.get('bug.rollbackdesc'));
		      		model.set('bug.rollbackdesc',null);

		      		//Display editing subject
		      		model.toggleProperty('bug.editingdesc');

		    	},
		    	editsubject: function(){
		      		//Action function when user clicks to edit bug subject.
		      		//Get model from controller
		      		var model = this.get('model');
		      		Persona.requireLogin(function(){
		        		//Save rollback text
		        		model.set('bug.rollbacksubj',model.get('bug.subject'));

		        		//Show editing subject
		        		model.toggleProperty('bug.editingsubject');

		      		});
		    	},
		    	canceleditsubject: function(){
		      		//Action function which will cancel editing the subject
		      		//Get model from controller
		      		var model = this.get('model');
		      		//Save rollback text
		      		model.set('bug.subject',model.get('bug.rollbacksubj'));
		      		model.set('bug.rollbacksubj',null);

		      		//Display editing subject
		      		model.toggleProperty('bug.editingsubject');
		    	},
			    saveeditsubject: function(){
				    //Action function which will save editing the subject
				    //Get model from controller
				    var model = this.get('model');
				    Persona.requireLogin(function(){
				      	//Save rollback text
				        model.set('bug.rollback',null);

				        //Display editing subject
				        model.toggleProperty('bug.editingsubject');

				        //Display saving icon
				        model.toggleProperty('bug.savingsubject');

				        //Define callbacks
		        		var callbacks = {
		        			success : function(){
		        				model.toggleProperty('bug.savingsubject');
					      		model.set('bug.rollbacksubj',null);
		        			},
		        			error: function(bug){
		        				model.set('bug.subject',model.get('bug.rollbacksubj'));
					      		model.set('bug.rollbacksubj',null);
		        				Modals.showErrorModal();
		        			}
		        		};

		        		Dao.saveSubject(model.bug,callbacks);

				    });
			    },
		    	canceledit: function(comment){
		      		//Action function to cancel and undo the edit of a comment.

		      		//Get model from controller
		      		var model = this.get('model');

		      		//Create new editable instance
		      		var newComment = {
		        		comment: comment.rollback,
		        		date: comment.date,
		        		user: comment.user,
		        		editing: false,
		        		id: comment.id
		      		};

		      		//Remove from comments list and readd to redraw display
		      		for (var i = model.bug.comments.length - 1; i >= 0; i--) {
		        		if(model.bug.comments[i].id == comment.id){
		          			model.bug.comments.removeAt(i);
		          			model.bug.comments.insertAt(i,newComment);
		        		}
		      		};
		    	},
		    	editpriority: function(priority){
		      		//Action function to handle user selecting a priority for the current bug

		      		//Get model
		      		var model = this.get('model');
		      		Persona.requireLogin(function(){
		        		//Exit condition. If the priority isnt changed... we dont need to do anything
		        		if(model.bug.priority != null && model.bug.priority.label == priority.label){
		         			return;
		        		}

		        		//Because the class name is unbound we need to manually update it. :-(
		        		if(model.bug.priority != null){
		        			$('#bug-priority-display').removeClass('badge-' + model.bug.priority.css_class);
		        		}
		        		$('#bug-priority-display').addClass('badge-' + priority.css_class);

		        		//update the priority on the bug
		        		model.set('bug.rollbackpriority',model.get('bug.priority'));
		        		model.set('bug.priority',priority);

		        		//Define callbacks
		        		var callbacks = {
		        			success : function(){
		        				model.set('bug.rollbackpriority',null);
		        			},
		        			error : function(){
		        				model.set('bug.priority',model.get('bug.rollbackpriority'));
					      		model.set('bug.rollbackpriority',null);
		        				Modals.showErrorModal();
		        			}
		        		};

		        		Dao.savePriority(model.bug,callbacks);

		      		});
		    	},
		    	addlabel: function(label){
		      		//Action function for when a user clicks to add a label to a bug
		      		//Get model
		      		var model = this.get('model');
		      		Persona.requireLogin(function(){
		        		//Dont assign the same label twice.
		        		for (var i = model.bug.labels.length - 1; i >= 0; i--) {
		          			if(model.bug.labels[i].label == label.label){
		            			return;
		          			}
		        		};

		        		//Add label to bug
		        		model.bug.labels.addObject(label);

		        		//Remove label from dropdown
		        		model.labels.removeObject(label);

		        		//Define callbacks
		        		var callbacks = {
		        			success: function(){
		        				//Nothing to do.
		        			},
		        			error: function(label){
		        				model.bug.labels.removeObject(label);
		        				Modals.showErrorModal();
		        			}
		        		};

		        		Dao.addLabel(model.bug,label,callbacks);

		      		});
		    	},
		    	removelabel: function(label){
		      		//Action function for when a user clicks to remove a label from a bug

		     		//Get model
		      		var model = this.get('model');
		      		Persona.requireLogin(function(){
		        
		        		for (var i = model.bug.labels.length - 1; i >= 0; i--) {
		          			if(model.bug.labels[i].label == label.label){
		            			model.bug.labels.removeAt(i);
		          			}
		        		};

		        		//Define callbacks
		        		var callbacks = {
		        			success: function(){
		        				//Nothing to do.
		        			},
		        			error: function(label){
		        				model.bug.labels.addObject(label);
		        				Modals.showErrorModal();
		        			}
		        		};

		        		Dao.removeLabel(model.bug,label,callbacks);

		      		});
		    	}
		  	}
		});
	};
	return {
		init : init
	}
 });