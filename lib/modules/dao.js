define(['jquery','underscore','modules/modals','modules/persona'],function($,_,Modals,Persona){


	/*
	 * Function which will assign a bug to the logged in user.
	 */
	var takeBug = function(bug,callbacks){
		
		var obj = {
			bugid:bug.id
		};

		$.ajax({
			dataType:"json",
			url: 'rest/takebug.php',
			data:obj,
			success: function(response){
				callbacks.successCallBack();
			},
			error: function(err,code,exception){
				callbacks.errorCallback(bug);
			}
		});

	};

	/*
	 * Function which will assign a bug to the logged in user.
	 */
	var returnBug = function(bug,callbacks){
		
		var obj = {
			bugid:bug.id
		};

		$.ajax({
			dataType:"json",
			url: 'rest/returnbug.php',
			data:obj,
			success: function(response){
				callbacks.successCallBack();
			},
			error: function(err,code,exception){
				callbacks.errorCallback(bug);
			}
		});

	};

	/*
	 * Function which will save the priority of a bug.
	 */
	var savePriority = function(bug,callbacks){
		
		var obj = {
			bugid:bug.id,
			priorityid:bug.priority.id
		};

		$.ajax({
			dataType:"json",
			url: 'rest/savepriority.php',
			data:obj,
			success: function(response){
				callbacks.success();
			},
			error: function(err,code,exception){
				callbacks.error(bug);
			}
		});

	};

	/*
	 * Function which will save the priority of a bug.
	 */
	var removeLabel = function(bug,label,callbacks){
		
		var obj = {
			bugid:bug.id,
			labelid: label.id
		};

		$.ajax({
			dataType:"json",
			url: 'rest/removelabel.php',
			data:obj,
			success: function(response){
				callbacks.success();
			},
			error: function(err,code,exception){
				callbacks.error(label);
			}
		});

	};

	/*
	 * Function which will save the priority of a bug.
	 */
	var addLabel = function(bug,label,callbacks){
		
		var obj = {
			bugid:bug.id,
			labelid: label.id
		};

		$.ajax({
			dataType:"json",
			url: 'rest/addlabel.php',
			data:obj,
			success: function(response){
				callbacks.success();
			},
			error: function(err,code,exception){
				callbacks.error(label);
			}
		});

	};

	/*
	 * Function which will save the subject of a bug.
	 */
	var saveSubject = function(bug,callbacks){
		
		var obj = {
			bugid:bug.id,
			subject:bug.subject
		};

		$.ajax({
			dataType:"json",
			url: 'rest/savesubject.php',
			data:obj,
			success: function(response){
				callbacks.success();
			},
			error: function(err,code,exception){
				callbacks.error(bug);
			}
		});

	};

	/*
	 * Function which will fetch a bug list from the restful webservice api.
	 */
	var fetchBugList = function(model,filter){
		model.set('showloading', true);
		model.set('buglist',[]);
		$.ajax({
			dataType: "json",
			data:filter,
			url: 'rest/bugslist.php',
			success: function(data){

				//Load issues from response into bug list
				for (var i = data.length - 1; i >= 0; i--) {
					var obj = data[i];
					var bug = Ember.Object.create({});
					for (var prop in obj) {
				      	// important check that this is objects own property 
				      	// not from prototype prop inherited
				      	if(obj.hasOwnProperty(prop)){
				        	bug.set(prop,obj[prop]);
				    	}
				   	}
					var usr = Persona.getLoggedInUser();
					if(usr != null){
						var loggeduser = usr.email.substring(0,usr.email.indexOf('@'));
						bug['ismine'] = (loggeduser == bug.assigned);
					}
					model.get('buglist').addObject(bug);
				};

				//Hide the loading pane
				model.set('showloading', false);
			},
			error: function(err,code){
				model.set('showloading', false);
				console.log(err);
				console.log(code);
				Modals.showErrorModal();
			}
		});
	};

	/**
	  * Function which will be used to populate the labels
	  * field of a model from the server.
	  * Eg: model.labels
	  */
	function populateLabels(model){

	  model.set('labels',null);

	  jQuery.ajax({
	    dataType: "json",
	    url: 'rest/labels.php',
	    success: function(data){
	      model.set('labels',data);
	    }
	    //TODO Error Handling
	  });

	}

	/**
	  * Function which will be used to populate the priorities
	  * field of a model from the server.
	  * Eg: model.properties = [];
	  */
	function populatePriorities(model){
	  
	  model.set('priorities',null);

	  jQuery.ajax({
	    dataType: "json",
	    url: 'rest/priorities.php',
	    success: function(data){
	      model.set('priorities',data);
	    },
		error: function(err,code){
			console.log(err);
			console.log(code);
			Modals.showErrorModal();
		}
	  });

	}

	/*
	 * Function which will cause a bug to be added to the database.
	 */
	function createBug(bug,callbacks){

		var labels_arr = [];
		_.each(bug.labels,function(element,index){
			labels_arr.push(element.id);
		});

		var priority = null;
		if(bug.priority){
			priority = bug.priority.id;
		}

		var smbug = {
			project : bug.project.key,
			priority : priority,
			subject: bug.subject,
			labels: JSON.stringify(labels_arr)
		};

		$.ajax({
      		dataType: "json",
      		data: smbug,
      		url: 'rest/createbug.php',
      		success: function(data){
          		callbacks.successCallBack(data);
      		},
      		error: function(err,text,exception){
      			callbacks.errCallBack(bug);
      		}
    	});
	}

	/*
	 * Function which will fetch a bug list from the restful webservice api.
	 */
	var fetchBug = function(model,bugid){
		model.set('showloading', true);
		model.set('bug',null);
		jQuery.ajax({
			dataType: "json",
			data:{id:bugid},
			url: 'rest/bug.php',
			success: function(data){
      			if(!data.comments){
        			data.comments = [];
      			}
				model.set('bug',data);
				model.set('showloading', false);
      			if(model.get('bug.status') == 'Open'){
        			model.set('bug.isopen',true);
      			}else{
        			model.set('bug.isopen',false);
      			}

      			var usr = Persona.getLoggedInUser();
				if(usr != null){
					var loggeduser = usr.email.substring(0,usr.email.indexOf('@'));
					var assigned = model.get('bug.assigned');
					model.set('bug.ismine',(loggeduser == assigned));
				}

			},
			error: function(err,code){
				model.set('showloading', false);
				console.log(err);
				console.log(code);
				Modals.showErrorModal();
			}
		});
	};

	/*
	 * Function which will call the server and create a new project
	 */
	var createProject = function(data,callbacks){
		$.ajax({
      		dataType: "json",
      		data: data,
      		url: 'rest/createproject.php',
      		success: function(data){
          		callbacks.successCallBack();
      		},
      		error: function(err,text,exception){
      			console.log('Err: ' + err);
      			console.log('Text: ' + text);
      			console.log('Exception: ' + exception);
      			callbacks.errCallBack();
      		}
    	});
	}

	var fetchProjectList = function(model){
		$.ajax({
      		dataType: "json",
      		url: 'rest/projectlist.php',
      		success: function(data){

          		//Load projects from response into project list
          		for (var i = 0; i < data.length; i++) {
          			model.get('projectlist').addObject(data[i]);
          		};

          		//HIde the loading pane
          		model.set('showprojloading', false);
      		},
			error: function(err,code){
				model.set('showprojloading', false);
				console.log(err);
				console.log(code);
				Modals.showErrorModal();
			}
    	});
	};

	return {
		fetchBugList : fetchBugList,
		fetchBug : fetchBug,
		fetchProjectList : fetchProjectList,
		createProject : createProject,
		populateLabels : populateLabels,
		populatePriorities : populatePriorities,
		createBug : createBug,
		takeBug : takeBug,
		saveSubject : saveSubject,
		savePriority : savePriority,
		addLabel : addLabel,
		removeLabel : removeLabel,
		returnBug : returnBug
	};

});