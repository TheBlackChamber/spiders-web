define(['ember','showdown','moment'],function(Ember,Showdown,Moment){
	var init = function(){
		var showdown = new Showdown.converter();

		Ember.Handlebars.helper('format-markdown', function(input) {
		  if(input){
		    return new Handlebars.SafeString(showdown.makeHtml(input));
		  }else{
		    return '';
		  }
		});

		Ember.Handlebars.helper('format-date', function(date) {
		  if(date){
			 return Moment(date).fromNow();
			}else{
		    return '';
		  }
		});
	};
	return {
		init: init
	}
});