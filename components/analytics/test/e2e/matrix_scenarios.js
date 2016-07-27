describe('Resource', function() {

  describe('Team Project Matrix', function() {

    beforeEach(function() {
      browser().navigateTo('/');
      login();
      element('#teamProjectMatrixMenu').click();

      var startingColumnNames = [
        'Eses', 'Esfort', 'Estin', 'Fortfrank', 'Fortgold'
      ];
      expect(getNames('.column')).toEqual(startingColumnNames);

      var startingRowNames = [
        'Erjeff Jeffbobsley', 'Erson Jeffnesston', 'Nessley Stepstepson', 'Sleybert Andsonson', 'Marcmarc Ingtonshire'
      ];
      expect(getNames('.cellRow')).toEqual(startingRowNames);

    });

    afterEach(function() {
      logout();
    });

    it('should show the team project matrix', function() {
      expect(repeater('svg').count()).toEqual(1);
    });

    it('should not show the matrix after going to personnel', function() {
      expect(repeater('svg').count()).toEqual(1);
      element('a[href$="addPersonnel"]').click();
      expect(repeater('svg').count()).toEqual(0);
    });

    it('should show the right number of projects', function() {
      var getCount = repeater('.columnText:visible').count();
      expect(getCount).toBe(178);
    });

    it('should show the right number of personnel', function() {
      var getCount = repeater('.rowText:visible').count();
      expect(getCount).toBe(16);
    });

    it('should show the column separators', function() {
      var getCount = repeater('.columnSeparator').count();
      expect(getCount).toBe(4);
    });

    it('should show the row separators', function() {
      var getCount = repeater('.rowSeparator').count();
      expect(getCount).toBe(3);
    });

    it('should filter by project experience', function() {
      element('#eeha').click();
      var getCount = repeater('.columnText:visible').count();
      expect(getCount).toBe(139);
    });

    it('should filter by project query', function() {
      input('options.projectSearch').enter('ese');
      var getCount = repeater('.columnText:visible').count();
      expect(getCount).toBe(3);
    });

    it('should filter by personnel query', function() {
      input('options.personnelSearch').enter('marc');
      var getCount = repeater('.rowText:visible').count();
      expect(getCount).toBe(5);
    });

    it('should show projects alphabetically', function() {

      var expectedList = [
        'Eses', 'Eses', 'Esfort', 'Esfort', 'Esfort'
      ];

      element('#project-alphabetical').click();

      expect(getNames('.column')).toEqual(expectedList);

    });

    it('should show projects alphabetically when filtered by experience', function() {
      element('#onOG').click();
      element('#fpso').click();
      element('#eeha').click();

      var expectedList = [
        'Esfort', 'Esfrank', 'Esgold', 'Esgold', 'Eslin'
      ];

      element('#project-alphabetical').click();

      expect(getNames('.column')).toEqual(expectedList);
    })

    it('should show personnel alphabetically', function() {

      var expectedList = [
        'Anding Ersonmarc', 'Bobshire Tonanding', 'Erjeff Jeffbobsley', 'Ermarc Sleysonwick', 'Erson Jeffnesston'
      ];

      element('#personnel-alphabetical').click();

      expect(getNames('.cellRow')).toEqual(expectedList);

    });

    it('should shuffle projects when a personnel is selected', function() {

      var expectedList = [
        'Tinque', 'Sitemine', 'Sitemine', 'Sitefrank', 'Rouldfort'
      ];

      element('#rowText-ErjeffJeffbobsley').click();

      expect(getNames('.column')).toEqual(expectedList);

    });

    it('should shuffle personnel when a project is selected', function() {

      element('#columnText-Eseseeha').click();

      expect(getNames('.cellRow', 1)).toEqual(['Nessley Stepstepson']);

    });

  });

});

function getNames(selector, itemsToReturn) {

  var promise = element(selector).query(function(elm, done) {
    var allText = [];
    var regex = /translate\((\d*,)?(\d+).?(\d+)?\)(rotate\(-90\))?/;
    _.each(elm, function(field) {
      allText.push({
        order: Number(field.getAttribute('transform').match(regex)[2]),
        text: field.childNodes[field.childNodes.length-1].innerHTML
      })
    });

    var sorted = _.sortBy(allText, 'order');
    var allTextPlucked = _.pluck(sorted, 'text');
    var sliced = allTextPlucked.slice(0, itemsToReturn ? itemsToReturn : 5);
    done(null, sliced);
  });

  return promise;
}