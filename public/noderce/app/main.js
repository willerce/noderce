require.config({
  shim: {
    'underscore': {
      exports: '_'
    },
    'backbone': {
      deps: [
        'underscore',
        'jquery'
      ],
      exports: 'Backbone'
    }
  },
  paths: {
    jquery: './libs/jquery/jquery',
    underscore: './libs/underscore/underscore',
    backbone: './libs/backbone/backbone',
    doT: './libs/doT/doT',
    pagedown: './libs/pagedown/pagedown',
    text: './libs/require/text'
  }
});

require([
  'router'
], function (Workspace) {

  new Workspace({el: "#main"});

  // Initialize routing and start Backbone.history()
  Backbone.history.start();

});
