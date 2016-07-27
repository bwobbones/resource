minhrFilters.filter("returnDirtyItems", function() {
  return function(modelToFilter, form, treatAsDirty, removeTheseCharacters) {
    for (var key in modelToFilter) {
      if (removeTheseCharacters !== undefined && removeTheseCharacters.length > 0) {
        for (var CA = 0, len = removeTheseCharacters.length; CA < len; CA++) {
          if (modelToFilter[key].indexOf(removeTheseCharacters[CA]) >= 0) {
            modelToFilter[key] = modelToFilter[key].replace(removeTheseCharacters[CA], "", "g");
          }
        }
      }
      if ((form[key] && form[key].$pristine) || !form[key]) {
        if (treatAsDirty) {
          if (treatAsDirty.indexOf(key) == -1) {
            delete modelToFilter[key];
          } 
        } else {
          delete modelToFilter[key];
        }
      }
    }
    return modelToFilter;
  };
});