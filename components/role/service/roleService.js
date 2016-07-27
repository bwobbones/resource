/* globals appServices, moment, _ */
'use strict';

appServices.factory('RoleService', function() {

  var roleService = {

    saveRole: function(scope, personnelId, role) {
      this.find(personnelId).then(function(httpResult) {
        var personnel = httpResult.data;
        var foundRole;
        _.each(personnel.roles, function(currentRole) {
          if (_.isEqual(currentRole._id, role._id)) {
            foundRole = currentRole;
          }
        });
        if (foundRole) {
          personnel.roles = _.without(personnel.roles, foundRole);
        } 
        personnel.roles.push(role);
        savePersonnel(personnel);
      });
    },

    latestRole: function(personnel) {
      personnel.rolesList = '';
      var startDate = moment('01/01/1900', 'DD/MM/YYYY');
      var latestRole = {};
      _.each(personnel.roles, function(role) {
        if (role.deleted !== true) {
          if (role.endDate) {

            var playDate = role.endDate;

            if (!moment.isMoment(playDate)) {
              playDate = moment(role.endDate, 'DD/MM/YYYY');
            }

            if (playDate.isValid() && moment(playDate, 'DD/MM/YYYY').isAfter(startDate)) {
              latestRole = role;
              startDate = playDate;
            }

          } else {
            latestRole = role;
            startDate = moment('01/01/2200', 'DD/MM/YYYY');
          }
          personnel.rolesList += role.roleName + '</br>';
        }
      });

      return latestRole || {};
    },

    sortedRoles: function(personnel) {

      var sortedRoles = _.sortBy(personnel.roles, function(role) {

        var testDate = _.clone(role.endDate) || '01/01/2200';
        if (!role.startDate && !role.endDate) {
          testDate = '01/01/1800';
        }

        var end = moment(testDate, ['D/M/YYYY', 'MMM YYYY', 'MMMM YYYY'], true);
        return -end.valueOf();
      });

      return sortedRoles;
    },

    latestRoleName: function(personnel) {
      var latest = this.latestRole(personnel);
      return latest.roleName ? latest.roleName : '';
    }

  };

  return roleService;
});