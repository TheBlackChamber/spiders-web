if (typeof console == "undefined") {
	window.console = {
	    log: function () {}
	};
}
requirejs.config({
    "baseUrl": "lib",
    "paths": {
      ember: ["//cdnjs.cloudflare.com/ajax/libs/ember.js/1.6.0/ember","ember-1.6.0"],
      handlebars: ["//cdnjs.cloudflare.com/ajax/libs/handlebars.js/1.3.0/handlebars","handlebars-1.3.0"],
      jquery: ["//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min","jquery-2.1.1.min"],
      lesscss: ["//cdnjs.cloudflare.com/ajax/libs/less.js/1.3.3/less.min","less-1.3.3.min"],
      domready: ["//cdnjs.cloudflare.com/ajax/libs/require-domReady/2.0.1/domReady.min","domReady-2.0.1.min"],
      showdown: ["//cdnjs.cloudflare.com/ajax/libs/showdown/0.3.1/showdown.min","showdown-0.3.1.min"],
      moment: ["//cdnjs.cloudflare.com/ajax/libs/moment.js/2.1.0/moment.min","moment-2.1.0.min"],
      bootstrap: ["//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.2.0/js/bootstrap.min","bootstrap-3.2.0.min"],
      autoresize: "jquery.autosize-1.18.4",
      personasupport: "https://login.persona.org/include",
      jquerycookie: ["//cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.0/jquery.cookie.min","jquery.cookie-1.4.0.min"],
      spinjs: ["//cdnjs.cloudflare.com/ajax/libs/spin.js/2.0.1/spin.min","spin-2.0.1.min"],
      underscore: ["//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.6.0/underscore-min","underscore-1.6.0.min"]
    },
    "shim": {
    	handlebars : {
    		exports: "Handlebars"
    	},
    	ember : {
    		deps: ["handlebars","jquery"],
    		exports: "Ember"
    	},
    	showdown: {
    		exports: "Showdown"
    	},
    	bootstrap: {
    		exports: "Bootstrap"
    	},
    	autoresize : {
    		deps : ["jquery"]
    	},
    	jquerycookie : {
    		deps: ["jquery"]
    	},
      spinjs : {
        exports: "Spinner"
      }
    }
});
require(['jquery','modules/spidersweb','domready'], function($,spidersweb,domReady) {
	domReady(function () {
      $("#loading-div-background").css({ opacity: 0.8 });
    	spidersweb.startApplication();
  	});
});
