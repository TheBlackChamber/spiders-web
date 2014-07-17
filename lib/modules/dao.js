define(['jquery','underscore'],function($,_){

	/*
	 * Function which will fetch a bug list from the restful webservice api.
	 */
	var fetchBugList = function(model,api,filter){
		model.set('showloading', true);
		model.set('buglist',[]);
		$.ajax({
			dataType: "json",
			data:filter,
			url: 'rest/' + api,
			success: function(data){

				//Load issues from response into bug list
				for (var i = data.length - 1; i >= 0; i--) {
					model.get('buglist').addObject(data[i]);
				};

				//Hide the loading pane
				model.set('showloading', false);
			}
			//TODO Error handling
		});
	};

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

			}
			//TODO Error Handling
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
      			callbacks.errCallBack();
      		}
    	});
	}

	var fetchProjectList = function(model,api){
		$.ajax({
      		dataType: "json",
      		url: 'rest/' + api,
      		success: function(data){

          		//Load projects from response into project list
          		for (var i = 0; i < data.length; i++) {
          			model.get('projectlist').addObject(data[i]);
          		};

          		//HIde the loading pane
          		model.set('showprojloading', false);
      		}
        	//TODO ERROR HANDLING
    	});
	};

	return {
		fetchBugList : fetchBugList,
		fetchBug : fetchBug,
		fetchProjectList : fetchProjectList,
		createProject : createProject
	};

});