var app = app || {View:{}, Model:{}, Collection:{}};

app.View.Loader = Backbone.View.extend({

    //el: $('#cb_loader-overlay'),
    template: null,

    defaults : {       
        el              : $('#cb_loader-overlay'),
        elId            : "cb_loader-overlay",
        tmpHTML         : "<div id='cb_loader-content'></div>",
        tmpHTMLId       : "cb_loader-content",
        tmpContent      : "<img src='../src/img/loader.gif' />",
        tmpHTMLCSS      : {
                            "width": "100%",
                            "height": "100%",
                            "background": "rgba(255, 255, 255, 0.95)", /* browsers */
                            "filter": "progid:DXImageTransform.Microsoft.gradient(GradientType=0, startColorstr='#F0ffffff', endColorstr='#F0ffffff')", /* IE */
                            "position": "absolute",
                            "top": 0,
                            "left": 0,
                            "z-index": 99999,
                            //"display": "none",
                          },
        tmpContentCSS   : {
                            "text-align": "center",
                            "padding-top": "4em",
                            "font-size": "2em",                            
                            "width": "100%",
                            "height": "100%",
                          },
        model           : null,
        duration        : 1000,
        beforeShow      : function() {},
        afterShow       : function() {},
        beforeHide      : function() {},
        afterHide       : function() {}
    },

    checkins: 0,
    events: {},

    initialize: function(options) {
        log("===================================");
        log("Loader.initialize()");

        this.options = jQuery.extend(this.defaults, options);        
        this.el = this.options.el;
        
        if($("#"+this.options.elId).length == 0) {
            $('body').append("<div id='"+this.options.elId+"'></div>");
            this.el = $("#"+this.options.elId)[0];
            this.$el = $("#"+this.options.elId);
        }

        this.render();
    },

    render: function(){
        log("Loader.render()");

        this.$el.html(this.options.tmpHTML).css(this.options.tmpHTMLCSS);
        log('$("#"+this.options.tmpHTMLId)', $("#"+this.options.tmpHTMLId));
        $("#"+this.options.tmpHTMLId).html(this.options.tmpContent).css(this.options.tmpContentCSS);
    },

    updateContent: function(content) {

    },

    checkOut: function(i) {
        log("Loader.checkOut()");
        this.checkIns = i || 1;
        if(i!=undefined){
            this.checkins-=i;
        } else {
            this.checkins--;
        }

        if(this.checkins <= 0) {
            this.checkins = 0;
            this.hide();
        }
    },

    checkIn: function(i) {
        log("Loader.checkIn()");
        if(i!=undefined){
            this.checkins+=i;
        } else {
            this.checkins++;
        }
        this.show();
    },

    _hide: function () {
        log("Loader.hide()");
        this.options.beforeHide();   
        this.$el.fadeOut(this.duration, this.options.afterHide());
    },

    _show: function() {
        log("Loader.show()");
        this.options.beforeShow();        
        this.$el.fadeIn(this.duration, this.options.afterShow());
    }
});