angularModules.controller('PersonnelSkillsCtrl', ['$scope', PersonnelSkillsCtrl]);

function PersonnelSkillsCtrl($scope) {

  $scope.skills = {
    categories: [
      {
        name: 'Basic Skills',
        entries: [
          {id: 1, name: 'Read, Write, Speak English'},
          {id: 2, name: 'Basic Math'},
        ],
      },
      {
        name: 'Soft Skills',
        entries: [
          {id: 3, name: 'Working effectively with others'},
          {id: 4, name: 'Time Management'},
          {id: 5, name: 'Motivation & empowerment'},
          {id: 6, name: 'Management & supervision'},
          {id: 7, name: 'Root Cause Problem Solving'},
        ],
      },
      {
        name: 'Quality System',
        entries: [
          {id: 8, name: 'Quality System'},
          {id: 9, name: 'Documentation'},
          {id: 10, name: 'Manangment Responsibility'},
          {id: 11, name: 'Human Resources'},
          {id: 12, name: 'Customer-Related processes'},
          {id: 13, name: 'Design & Development'},
          {id: 14, name: 'Purchasing'},
          {id: 15, name: 'Production & Service'},
          {id: 16, name: 'Monitor & Measure Devices'},
          {id: 17, name: 'Measurement'},
          {id: 18, name: 'Internal Audit'},
          {id: 19, name: 'Control of Nonconforming'},
          {id: 20, name: 'Corrective & Preventive'},
        ],
      },
      {
        name: 'Hard Skills',
        entries: [
          {id: 21, name: 'Blueprint reading'},
          {id: 22, name: 'Safety Awareness'},
          {id: 23, name: 'Measuring & Gaging'},
          {id: 24, name: 'Customer Product Knowledge'},
          {id: 25, name: 'Product design skills'},
          {id: 26, name: 'Advanced Math'},
          {id: 27, name: 'Statistical Techniques'},
        ],
      },
      {
        name: 'Computer Skills',
        entries: [
          {id: 28, name: 'MRP'},
          {id: 29, name: 'CAD'},
          {id: 30, name: 'Windows'},
          {id: 31, name: 'Word'},
          {id: 32, name: 'Excel'},
          {id: 33, name: 'Access'},
          {id: 34, name: 'Outlook email'},
          {id: 35, name: 'Internet Explorer Internet'},
        ],
      }
    ]
  };

  $scope.deselect = function(skillId) {
    var skills = $scope.form.skills;
    if (skills && skills.ratings) {
      delete skills.ratings[skillId];
    }
  }
}
