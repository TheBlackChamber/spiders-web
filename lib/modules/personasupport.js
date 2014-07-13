define(['persona'],function(Persona){
	var init = function(){
		var nav = navigator;
		var nav2 = Persona.navigator;
		//Bind click action on login\logout links
		$('#loginlink').click(function(e){
		  	e.preventDefault();
		  	navigator.id.request();
		});
		$('#login-required-modal-login').click(function(e){
		  	e.preventDefault();
		  	navigator.id.request();
		});
		$('#logoutlink').click(function(e){
		  	navigator.id.logout();
		  	e.preventDefault();
		});
	}
});