/*
 * JavaScript Debug - v0.4 - 6/22/2010
 * http://benalman.com/projects/javascript-debug-console-log/
 * 
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 * 
 * With lots of help from Paul Irish!
 * http://paulirish.com/
 */
window.debug=(function(){var i=this,b=Array.prototype.slice,d=i.console,h={},f,g,m=9,c=["error","warn","info","debug","log"],l="assert clear count dir dirxml exception group groupCollapsed groupEnd profile profileEnd table time timeEnd trace".split(" "),j=l.length,a=[];while(--j>=0){(function(n){h[n]=function(){m!==0&&d&&d[n]&&d[n].apply(d,arguments)}})(l[j])}j=c.length;while(--j>=0){(function(n,o){h[o]=function(){var q=b.call(arguments),p=[o].concat(q);a.push(p);e(p);if(!d||!k(n)){return}d.firebug?d[o].apply(i,q):d[o]?d[o](q):d.log(q)}})(j,c[j])}function e(n){if(f&&(g||!d||!d.log)){f.apply(i,n)}}h.setLevel=function(n){m=typeof n==="number"?n:9};function k(n){return m>0?m>n:c.length+m<=n}h.setCallback=function(){var o=b.call(arguments),n=a.length,p=n;f=o.shift()||null;g=typeof o[0]==="boolean"?o.shift():false;p-=typeof o[0]==="number"?o.shift():n;while(p<n){e(a[p++])}};return h})();
//http://developers.facebook.com/docs/reference/javascript/FB.ui/	
window.fbAsyncInit = function() {
	// init the FB JS SDK
	FB.init({
	appId      : '230306400329884', // App ID from the App Dashboard
	channelUrl : '//indicedenovosvalores.com.br/CompartilheValores/channel.html', // Channel File for x-domain communication
	status     : true, // check the login status upon init?
	cookie     : true, // set sessions cookies to allow your server to access the session?
	xfbml      : true  // parse XFBML tags on this page?
	});    
	// Additional initialization code such as adding Event Listeners goes here    
};

// Load the SDK's source Asynchronously
// Note that the debug version is being actively developed and might 
// contain some type checks that are overly strict. 
// Please report such bugs using the bugs tool.
(function(d, debug){
	var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
	if (d.getElementById(id)) {return;}
	js = d.createElement('script'); js.id = id; js.async = true;
	js.src = "//connect.facebook.net/pt_BR/all" + (debug ? "/debug" : "") + ".js";
	ref.parentNode.insertBefore(js, ref);
	}(document, /*debug*/ false));
	///

///
var FacebookResolve = (function() {
//private

	var queryAuths = function (userID, accessToken, listenerFunction){
		var uid          = userID;
		var access_token = accessToken;		
		//check And Publish	   		
		log("queryAuths");
		FB.api({
			method: 'fql.query',
			query: 'select publish_stream from permissions where uid=me()'
		},function(response) {
			log("queryAuths response", JSON.stringify(response));
			if (response) {					
				if(response[0].publish_stream == "1"){
					//setTimeout(top.location.href = "./", 1000);
				}
				else{
					showErrorOrSuccess("Desculpe, mas você precisa completar o processo de autorização.", listenerFunction);
					/*FB.logout(function(response) {
					 	//window.location.reload();
					});*/	

				}				
		   }else{
			   showErrorOrSuccess("A publicação falhou. Por favor tente novamente.", listenerFunction);
		   };
			
		});
		/////////
	}
	//
	var showErrorOrSuccess = function(errorMessage, listenerFunction){
		console.log("errorMessage", errorMessage);
		if(listenerFunction) {
			istenerFunction(false, null, null, errorMessage);
		}
		
	}


return {
	resolve : function (listenerFunction) {
	
		//Check to see if the user has authenticated the App.
		FB.getLoginStatus(function(response) {
			console.log("getLoginStatus");
	
			if (response.status === 'connected') {
				console.log("	connected Sucess");
				
				//queryAuths(response.authResponse.userID, response.authResponse.accessToken, listenerFunction);
	
			} else {
	
				//If they haven't, call the FB.login method
				console.log("	not connected");
				FB.login(function(response) {
					console.log("		login", response);
	
					if (response.authResponse) {
	
					   queryAuths(response.authResponse.userID, response.authResponse.accessToken, listenerFunction);
					   
					} else {
						showErrorOrSuccess("Você precisa autorizar a aplicação para participar.", listenerFunction);
					}
				}, {scope: 'publish_stream, user_photos'});
			}
		});
	},
	resolveBasic : function (listenerFunction) {
	
		//Check to see if the user has authenticated the App.
		FB.getLoginStatus(function(response) {
			log("resolveBasic getLoginStatus");
	
			if (response.status === 'connected') {
				log("	connected");
	
			} else {
	
				//If they haven't, call the FB.login method
				log("	not connected");
				FB.login(function(response) {
					log("		login", response);
	
					if (response.authResponse) {
	
					   queryAuths(response.authResponse.userID, response.authResponse.accessToken, listenerFunction);
					   
					} else {
						showErrorOrSuccess("Você precisa autorizar a aplicação para participar.", listenerFunction);
					}
				});
			}
		});
	},

	resolveAdvance : function (listenerFunction) {
	
		//Check to see if the user has authenticated the App.
		FB.ui({
			   method: 'permissions.request',
			   'perms': 'publish_stream',
			   'display': 'popup'
			  },
			  function(response) {
			  	log("RESPONSE",response)
			  }
			);
	}
//end of return public	
};
	
})();