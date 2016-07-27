// Protractor configuration
// https://github.com/angular/protractor/blob/master/referenceConf.js

'use strict';

exports.config = {
  // The timeout for each script run on the browser. This should be longer
  // than the maximum time your application needs to stabilize between tasks.
  // allScriptsTimeout: 110000,

  rootElement: '.resource',

  // A base URL for your application under test. Calls to protractor.get()
  // with relative paths will be prepended with this.
  baseUrl: 'http://localhost:' + (process.env.PORT || '9200'),

  // If true, only chromedriver will be started, not a standalone selenium.
  // Tests for browsers other than chrome will not run.
  // chromeOnly: true,

  // list of files / patterns to load in the browser
  specs: [

  // injector:e2e
  '../components/index/test/e2e/index.spec.js',
  '../components/jobDescription/test/e2e/jobDescription.create.spec.js',
  '../components/login/test/e2e/login.spec.js',
  '../components/personnel/test/e2e/personnel.create.spec.js',
  '../components/personnel/test/e2e/personnel.delete.spec.js',
  '../components/personnel/test/e2e/personnel.maps.spec.js',
  '../components/personnel/test/e2e/personnel.nav.spec.js',
  '../components/qualification/test/e2e/qualification.create.spec.js',
  '../components/workflow/test/e2e/manageWorkflow.nav.spec.js',
  // endinjector
  ],

  // Patterns to exclude.
  exclude: [],

  // ----- The test framework -----
  //
  // Jasmine and Cucumber are fully supported as a test and assertion framework.
  // Mocha has limited beta support. You will need to include your own
  // assertion framework if working with mocha.
  framework: 'jasmine2',

  // ----- Options to be passed to minijasminenode -----
  //
  // See the full list at https://github.com/juliemr/minijasminenode
  jasmineNodeOpts: {
    print: function() {}
  },

  onPrepare: function () {
    browser.driver.manage().window().maximize();

    var SpecReporter = require('jasmine-spec-reporter');
    jasmine.getEnv().addReporter(new SpecReporter({ displayStacktrace: 'none' }));
    
    var jasmineReporters = require('jasmine-reporters');
    jasmine.getEnv().addReporter(new jasmineReporters.JUnitXmlReporter({
        consolidateAll: true,
        savePath: 'testresults',
        filePrefix: 'xmloutput'
    }));

  }
};
