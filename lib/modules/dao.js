define(['jquery'],function($){

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

	var fetchProjectList = function(model,api){
		$.ajax({
      		dataType: "json",
      		url: 'rest/' + api,
      		success: function(data){
          		//Load projects from response into project list
          		for (var i = data.length - 1; i >= 0; i--) {
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
		fetchProjectList : fetchProjectList
	};

});