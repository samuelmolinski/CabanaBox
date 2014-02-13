describe("Loader", function() {
  var loader;
  var doc;

  afterEach(function() {
    loader.remove();
  });

  describe("default rendering", function() {
    beforeEach(function() {
      loader = new app.View.Loader();
    });

    it("add a default Overlay", function() {
      expect($('#'+loader.options.elId).length).not.toEqual(0);
    });

    it("add a default Container", function() {
      expect($('#'+loader.options.tmpHTMLId).length).not.toEqual(0);
    });

    it("add a container loads default content", function() {
      expect($('#'+loader.options.tmpHTMLId).html().toString().length).not.toEqual(0);
    }); 
  }); 

  describe("Checking in and checking out of activities:", function() {

    var c = parseInt(Math.random(0, 1)*10);

    beforeEach(function() {
      loader = new app.View.Loader();      
    });

    it("Check default checkins", function() {
      expect(loader.checkins).toEqual(0);
    });

    it("increment checkins", function() {
      loader.checkIn();
      expect(loader.checkins).toEqual(1); 
    });

    it("increment checkins by random n ("+c+")", function() {
      loader.checkIn(c);
      expect(loader.checkins).toEqual(c); 
    });

    it("deincrement checkins", function() {
      //log("checkins",loader.checkins);
      loader.checkIn(2);
      loader.checkOut();
      expect(loader.checkins).toEqual(1); 
    }); 

    it("deincrement checkins by random n ("+c+")", function() {
      loader.checkIn(c);
      loader.checkOut(c);
      expect(loader.checkins).toEqual(0); 
    });

    it("if deincrement checkins is less than 0, reset to 0", function() {
      loader.checkOut(c);
      expect(loader.checkins).toEqual(0); 
    });
  });

  describe("Checking the callback functions:", function() {
    var currentfunction = "";    
    
    beforeEach(function() {
      currentfunction = "";            
    });

    afterEach(function() {
      loader.remove();
    });

    it("beforeShow is executed", function() {
      loader = new app.View.Loader({
        beforeShow:function() {
          currentfunction = "beforeShow";
        }
      });
      loader.show();
      //loader.hide();
      expect(currentfunction).toEqual("beforeShow");
    });

    it("afterShow is executed", function() {
      loader = new app.View.Loader({
        afterShow:function() {
          currentfunction = "afterShow";
        }
      });
      loader.show();
      //loader.hide();
      expect(currentfunction).toEqual("afterShow");
    });

    it("beforeHide is executed", function() {
      loader = new app.View.Loader({
        beforeHide:function() {
          currentfunction = "beforeHide";
        }
      });
      loader.show();
      loader.hide();
      expect(currentfunction).toEqual("beforeHide");
    });

    it("afterHide is executed", function() {
      loader = new app.View.Loader({
        afterHide:function() {
          currentfunction = "afterHide";
        }
      });
      loader.show();
      loader.hide();
      expect(currentfunction).toEqual("afterHide");
    });
  });

  describe("Checking custom elements", function() {
    $("body").append("<div id='newOverlay' class='newOverlay'></div>");

    beforeEach(function() {
      currentfunction = "";
      //$("body").append("<div id='newOverlay' class='newOverlay'></div>");
    });

    afterEach(function() {
      //loader.remove();
    });   

    it("add a custom Overlay", function() {
      loader = new app.View.Loader({
        el: $("#newOverlay"),
        elId: "newOverlay"
      });
      expect($('#newOverlay').length).not.toEqual(0);
    });

    it("add a custom Container", function() {      
      loader = new app.View.Loader({
        tmpHTML: "<div id='cb_loader-content'></div>",
        tmpHTMLId: "newOverlay"
      });
      expect($('#newOverlay').length).not.toEqual(0);
    });

    it("add a container loads custom content", function() {
      expect($('#'+loader.options.tmpHTMLId).html().toString().length).not.toEqual(0);
    });
  });
});
