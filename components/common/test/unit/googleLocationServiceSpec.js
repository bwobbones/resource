'use strict';

describe('GoogleLocationService', function() {

  var googleLocationService;
  var googleLocationSpy;
  var httpBackend;
  var q;
  var rootScope;
  var scope;

  beforeEach(module('resource'));
  beforeEach(inject(function($httpBackend, $q, $rootScope, GoogleLocationService) {
    googleLocationService = GoogleLocationService;
    scope = $rootScope.$new();
    rootScope = $rootScope;
    httpBackend = $httpBackend;
    q = $q;
  }));

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  it('should return state and country', function() {

    httpBackend.expectGET('https://maps.googleapis.com/maps/api/geocode/json?latlng=1,1&key=AIzaSyAuzmQaHMOTdUFvgofNc-6SBQgWbXricUE')
      .respond(sampleGoogle);

    googleLocationService.findStateAndCountry('address', {lat: 1, lng: 1}).then(function(data) {
      expect(data).toBe('WA, Australia');
    });
    scope.$apply();
    httpBackend.flush();
  });

  it('should return personnel address when location is not available', function() {

    googleLocationService.findStateAndCountry('address').then(function(data) {
      expect(data).toBe('address');
    });

    scope.$apply();
  });

  it('should show an empty address as empty', function() {
    googleLocationService.findStateAndCountry('').then(function(data) {
      expect(data).toBe('');
    });

    scope.$apply();
  });

  it('should show an undefined address as empty', function() {
    googleLocationService.findStateAndCountry().then(function(data) {
      expect(data).toBe('');
    });

    scope.$apply();
  });

  var sampleGoogle = {
    "results":[
      {
        "address_components":[
          {
            "long_name":"5",
            "short_name":"5",
            "types":[
              "street_number"
            ]
          },
          {
            "long_name":"Cobblestones Circuit",
            "short_name":"Cobblestones Circuit",
            "types":[
              "route"
            ]
          },
          {
            "long_name":"Secret Harbour",
            "short_name":"Secret Harbour",
            "types":[
              "locality",
              "political"
            ]
          },
          {
            "long_name":"Western Australia",
            "short_name":"WA",
            "types":[
              "administrative_area_level_1",
              "political"
            ]
          },
          {
            "long_name":"Australia",
            "short_name":"AU",
            "types":[
              "country",
              "political"
            ]
          },
          {
            "long_name":"6173",
            "short_name":"6173",
            "types":[
              "postal_code"
            ]
          }
        ],
        "formatted_address":"5 Cobblestones Circuit, Secret Harbour WA 6173, Australia",
        "geometry":{
          "location":{
            "lat":-32.412506,
            "lng":115.749687
          },
          "location_type":"ROOFTOP",
          "viewport":{
            "northeast":{
              "lat":-32.4111570197085,
              "lng":115.7510359802915
            },
            "southwest":{
              "lat":-32.4138549802915,
              "lng":115.7483380197085
            }
          }
        },
        "place_id":"ChIJL71sxNGAMioRTCkuA-8hXb8",
        "types":[
          "street_address"
        ]
      },
      {
        "address_components":[
          {
            "long_name":"Secret Harbour",
            "short_name":"Secret Harbour",
            "types":[
              "locality",
              "political"
            ]
          },
          {
            "long_name":"Western Australia",
            "short_name":"WA",
            "types":[
              "administrative_area_level_1",
              "political"
            ]
          },
          {
            "long_name":"Australia",
            "short_name":"AU",
            "types":[
              "country",
              "political"
            ]
          },
          {
            "long_name":"6173",
            "short_name":"6173",
            "types":[
              "postal_code"
            ]
          }
        ],
        "formatted_address":"Secret Harbour WA 6173, Australia",
        "geometry":{
          "bounds":{
            "northeast":{
              "lat":-32.3950262,
              "lng":115.7746344
            },
            "southwest":{
              "lat":-32.4169943,
              "lng":115.7381299
            }
          },
          "location":{
            "lat":-32.4090774,
            "lng":115.7471544
          },
          "location_type":"APPROXIMATE",
          "viewport":{
            "northeast":{
              "lat":-32.3950262,
              "lng":115.7746344
            },
            "southwest":{
              "lat":-32.4169943,
              "lng":115.7381299
            }
          }
        },
        "place_id":"ChIJjQ9YJtOAMioRkFDfNbXwBAU",
        "types":[
          "locality",
          "political"
        ]
      },
      {
        "address_components":[
          {
            "long_name":"Perth",
            "short_name":"Perth",
            "types":[
              "colloquial_area",
              "locality",
              "political"
            ]
          },
          {
            "long_name":"Western Australia",
            "short_name":"WA",
            "types":[
              "administrative_area_level_1",
              "political"
            ]
          },
          {
            "long_name":"Australia",
            "short_name":"AU",
            "types":[
              "country",
              "political"
            ]
          }
        ],
        "formatted_address":"Perth WA, Australia",
        "geometry":{
          "bounds":{
            "northeast":{
              "lat":-31.45486,
              "lng":116.4139149
            },
            "southwest":{
              "lat":-32.4829073,
              "lng":115.4487603
            }
          },
          "location":{
            "lat":-31.9535132,
            "lng":115.8570471
          },
          "location_type":"APPROXIMATE",
          "viewport":{
            "northeast":{
              "lat":-31.45486,
              "lng":116.4139149
            },
            "southwest":{
              "lat":-32.4829073,
              "lng":115.4487603
            }
          }
        },
        "place_id":"ChIJPXNH22yWMioR0FXfNbXwBAM",
        "types":[
          "colloquial_area",
          "locality",
          "political"
        ]
      },
      {
        "address_components":[
          {
            "long_name":"6173",
            "short_name":"6173",
            "types":[
              "postal_code"
            ]
          },
          {
            "long_name":"Perth",
            "short_name":"Perth",
            "types":[
              "colloquial_area",
              "locality",
              "political"
            ]
          },
          {
            "long_name":"Western Australia",
            "short_name":"WA",
            "types":[
              "administrative_area_level_1",
              "political"
            ]
          },
          {
            "long_name":"Australia",
            "short_name":"AU",
            "types":[
              "country",
              "political"
            ]
          }
        ],
        "formatted_address":"Perth WA 6173, Australia",
        "geometry":{
          "bounds":{
            "northeast":{
              "lat":-32.3950262,
              "lng":115.7746344
            },
            "southwest":{
              "lat":-32.4169943,
              "lng":115.7381299
            }
          },
          "location":{
            "lat":-32.4051251,
            "lng":115.7634366
          },
          "location_type":"APPROXIMATE",
          "viewport":{
            "northeast":{
              "lat":-32.3950262,
              "lng":115.7746344
            },
            "southwest":{
              "lat":-32.4169943,
              "lng":115.7381299
            }
          }
        },
        "place_id":"ChIJR2w6Xy2HMioR8KkUgLjwBBw",
        "types":[
          "postal_code"
        ]
      },
      {
        "address_components":[
          {
            "long_name":"Southern & Fremantle",
            "short_name":"Southern & Fremantle",
            "types":[
              "political"
            ]
          },
          {
            "long_name":"Western Australia",
            "short_name":"WA",
            "types":[
              "administrative_area_level_1",
              "political"
            ]
          },
          {
            "long_name":"Australia",
            "short_name":"AU",
            "types":[
              "country",
              "political"
            ]
          }
        ],
        "formatted_address":"Southern & Fremantle, WA, Australia",
        "geometry":{
          "bounds":{
            "northeast":{
              "lat":-31.9399095,
              "lng":116.1341061
            },
            "southwest":{
              "lat":-32.6107989,
              "lng":115.6316423
            }
          },
          "location":{
            "lat":-32.2009612,
            "lng":115.8994923
          },
          "location_type":"APPROXIMATE",
          "viewport":{
            "northeast":{
              "lat":-31.9399095,
              "lng":116.1341061
            },
            "southwest":{
              "lat":-32.6107989,
              "lng":115.6316423
            }
          }
        },
        "place_id":"ChIJabpVIcePMioRi7L9Pf0NqsE",
        "types":[
          "political"
        ]
      },
      {
        "address_components":[
          {
            "long_name":"Western Australia",
            "short_name":"WA",
            "types":[
              "administrative_area_level_1",
              "political"
            ]
          },
          {
            "long_name":"Australia",
            "short_name":"AU",
            "types":[
              "country",
              "political"
            ]
          }
        ],
        "formatted_address":"Western Australia, Australia",
        "geometry":{
          "bounds":{
            "northeast":{
              "lat":-13.6894901,
              "lng":129.0025979
            },
            "southwest":{
              "lat":-35.1939944,
              "lng":112.92145
            }
          },
          "location":{
            "lat":-27.6728168,
            "lng":121.6283098
          },
          "location_type":"APPROXIMATE",
          "viewport":{
            "northeast":{
              "lat":-13.6894901,
              "lng":129.0025979
            },
            "southwest":{
              "lat":-35.19342990000001,
              "lng":112.92151
            }
          }
        },
        "place_id":"ChIJ0YTziS4qOSoRmaMAMt9KDm4",
        "types":[
          "administrative_area_level_1",
          "political"
        ]
      },
      {
        "address_components":[
          {
            "long_name":"Australia",
            "short_name":"AU",
            "types":[
              "country",
              "political"
            ]
          }
        ],
        "formatted_address":"Australia",
        "geometry":{
          "bounds":{
            "northeast":{
              "lat":-9.2198215,
              "lng":159.2872223
            },
            "southwest":{
              "lat":-54.7772185,
              "lng":112.9214544
            }
          },
          "location":{
            "lat":-25.274398,
            "lng":133.775136
          },
          "location_type":"APPROXIMATE",
          "viewport":{
            "northeast":{
              "lat":-9.315742,
              "lng":162.823061
            },
            "southwest":{
              "lat":-46.526369,
              "lng":103.672671
            }
          }
        },
        "place_id":"ChIJ38WHZwf9KysRUhNblaFnglM",
        "types":[
          "country",
          "political"
        ]
      }
    ],
    "status":"OK"
  };

});