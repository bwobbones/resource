minhrFilters.filter('spaceCapitals', function() {
  return function(input, scope) {
    if (input) {
      return input.replace(/([a-z])([A-Z])/g, '$1 $2');
    }

    return input;
  }
});
