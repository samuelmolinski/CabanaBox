var app = app || {View:{}, Model:{}, Collection:{}};

/*
 *	Facebook Stuff - a helper file for the FB api
 */

app.View.FBS = Backbone.View.extend({

	defaults : {       
	    appId      		: "230306400329884",
	    channelUrl 		: "//indicedenovosvalores.com.br/CompartilheValores/channel.html",
	    status      	: true,
	    cookie       	: true,
	    xfbml			: true,
	    location		: "pt_BR",
	    debugMode		: ""
	},

	initialize: function(options) {

		//lets extend
		this.options = jQuery.extend(this.defaults, options);
	}
});