define(['jquery','ember','autoresize'],function($,Ember){

	var init = function(App){
		App.CommentEditorComponent = Ember.Component.extend({
			autosizeTextarea: function() {
			    //Get Unused editor & Preview id
			    var num = 10;
			    while($('#editor_'+num).length != 0){
			      num = Math.floor((Math.random() * (10000 - 10)) + 10);
			    }

			    //Update Editor Tab and Pane
			    $('#editor').attr('id','editor_'+num);
			    $('#editorlink').attr('href','#editor_'+num);
			    $('#editorlink').removeAttr('id');

			    //Update Preview Tab and Pane
			    $('#previewer').attr('id','previewer_'+num);
			    $('#previewerlink').attr('href','#previewer_'+num);
			    $('#previewerlink').removeAttr('id');

			    $('.autosizedchild > textarea').autosize();

		  	}.on('didInsertElement')
		});
	};

	return {
		init : init
	};

});