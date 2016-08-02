'use strict';

var path = require('path');

module.exports = function (grunt) {

  // Capture jasmine_node stack traces, see https://gist.github.com/badsyntax/7769526
  process.on('uncaughtException', function (e) {
    grunt.log.error(e.stack);
  });

  // Load grunt tasks automatically, when needed
  require('jit-grunt')(grunt, {
    shell: 'grunt-shell-spawn',
    express: 'grunt-express-server',
    injector: 'grunt-asset-injector',
    protractor: 'grunt-protractor-runner',
    'mongo-drop': 'grunt-mongo-drop-task'
  });

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  grunt.initConfig({

    'mongo-drop': {
      options: {
        dbname: 'resourcetestuser1',
        host: 'localhost'
      }
    },

    // Project settings
    yeoman: {
      // configurable paths
      client: 'components',
      dist: 'dist'
    },
    express: {
      options: {
        port: process.env.PORT || 9200
      },
      dev: {
        options: {
          script: 'app.js',
          debug: true
        }
      },
      prod: {
        options: {
          script: 'dist/app.js'
        }
      }
    },
    open: {
      server: {
        url: 'http://localhost:<%= express.options.port %>'
      }
    },
    watch: {
      injectJS: {
        files: [
          'components/**/*.js',
          '!components/**/*.spec.js',
          '!components/*/test/unit/*CtrlSpec.js',
          '!components/**/*.mock.js',
          'api/**/*.js'
        ],
        tasks: [ /*'newer:jshint:all', 'injector:scripts'*/]
      },
      injectCss: {
        files: [
          'components/**/*.css'
        ],
        tasks: [ /*'injector:css'*/]
      },
      mochaTest: {
        files: ['server/**/*.spec.js'],
        tasks: ['env:test', 'mochaTest']
      },
      jsTest: {
        files: [
          'components/*/test/unit/*CtrlSpec.js',
          'components/*/test/unit/*ServiceSpec.js',
          'components/**/*.mock.js'
        ],
        tasks: [ /*'newer:jshint:all',*/ 'test:client']
      },
      injectLess: {
        files: [
          'components/**/*.less'
        ],
        tasks: ['injector:less']
      },
      less: {
        files: [
          'components/**/*.less'
        ],
        tasks: ['less', 'autoprefixer']
      },
      bowerJson: {
        files: [
          'bower.json'
        ],
        tasks: ['wait', 'wiredep']
      },
      jade: {
        files: [
          'components/*.jade',
          'components/**/*.jade'
        ],
        tasks: []
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        files: [
          'app.js',
          'routes/**/*.js',
          'components/**/*.jade',
          'components/**/*.css',
          'components/**/*.html',
          'components/**/*.js',
          '!components/**/*.spec.js',
          '!components/*/test/unit/*CtrlSpec.js',
          '!components/**/*.mock.js',
          'components/web/images/{**/,}*.{png,jpg,jpeg,gif,webp,svg}',
          'api/**/*.js'
        ],
        options: {
          livereload: true
        }
      },
      express: {
        files: [
          'server/**/*.{js,json}'
        ],
        tasks: ['express:dev', 'wait'],
        options: {
          livereload: true,
          nospawn: true // Without this option specified express won't be reloaded
        }
      }
    },

    mongoimport: {
      options: {
        db: 'minhr_test',
        stopOnError: false,
        collections: [
          {
            name: 'users',
            type: 'json',
            file: 'test/data/users.json',
            jsonArray: true,
            upsert: true,
            drop: true
          },
          {
            name: 'personnels',
            type: 'json',
            file: 'test/data/personnels1.json',
            jsonArray: true,
            drop: true
          },
          {
            name: 'personnels',
            type: 'json',
            file: 'test/data/personnels2.json',
            jsonArray: true
          }
        ]
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: 'components/.jshintrc',
        reporter: require('jshint-stylish'),
        force: true
      },
      server: {
        options: {
          jshintrc: 'routes/.jshintrc',
          force: true
        },
        src: ['routes/{,*/}*.js']
      },
      all: [
        'Gruntfile.js',
        'components/**/*.js',
        '!components/**/*.spec.js',
        '!components/*/test/unit/*CtrlSpec.js',
        '!components/**/*.mock.js'
      ],
      test: {
        src: [
          'components/**/*.spec.js',
          'components/**/*.mock.js'
        ]
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/*'
          ]
        }]
      },
      server: '.tmp'
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/',
          src: '{,*/}*.css',
          dest: '.tmp/'
        }]
      }
    },

    env: {
      test: {
        NODE_ENV: 'test',
        DBSTRING: 'mongodb://localhost:27017/minhr_test',
        DBNAME: 'minhr_test',
        DBHOST: 'mongo',
        DBPORT: 27017,
        PORT: 9200,
      },
      build: {
        NODE_ENV: 'build',
        DBSTRING: 'mongodb://ip-172-31-20-5:27017/minhr',
        DBNAME: 'minhr',
        DBHOST: 'ip-172-31-20-5',
        DBPORT: 27017,
        PORT: 9200
      },
      dev: {
        NODE_ENV: 'development',
        DBSTRING: 'mongodb://localhost:27017/minhr',
        DBNAME: 'minhr',
        DBHOST: 'mongo',
        DBPORT: 27017,
        PORT: 9200
      },
      prod: {
        NODE_ENV: 'production',
        DBSTRING: 'mongodb://mongo:27017/minhr',
        DBNAME: 'minhr',
        DBHOST: 'mongo',
        DBPORT: 27017,
        PORT: 9200
      },
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.client %>',
          dest: '<%= yeoman.dist %>/components',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            'images/*',
            'assets/fonts/**/*',
            '**/*.jade',
            '!index.jade',
            '!layout.jade'
          ]
        }, {
            expand: true,
            dot: true,
            cwd: 'scripts',
            dest: '<%= yeoman.dist %>/scripts',
            src: [
              'upload.groovy'
            ]
          }, {
            expand: true,
            dot: true,
            cwd: 'templates',
            dest: '<%= yeoman.dist %>/templates',
            src: [
              '*.docx'
            ]
          }, {
            expand: true,
            cwd: '.tmp/images',
            dest: '<%= yeoman.dist %>/public/assets/images',
            src: ['generated/*']
          }, {
            expand: true,
            dest: '<%= yeoman.dist %>',
            src: [
              'components/web/**/*',
              'routes/**/*',
              'migrations/*',
              'app.js',
            ]
          }, {
            expand: true,
            cwd: '<%= yeoman.client %>/bower_components/open-sans/',
            dest: '<%= yeoman.dist %>/components/web/',
            src: [
              'fonts/**/*',
            ]
          }, {
            expand: true,
            flatten: true,
            dest: '<%= yeoman.dist %>/components/web/fonts/',
            src: [
              'components/bower_components/**/*.woff',
              'components/bower_components/**/*.ttf',
              '!**/open-sans/**/*',
              '!**/underscore/**/*',
            ]
          }, {
            dest: '<%= yeoman.dist %>/.env',
            src: [
              'config/.env.prod'
            ]
          }]
      },
      styles: {
        expand: true,
        cwd: '<%= yeoman.client %>',
        dest: '.tmp/',
        src: ['**/*.css']
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      debug: {
        tasks: [
          'nodemon',
          'node-inspector'
        ],
        options: {
          logConcurrentOutput: true
        }
      },
      dist: [
        //'less',
      ]
    },

    // Test settings
    karma: {
      unit: {
        configFile: 'config/karma.conf.js',
        runnerPort: 9999,
        singleRun: true,
        browsers: ['PhantomJS'],
        logLevel: 'INFO'
      },
      e2e: {
        configFile: 'config/karma-build-e2e.conf.js',
        logLevel: 'INFO'
      }
    },

    // Compiles Less to CSS
    less: {
      options: {
        paths: [
          '<%= yeoman.client %>/bower_components',
          '<%= yeoman.client %>'
        ]
      },
      production: {
        options: {
          // minify css in prod mode
          cleancss: true,
        },
        files: {
          '<%= yeoman.dist %>/<%= yeoman.client %>/app/app.css': '<%= yeoman.client %>/app/app.less'
        }
      }
    },

    injector: {
      options: {

      },
      // Inject application script files into index.html (doesn't include bower)
      scripts: {
        options: {
          transform: function (filePath) {
            filePath = filePath.replace('/components/', '');
            filePath = filePath.replace('/.tmp/', '');
            return 'script(src=\'' + filePath + '\')';
          },
          starttag: '// injector:js',
          endtag: '// endinjector'
        },
        files: {
          '<%= yeoman.client %>/index.jade': [
            ['{.tmp,<%= yeoman.client %>}/**/*.js',
              '!{.tmp,<%= yeoman.client %>}/app.js',
              '!{.tmp,<%= yeoman.client %>}/bower_components/**/*.js',
              '!{.tmp,<%= yeoman.client %>}/**/test/**/*.js',
              '!{.tmp,<%= yeoman.client %>}/utils/e2e-utils.js',
              '!{.tmp,<%= yeoman.client %>}/utils/protractor-utils.js',
              '!{.tmp,<%= yeoman.client %>}/**/*.spec.js',
              '!{.tmp,<%= yeoman.client %>}/**/*.mock.js'
            ]
          ]
        }
      },

      scriptsForTests: {
        options: {
          transform: function (filePath) {
            filePath = filePath.replace('/components', 'components');
            filePath = filePath.replace('/node_modules', 'node_modules');
            return '\'' + filePath + '\',';
          },
          starttag: '// injector:js',
          endtag: '// endinjector'
        },
        files: {
          'config/karma.conf.js': [
            ['{.tmp,<%= yeoman.client %>}/**/*.js',
              '!{.tmp,<%= yeoman.client %>}/app.js',
              '!{.tmp,<%= yeoman.client %>}/bower_components/**/*.js',
              '!{.tmp,<%= yeoman.client %>}/**/test/**/*.js',
              '!{.tmp,<%= yeoman.client %>}/utils/e2e-utils.js',
              '!{.tmp,<%= yeoman.client %>}/utils/protractor-utils.js',
              '!{.tmp,<%= yeoman.client %>}/**/*.spec.js',
              '!{.tmp,<%= yeoman.client %>}/**/*.mock.js',
              'node_modules/jasmine*/lib/pack.js'
            ]
          ]
        }
      },

      tests: {
        options: {
          transform: function (filePath) {
            filePath = filePath.replace('/components', 'components');
            return '\'' + filePath + '\',';
          },
          starttag: '// injector:testJs',
          endtag: '// endinjector'
        },
        files: {
          'config/karma.conf.js': [
            ['<%= yeoman.client %>/**/test/unit/*.js']
          ]
        }
      },

      e2eTests: {
        options: {
          transform: function (filePath) {
            filePath = filePath.replace('/components', 'components');
            return '\'../' + filePath + '\',';
          },
          starttag: '// injector:e2e',
          endtag: '// endinjector'
        },
        files: {
          'config/protractor.conf.js': [
            ['<%= yeoman.client %>/**/test/e2e/*.spec.js']
          ]
        }
      },

      // Inject component less into app.less
      less: {
        options: {
          transform: function (filePath) {
            filePath = filePath.replace('/components/', '');
            return '@import \'' + filePath + '\';';
          },
          starttag: '// injector',
          endtag: '// endinjector'
        },
        files: {
          '<%= yeoman.client %>/app.less': [
            '<%= yeoman.client %>/**/*.less'
          ]
        }
      },

      // Inject component css into index.html
      css: {
        options: {
          transform: function (filePath) {
            filePath = filePath.replace('/components/', '');
            filePath = filePath.replace('/.tmp/', '');
            return 'link(rel=\'stylesheet\', href=\'' + filePath + '\')';
          },
          sort: function (a, b) {
            if (a.indexOf('app.css') !== -1) {
              return 1;
            }
            return a > b;
          },
          starttag: '// injector:css',
          endtag: '// endinjector'
        },
        files: {
          '<%= yeoman.client %>/layout.jade': [
            '<%= yeoman.client %>/**/*.css',
            '!<%= yeoman.client %>/bower_components/**/*.css',
          ]
        }
      },
    },

    // Automatically inject Bower components into the app
    wiredep: {
      target: {
        src: ['<%= yeoman.client %>/index.jade', '<%= yeoman.client %>/layout.jade'],
        options: {
          exclude: ['/bootstrap/', /bootswatch/, 'angular-mocks', 'angular-scenario'],
        }
      },
      test: {
        src: 'config/karma.conf.js',
        options: {
          ignorePath: '../',
          exclude: ['angular-scenario', 'FileSaver'],
          fileTypes: {
            js: {
              replace: {
                js: '\'{{filePath}}\','
              }
            }
          }
        }
      }
    },

    ngAnnotate: {
      options: {
        singleQuotes: true,
        //sourceMap: true,
      },
    },

    jadeUsemin: {
      scripts: {
        options: {
          tasks: {
            js: ['concat', 'ngAnnotate', 'uglify', 'filerev'],
            css: ['concat', 'cssmin', 'filerev']
          },
          dirTasks: ['filerev'],
          prefix: '<%= yeoman.client %>/',
          targetPrefix: '<%= yeoman.dist %>/<%= yeoman.client %>/'
        },
        files: [{
          dest: '<%= yeoman.dist %>/<%= yeoman.client %>/index.jade',
          src: '<%= yeoman.client %>/index.jade'
        }, {
            dest: '<%= yeoman.dist %>/<%= yeoman.client %>/layout.jade',
            src: '<%= yeoman.client %>/layout.jade'
          }]
      }
    },

    filerev: {
      jadeUsemin: {
        options: {
          noDest: true
        }
      }
    },

    jasmine_node: {
      options: {
        forceExit: false,
        match: 'apispec',
        matchall: false,
        extensions: 'js',
        specNameMatcher: '',
        includeStackTrace: true,
        verbose: true,
        jUnit: {
          report: true,
          savePath: "./report/",
          useDotNotation: true,
          consolidate: false
        }
      },
      all: ['components/']
    },

    protractor: {
      options: {
        keepAlive: false,
        noColor: false,
        configFile: "config/protractor.conf.js",
      },
      chrome: {
        options: {
          args: {
            capabilities: {
              browserName: 'chrome'
            },
          }
        }
      },
      phantomjs: {
        options: {
          args: {
            seleniumAddress: 'http://localhost:4444/wd/hub',
            capabilities: {
              browserName: 'phantomjs'
            },
          }
        }
      }
    },

    shell: {
      webdriver_update: {
        options: {
          stdout: true,
          stderr: true,
        },
        command: 'node ' + path.join('node_modules', 'grunt-protractor-runner', 'node_modules', 'protractor', 'bin', 'webdriver-manager') + ' update'
      }
    },

    packageModules: {
      dist: {
        src: 'package.json',
        dest: 'dist'
      },
    },

    // zip all the files in the dist dir into resource-dist.zip
    compress: {
      dist: {
        options: {
          archive: 'dist/resource-dist.zip'
        },
        files: [{
          expand: true,
          dot: true,
          cwd: 'dist',
          src: '**/*'
        }]
      }
    },

  });

  // Used for delaying livereload until after server has restarted
  grunt.registerTask('wait', function () {
    grunt.log.ok('Waiting for server reload...');

    var done = this.async();

    setTimeout(function () {
      grunt.log.writeln('Done waiting!');
      done();
    }, 1500);
  });

  grunt.registerTask('express-keepalive', 'Keep grunt running', function () {
    this.async();
  });

  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'env:prod', 'express:prod', 'wait', 'open', 'express-keepalive']);
    }

    if (target === 'debug') {
      return grunt.task.run([
        'clean:server',
        'env:dev',
        'injector:less',
        //'less',
        'injector',
        'wiredep',
        'autoprefixer',
        'concurrent:debug'
      ]);
    }

    if (target === 'test') {
      return grunt.task.run([
        'clean:server',
        'env:test',
        'injector:less',
        'injector',
        'wiredep',
        'autoprefixer',
        'express:dev',
        'wait',
        'open',
        'watch'
      ]);
    }

    grunt.task.run([
      'clean:server',
      'env:dev',
      'injector:less',
      'injector',
      'wiredep',
      'autoprefixer',
      'express:dev',
      'wait',
      'open',
      'watch'
    ]);
  });

  grunt.registerTask('test', function (target) {
    if (target === 'server') {
      return grunt.task.run([
        'build',
        'test:phantom',
        'env:dev',
      ]);
    }

    //else
    if (target === 'client') {
      return grunt.task.run([
        'injector',
        'env:test',
        'mongo-drop',
        'mongoimport',
        'karma:unit',
        'jasmine_node',
        'env:dev',
      ]);
    } else if (target === 'build') {
      return grunt.task.run([
        'env:build',
        'karma:unit',
        'jasmine_node',
        'env:dev',
      ]);
    } else if (target === 'e2e') {
      return grunt.task.run([
        'clean:server',
        'env:test',
        'injector:less',
        //'less',
        'injector',
        'wiredep',
        'autoprefixer',
        'express:dev',
        'karma:e2e',
        'env:dev',
      ]);
    } else if (target === 'phantom') {
      return grunt.task.run([
        'mongo-drop',
        'mongoimport',
        'env:test',
        'express:dev',
        'shell:webdriver_update',
        'selenium_phantom_hub',
        'protractor:phantomjs',
        'selenium_stop',
        'env:dev',
      ]);
    } else if (target === 'chrome') {
      return grunt.task.run([
        'injector',
        'mongo-drop',
        'mongoimport',
        'env:test',
        'express:dev',
        'shell:webdriver_update',
        'protractor:chrome',
        'env:dev',
      ]);
    } else grunt.task.run([
      //'test:server',
      'test:client'
    ]);
  });

  grunt.registerTask('build', [
    'clean:dist',
    'injector:less',
    'concurrent:dist',
    'injector',
    'wiredep',
    'jadeUsemin',
    'autoprefixer',
    'copy:dist',
    'packageModules',
  ]);

  grunt.registerTask('testWatch', 'Runs tests when files change', function () {
    var tasks = ['test', 'watch'];

    grunt.option('force', true);
    grunt.task.run(tasks);
  });

  grunt.registerTask('jshintWatch', 'Runs jshint when files change', function () {
    var tasks = ['newer:jshint', 'watch'];
    grunt.task.run(tasks);
  });

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build',
    'compress',
  ]);

  grunt.loadNpmTasks('grunt-selenium-webdriver');
};
