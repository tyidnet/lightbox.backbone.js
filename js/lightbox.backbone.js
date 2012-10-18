/*global _: true, Backbone: true */

/**
 * A Lightbox using jQuery and Backbone.js.
 *
 * dependencies:
 * jQuery and jQuery UI
 * Underscore.js and Backbone.js
 * spin.js and spin.jquery.js
 */

;(function($, exports, undefined) {

  var LightboxView = exports.LightboxView = Backbone.View.extend({
    tagName: "div",

    events: {
      "click" : "toggleInfo"
    },

    initialize: function(options) {
      // Img container
      this.$el
        .addClass("lightbox")
        .appendTo(document.body);

      // Background overlay
      this.$background = $("<div>")
        .addClass("lightbox-background")
        .css({
          width: $(window).width(),
          height: $(window).height()
        })
        .appendTo(document.body);

      // Meta data container
      this.$infoContainer = $("<div>")
        .addClass("lightbox-info-container")
        .appendTo(this.el);

      // Meta data elements
      this.$info = $("<div>")
        .addClass("lightbox-info")
        .appendTo(document.body);
      this.$title = $("<h1>")
        .addClass("lightbox-title")
        .appendTo(this.$infoContainer);
      this.$description = $("<div>")
        .addClass("lightbox-description")
        .appendTo(this.$infoContainer);

      // Close button
      this.$close = $("<div>")
        .addClass("lightbox-close")
        .appendTo(document.body);

      this.extraEvents();
    },

    extraEvents: function() {
      var self = this;

      // Events for toggling meta data
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
        .addClass("lightbox-spinner-message")
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

})(jQuery, window);
