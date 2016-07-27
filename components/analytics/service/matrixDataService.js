'use strict';

appServices.service('MatrixDataService', function(PersonnelService, _) {

  var teamProjectData = {};
  var filteredData = {};

  var matrixDataService = {

    gatherData: function() {
      var promise = PersonnelService.assembleProjectTeamData().then(function(httpResult) {
        teamProjectData = httpResult.data.teamProjectData;
      });

      return promise;
    },

    findAll: function() {
      if (!_.isEmpty(filteredData)) {
        return filteredData;
      }
      return teamProjectData;
    },

    findDataByType: function(type) {
      return this.findAll()[type];
    },

    findFields: function(field, collectionName, unique) {
      return findFieldsMemoized(field + collectionName + unique, field, collectionName, unique);
    },

    findLongestField: function(fieldsToSearch, collection) {
      return findLongestFieldMemoized(fieldsToSearch + collection, fieldsToSearch, collection);
    },

    countDataByType: function(type) {
      return this.findDataByType(type).length;
    },

    countDataByFieldType: function(type, field) {
      var fieldCount = {};
      _.each(this.findFields(field, type, true), function(thisField) {
        fieldCount[thisField] = _.filter(matrixDataService.findDataByType(type), function(n) { return n[field] === thisField }).length;
      });
      return fieldCount;
    },

    // this uses teamProjectData as it needs a new set each time
    filterData: function(options) {

      filteredData = _.clone(teamProjectData);

      if (teamProjectData) {

        var selectedOccupations = _.pluck(_.filter(options.occupations, {selected: true}), 'name');
        filteredData.personnel = _.filter(teamProjectData.personnel, function (personnel) {
          return _.contains(selectedOccupations, personnel.occupation);
        });

        var selectedExperience = _.pluck(_.filter(options.experience, {selected: true}), 'value');
        filteredData.projects = _.filter(teamProjectData.projects, function (project) {
          return _.contains(selectedExperience, project.projectExperience);
        });

        if (options.personnelSearch) {
          var nameRegex = new RegExp('.*' + options.personnelSearch + '.*', 'i');
          filteredData.personnel = _.filter(teamProjectData.personnel, function (personnel) {
            return personnel.name.match(nameRegex);
          });
        }

        if (options.projectSearch) {
          var projectRegex = new RegExp('.*' + options.projectSearch + '.*', 'i');
          filteredData.projects = _.filter(teamProjectData.projects, function (project) {
            return project.name.match(projectRegex);
          });
        }

      }

      return filteredData;

    }

  }

  var findFieldsMemoized = _.memoize(function(memoKey, field, collectionName, unique) {
    var fieldData = _.pluck(teamProjectData[collectionName], field);
    if (unique) {
      fieldData = _.uniq(fieldData);
    }
    return fieldData;
  });

  var findLongestFieldMemoized = _.memoize(function(memoKey, fieldsToSearch, collection) {

    // gather the data
    var lists = [];
    _.each(fieldsToSearch, function(field) {
      var list = matrixDataService.findFields(field, collection);
      lists.push(list);
    });

    // make the longest strings
    var zipped = [];
    if (fieldsToSearch.length > 1) {
      var pairings = _.zip.apply(this, lists);
      _.each(pairings, function(pairing) {
        zipped.push(pairing.join('    '));
      });
    } else {
      zipped = lists[0];
    }

    return zipped.reduce(function (a, b) { return a.length > b.length ? a : b; });

  });

  return matrixDataService;
});