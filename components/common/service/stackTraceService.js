/* globals appServices */

appServices.factory('StackTraceService', function($http) {
  
  var stackTraceService = {
    print: function() {
      var e = new Error('dummy');
      var stack = e.stack.replace(/^[^\(]+?[\n$]/gm, '')
          .replace(/^\s+at\s+/gm, '')
          .replace(/^Object.<anonymous>\s*\(/gm, '{anonymous}()@')
          .split('\n');
      console.log(stack);
    }
  };

  return stackTraceService;
});