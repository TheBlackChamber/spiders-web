define(['ember','modules/handlebars-helpers','moment','modules/bugs','modules/CommentEditorComponent','modules/persona','modules/modals','lesscss','autoresize'], function(Ember,HandleBarsHelpers,Moment,Bugs,CommentEditorComponent,Persona,Modals) {
	var App;

	var startApplication = function(n) {
    	//Create ember application
    	App = Ember.Application.create({});
    	HandleBarsHelpers.init();

    	//Define application routes
		App.Router.map(function() {
		  this.resource('bugs',{ path: "/" });
		  this.resource('bug',{ path: '/bug/:bug_id' });
		});

    	App.LoadingRoute = Ember.Route.extend({});

		//Generic Bug Page model. This is for pages which display a particular bug
		BugModel = Ember.Object.extend({
		  showloading:null,
		  bug:null,
		  newcomment:null
		});

		CommentEditorComponent.init(App);
		Bugs.init(App);
		Persona.init();
  	};
  	return {
    	startApplication: startApplication
  	};
});