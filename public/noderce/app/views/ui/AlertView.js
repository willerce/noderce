define([
  'doT',
  'text!templates/ui/alert.html'
], function (doT, alertTemplate) {
  "use strict";

  var AlertView = Backbone.View.extend({
    template: doT.template(alertTemplate),
    initialize: function () {
      this.render();
      this.timeoutClose()
    },

    render: function () {
      this.$el.html(this.template({type: this.options.type, message: this.options.message}));
      return this;
    },

    timeoutClose: function () {
      var _this = this;
      setTimeout(function () {
        _this.$el.fadeOut("slow", function () {
          _this.remove();
        });
      }, 2000);
      return this;
    }

  });

  return AlertView;

});