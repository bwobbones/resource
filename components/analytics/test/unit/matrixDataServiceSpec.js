'use strict';

describe('MatrixDataService', function() {

  var matrixDataService;
  var httpBackend;
  var scope;
  var rootScope;

  beforeEach(module('resource'));
  beforeEach(inject(function($httpBackend, $rootScope, MatrixDataService) {
    rootScope = $rootScope;
    scope = rootScope.$new();;
    httpBackend = $httpBackend;
    matrixDataService = MatrixDataService;

    httpBackend.expectPOST('/api/assembleProjectTeamData').respond({
      teamProjectData: {
        personnel: personnel,
        projects: projects
      }
    });

    matrixDataService.gatherData();

    httpBackend.flush();
    scope.$apply();

  }));

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  it('should be possible to set the team project data', function() {
    expect(matrixDataService.findAll()).toBeDefined();
    expect(matrixDataService.findAll().projects[0].name).toBe('Project One');
  });

  it('should filter the projects based on project text', function() {
    var options = {
      projectSearch: 'Two'
    };

    var filteredData = matrixDataService.filterData(options);
    expect(filteredData.projects.length).toBe(1);
  });

  it('should return the project experience types', function() {
    var experienceTypes = matrixDataService.findFields('projectExperience', 'projects', true);
    expect(experienceTypes).toHaveSameItems(['rpn', 'eeha', 'onog'], true);
  });

  it('should return the project experiences sorted alphabetically', function() {
    var experienceTypes = matrixDataService.findFields('projectExperience', 'projects', true);
    expect(experienceTypes).toHaveSameItems(['eeha', 'onog', 'rpn'], true);
  });

  it('should return the occupations of personnel', function() {
    var occupations = matrixDataService.findFields('occupation', 'personnel', true);
    expect(occupations).toHaveSameItems(['Chemist', 'Railway Electrician']);
  });

  it('should return the longest project name string', function() {
    expect(matrixDataService.findLongestField(['name'], 'projects')).toBe('Project Threee');
  });

  it('should find the longest personnel occupation', function() {
    expect(matrixDataService.findLongestField(['name', 'occupation'], 'personnel')).toBe('Bobstep Leybertley    Railway Electrician');
  });

  it('should find the same longest string when asked multiple times', function() {
    expect(matrixDataService.findLongestField(['name'], 'projects')).toBe('Project Threee');
    expect(matrixDataService.findLongestField(['name', 'occupation'], 'personnel')).toBe('Bobstep Leybertley    Railway Electrician');
    expect(matrixDataService.findLongestField(['name'], 'projects')).toBe('Project Threee');
  });

  it('should count experience types in projects', function() {
    expect(matrixDataService.countDataByFieldType('projects', 'projectExperience')).toEqual({eeha: 1, rpn: 1, onog: 1});
  });

  it('should count occupations in personnel', function() {
    expect(matrixDataService.countDataByFieldType('personnel', 'occupation')).toEqual({Chemist: 1, 'Railway Electrician': 1});
  });

});

var personnel = [
  {
    "id":"5533347dd4c608e6ecf12f22",
    "name":"Bertbob Tonmarcmarc",
    "occupation":"Chemist",
    "roles":[
      {
        "_id":"5533347dd4c608e6ecf12f1a",
        "roleName":"Chemical Engineer",
        "client":"Gold Holdings Pty Ltd",
        "projects":[
          {
            "id":"Siteokha",
            "text":"Siteokha",
            "location":"Northwest Shelf",
            "projectExperience":[
              "fpso",
              "lng"
            ],
            "phaseExperience":[
              "installation"
            ]
          },
          {
            "id":"Okhagold",
            "text":"Okhagold",
            "location":"Perth",
            "projectExperience":[
              "lng",
              "eeha"
            ],
            "phaseExperience":[
              "engineering"
            ]
          },

        ]
      }
    ]
  },
  {
    "id":"5533347dd4c608e6ecf12f30",
    "name":"Bobstep Leybertley",
    "occupation":"Railway Electrician",
    "roles":[
      {
        "_id":"5533347dd4c608e6ecf12f2c",
        "roleName":"Electrical and Instrument Technician",
        "client":"Gold Holdings Pty Ltd",
        "projects":[
          {
            "id":"Minefrank",
            "text":"Minefrank",
            "location":"Sydney",
            "projectExperience":[
              "eeha",
              "onOG"
            ],
            "phaseExperience":[
              "construction"
            ]
          },
          {
            "id":"Sitees",
            "text":"Sitees",
            "location":"Perth",
            "projectExperience":[
              "lng",
              "lng"
            ],
            "phaseExperience":[
              "opsmaint"
            ]
          }
        ]
      }
    ]
  }
];

var projects = [

  {
    "id":"0",
    "name":"Project One",
    "personnel":[
      {
        "id":"551aaa9bd4c6c29780d621b8",
        "name":"Sonmarc Tonnessmarc",
        "occupation":"Railway Electrician",
        "roles":[
          {
            "_id":"551aaa9bd4c6c29780d621af",
            "roleName":"Chemical Engineer",
            "client":"Woodside",
            "projects":[
              {
                "id":"Project One",
                "text":"Project One",
                "location":"Sydney",
                "projectExperience":[
                  "eeha"
                ],
                "phaseExperience":[
                  "opsmaint"
                ]
              }
            ]
          }
        ]
      }
    ],
    "projectExperience":"eeha",
    "ycoords":[
      {
        "y":16,
        "x":160
      }
    ]
  },
  {
    "id":"1",
    "name":"Project Two",
    "personnel":[
      {
        "id":"551aaa9bd4c6c29780d621b8",
        "name":"Sonmarc Tonnessmarc",
        "occupation":"Railway Electrician",
        "roles":[
          {
            "_id":"551aaa9bd4c6c29780d621af",
            "roleName":"Chemical Engineer",
            "client":"Woodside",
            "projects":[
              {
                "id":"Project Two",
                "text":"Project Two",
                "location":"Sydney",
                "projectExperience":[
                  "rpn"
                ],
                "phaseExperience":[
                  "opsmaint"
                ]
              }
            ]
          }
        ]
      }
    ],
    "projectExperience":"rpn",
    "ycoords":[
      {
        "y":16,
        "x":160
      }
    ]
  },
  {
    "id":"2",
    "name":"Project Threee",
    "personnel":[
      {
        "id":"3",
        "name":"Sonmarc Tonnessmarc",
        "occupation":"Railway Electrician",
        "roles":[
          {
            "_id":"551aaa9bd4c6c29780d621af",
            "roleName":"Chemical Engineer",
            "client":"Woodside",
            "projects":[
              {
                "id":"Project Threee",
                "text":"Project Threee",
                "location":"Sydney",
                "projectExperience":[
                  "onog"
                ],
                "phaseExperience":[
                  "opsmaint"
                ]
              }
            ]
          }
        ]
      }
    ],
    "projectExperience":"onog",
    "ycoords":[
      {
        "y":16,
        "x":160
      }
    ]
  }

];