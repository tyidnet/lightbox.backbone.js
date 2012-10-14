/*global _: true, Backbone: true */

;(function($, exports, undefined) {

  //|
  //| Lightbox
  //|
  var LightboxView = exports.LightboxView = Backbone.View.extend({
    tagName: "div",

    initialize: function(options) {
      // Img container
      this.$el
        .css(LightboxView.LIGHTBOX_CSS)
        .appendTo(document.body);

      // Background overlay
      this.$background = $("<div>")
        .css(LightboxView.BACKGROUND_CSS)
        .css({
          width: $(window).width(),
          height: $(window).height()
        })
        .appendTo(document.body);

      // Meta data container
      this.$infoContainer = $("<div>")
        .css(LightboxView.INFO_CONTAINER_CSS)
        .appendTo(this.el);

      // Meta data elements
      this.$info = $("<div>")
        .css(LightboxView.INFO_CSS)
        .appendTo(document.body);
      this.$title = $("<h1>")
        .css(LightboxView.TITLE_CSS)
        .appendTo(this.$infoContainer);
      this.$description = $("<div>")
        .css(LightboxView.DESCRIPTION_CSS)
        .appendTo(this.$infoContainer);

      // Close button
      this.$close = $("<div>")
        .css(LightboxView.CLOSE_CSS)
        .appendTo(document.body);

      this.setupEvents();
    },

    setupEvents: function() {
      var self = this;

      // Events for toggling meta data
      this.$el.click(function() { self.toggleInfo(); });
      this.$info.click(function() { self.toggleInfo(); });

      // Events for hiding lightbox
      this.$background.click(function() { self.hide(); });
      this.$close.click(function() { self.hide(); });

      // Keypress event for hiding lightbox
      $(document).keydown(function(event) {
        if ( event.which === 27 ) {
          self.hide();
          return false;
        }
      });
    },

    render: function(options) {
      // options: width, height, src, title, description
      _.each(["src", "width", "height"], function(i) {
        if ( ! _.has(options, i) )
          throw new Error("LightboxView.render(): parameters must include '"+i+"'");
      });

      // Remove any old loading spinners
      this.cleanup();

      // Show loading spinner
      this.showSpinner(options.width, options.height);

      var left  = $(window).width() / 2 - options.width / 2,
          right = $(window).width() / 2 + options.width / 2,
          top   = $(window).height() / 2 - options.height / 2;

      // Set image and dimensions
      this.$img = $("<img>")
        .attr("src", options.src)
        .css({
          width: options.width+"px",
          height: options.height+"px"
        })
        .hide()
        .appendTo(this.el);

      this.$el.css({
        left: left+"px",
        top: top+"px",
        width: options.width+"px",
        height: options.height+"px"
      });
      this.$close.css({
        left: (right + 14)+"px",
        top: (top - 3)+"px"
      });
      this.$info.css({
        left: (right + 14)+"px",
        top: (top + 20)+"px"
      });

      // Show overlay
      this.$background.fadeIn();
      this.$close.fadeIn();
      this.$info.fadeIn();
      this.$el.fadeIn();

      // Set overlay info text
      this.$title.text(( ! _.has(options, "title") ) ? "" : options.title);
      this.$description.html(( ! _.has(options, "description") ) ? "" : options.description);

      // Recheck periodically if overlay image is finished loading.  Hide
      // loading animation if so.
      var self = this;
      var loadCheckerId = setInterval(function() {
        if ( self.$img[0].complete ) {
          self.hideSpinner();
          clearInterval(loadCheckerId);
        }
      }, 100);
    },

    /**
     * Hide lightbox.
     */
    hide: function() {
      var self = this;

      this.$el.fadeOut(function() { self.cleanup(); });
      this.$close.fadeOut();
      this.$info.fadeOut();
      this.$infoContainer.fadeOut();
      this.$background.fadeOut();
    },

    /**
     * Remove lightbox resources.
     */
    cleanup: function() {
      // Remove spinner if found
      if ( this.$spinner !== undefined ) {
        this.$spinner.remove();
        this.$spinnerMessage.remove();
        this.$spinner = undefined;
        this.$spinnerMessage = undefined;
      }

      // Remove img if found
      if ( this.$img !== undefined ) {
        this.$img.remove();
        this.$img = undefined;
      }
    },

    /**
     * Show loading spinner.
     */
    showSpinner: function(width, height) {
      this.$spinner = $("<div>")
        .prependTo(this.el);
      this.$spinner
        .spin({ length: 15, radius: 20 })
        .css({ left: width / 2, top: height / 2 - 15 });
      this.$spinnerMessage = $("<div>")
        .css(LightboxView.MESSAGE_CSS)
        .text("Loading...")
        .css({ width: '100px', left: width / 2 - 50, top: height / 2 + 45 })
        .prependTo(this.el);
    },

    /**
     * Hide loading spinner.
     */
    hideSpinner: function() {
      var self = this;

      this.$spinner.spin().fadeOut(function() {
        self.$spinner.remove();
      });
      this.$spinnerMessage.fadeOut(function() {
        self.$spinnerMessage.remove();
        self.$img.fadeIn();
      });
    },

    /**
     * Toggle display of meta data.
     */
    toggleInfo: function() {
      this.$infoContainer.fadeToggle();
    }
  });

  LightboxView.LIGHTBOX_CSS = {
    "display": "none",
    "cursor": "help",
    "position": "absolute",
    "z-index": "9999",
    "background": "black",
    "box-shadow": "0 0 30px #131313",
    "overflow": "hidden"
  };

  LightboxView.BACKGROUND_CSS = {
    "display": "none",
    "cursor": "pointer",
    "position": "absolute",
    "left": "0",
    "top": "0",
    "z-index": "9998",
    "background": "#252525"
  };

  LightboxView.CLOSE_CSS = {
    "display": "none",
    "background-image": "url('/static/lightbox/close.png')",
    "position": "absolute",
    "z-index": "10000",
    "cursor": "pointer",
    "height": "22px",
    "width": "22px",
    "opacity": "0.7"
  };

  LightboxView.INFO_CSS = {
    "display": "none",
    "background-image": "url('/static/lightbox/info.png')",
    "position": "absolute",
    "z-index": "10000",
    "cursor": "help",
    "height": "22px",
    "width": "22px",
    "opacity": "0.7"
  };

  LightboxView.INFO_CONTAINER_CSS = {
    "display": "none",
    "position": "absolute",
    "padding": "5px 8px",
    "right": "0",
    "bottom": "0",
    "text-align": "right",
    "opacity": "0.7",
    "background": "rgba(0,0,0,0.65)",
    "border-radius": "2px 0 0 0"
  };

  LightboxView.TITLE_CSS = {
    "font-family": "Helvetica, sans-serif",
    "font-size": "20px",
    "margin": "3px",
    "text-shadow": "-1px 0 2px black, 1px 0 2px black, 0 -1px 2px black, 0 1px 2px black"
  };

  LightboxView.DESCRIPTION_CSS = {
    "font-size": "15px",
    "text-shadow": "-1px 0 2px black, 1px 0 2px black, 0 -1px 2px black, 0 1px 2px black"
  };

  LightboxView.MESSAGE_CSS = {
    "position": "absolute",
    "text-align": "center",
    "text-transform": "uppercase"
  };

})(jQuery, window);
