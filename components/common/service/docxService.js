appServices.factory('DocxService', function($http, GoogleLocationService, RoleService) {
  
  var docxService = {

    generateCV: function(personnel) {

      var roles = getRoleData(RoleService.sortedRoles(personnel));

      var pointOfHire;
      var latestRole;
      var promise = gatherPointOfHire(personnel).then(function(poh) {
        pointOfHire = poh;
        return RoleService.latestRoleName(personnel)
      }).then(function(lr) {
        latestRole = lr;

        var personnelData = {
          name: personnel.name,
          surname: personnel.surname,
          summary: splitByCR(personnel.summary),
          latestRole: latestRole,
          dateOfBirth: personnel.dateofbirth ? personnel.dateofbirth : '',
          pointOfHire: pointOfHire,
          rightToWork: personnel.rightToWork ? 'Yes' : 'No',
          qualifications: personnel.qualifications,
          trainings: personnel.trainings,
          additionalTrainings: personnel.trainings,
          comments: personnel.comments,
          recentExperience: roles ? _.slice(roles, 0, 6) : [],
          roles: roles
        };

        docxService.generateDocument(personnelData);

        // only returning for test reasons
        return personnelData;
      });

      return promise;
    },

    generateDocument: function(personnelData) {
      $http.post('/api/generateCV', personnelData, {responseType: "arraybuffer"}).
        success(function (data) {
          var blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'});
          saveAs(blob, personnelData.name + ' ' + personnelData.surname + '.docx');
        }).
        error(function (data, status) {
          console.log = "Request failed with status: " + status;
        });
    }

  };

  function getRoleData(roles) {

    var roleData = [];

    if (roles && roles.length > 0) {
      _.each(roles, function(role) {

        if (role.deleted !== true) {
          var role = {
            startDate: role.startDate,
            endDate: role.endDate ? role.endDate : 'Current',
            client: role.client,
            roleName: role.roleName,
            responsibilities: role.responsibilities ? splitByCR(role.responsibilities) : [{
              text: 'Responsibilities not supplied'
            }]
          };

          roleData.push(role);
        }
      });
    }

    return roleData;
  }

  // this is ridiculous.  Should be able to replace \n\r with <br> somehow
  function splitByCR(paragraph) {
    var sentenceArray = [];

    if (paragraph) {
      var sentences = paragraph.split(/[\n\r]/);
      _.each(sentences, function (sentence) {
        if (sentence.length > 0) {
          sentenceArray.push({
            text: sentence
          })
        }
      });
    }
    return sentenceArray;
  }

  function gatherPointOfHire(personnel) {
    return GoogleLocationService.findStateAndCountry(personnel.hcaddress, personnel.homeLocation);
  }

  return docxService;
});