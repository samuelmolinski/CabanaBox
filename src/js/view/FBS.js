// https://www.facebook.com/cabanacriacao/app_230306400329884
// https://developers.facebook.com/x/apps/230306400329884/settings/

var app = app || {View:{}, Model:{}, Collection:{}};

/*
 *	Facebook Stuff - a helper file for the FB api
 */

app.View.FBS = Backbone.View.extend({

	connected: false,

	defaults : {       
	    appId      		: "230306400329884", // App ID from the App Dashboard
	    channelUrl 		: "//indicedenovosvalores.com.br/CompartilheValores/channel.html", // Channel File for x-domain communication
	    status      	: true,		// check the login status upon init?
	    cookie       	: true,		// set sessions cookies to allow your server to access the session?
	    xfbml			: true,		// parse XFBML tags on this page?
	    location		: "pt_BR",
	    debugMode		: false
	},

	initialize: function(options) {

		//lets extend
		this.options = jQuery.extend(this.defaults, options);
		$t = this;

		if (!this.options.debugMode) {
			//this.l.setLevel(0);
		}

		// windows callback for fb async
		window.fbAsyncInit = function() {
			// init the FB JS SDK
			FB.init({
			appId      : $t.options.appId, 
			channelUrl : $t.options.channelUrl, 
			status     : $t.options.status, 
			cookie     : $t.options.cookie, 
			xfbml      : $t.options.xfbml  
			});    
			// Additional initialization code such as adding Event Listeners goes here
			$t._facebookReady();
		};

		//add facebook all.js
		var js, id = 'facebook-jssdk', ref = document.getElementsByTagName('script')[0];
		if (document.getElementById(id)) {return;}
		js = document.createElement('script'); js.id = id; js.async = true;
		js.src = "//connect.facebook.net/"+this.options.location+"/all" + (this.debugMode ? "/debug" : "") + ".js";
		ref.parentNode.insertBefore(js, ref);
	},

	_facebookReady: function() {
		log("_facebookReady");
		$t = this;
		$t.resolveAuth();
		/*FB.api('/me', function(re){			
			log("FB.api('/me')", re);
		});*/
		FB.login(function(response) {
			log("login", response);		
			if (response.authResponse) {	
			   $t.connected = true;
			} else {	
			   $t.connected = false;
			}
				log("$t.connected", $t.connected);	
		});
	},

	resolveAuth : function (callback) {
		$t = this;
	
		//Check to see if the user has authenticated the App.
		FB.getLoginStatus(function(response) {
			log("getLoginStatus");
	
			if (response.status === 'connected') {
				log("	connected Sucess");
				$t.connected = true;	
			} else {
				log("	not connected");
				$t.connected = false;				
			}
		});
		if(callback){callback();}
	},
	resolveAdvanceAuth : function(hasPermissionFor, callback) {
		//Check to see if the user has authenticated the App.
		FB.ui({
		   method: 'permissions.request',
		   'perms': hasPermissionFor,
		   'display': 'popup'
		  },
		  function(response) {
		  	log("FB.ui permission "+hasPermissionFor,response)
		  }
		);
	}
});