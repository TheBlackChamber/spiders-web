define(['jquery','underscore','modules/modals'],function($,_,Modals){

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
					model.get('buglist').addObject(data[i]);
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
		createProject : createProject
	};

});