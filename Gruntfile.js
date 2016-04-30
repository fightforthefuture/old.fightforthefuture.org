var Habitat = require('habitat');
var saveLicense = require('uglify-save-license');

Habitat.load('.env');

var
  env = new Habitat('', {
    url: 'http://0.0.0.0:9084',
    petitions_api: 'http://0.0.0.0:9104'
  });

module.exports = function (grunt) {
  "use strict";

  require('time-grunt')(grunt);
  require('jit-grunt')(grunt, {});

  grunt.initConfig({
    site: {
      app: 'site',
      dist: 'public',
      scripts: 'scripts'
    },

    clean: {
      init: {
        files: [
          {
            dot: true,
            src: '<%= site.dist %>/*'
          }
        ]
      }
    },

    execute: {
      sync_tumblr: {
        src: ['<%= site.scripts %>/sync_tumblr.js']
      },
      sync_petitions: {
        src: ['<%= site.scripts %>/prefetch_ids.js']
      }
    },

    jekyll: {
      options: {
        bundleExec: true,
        config: '_config.yml,_config_petition_ids.yml',
        dest: '<%= site.dist %>',
        src: '<%= site.app %>'
      },
      build: {
        options: {
          config: '_config.yml,_config.build.yml,_config_petition_ids.yml'
        }
      },
      review: {
        options: {
          raw: 'url: "' + (env.get('url') || ('http://' + env.get('heroku').app_name + '.herokuapp.com') || 'http://0.0.0.0:9084') + '"\npetitions_api: "' + env.get('petitions_api') + '"'
        }
      },
      server: {
        options: {
          incremental: true
        }
      },
      check: {
        options: {
          doctor: true
        }
      }
    },

    copy: {
      legacy: {
        files: [
          {
            expand: true,
            dot: true,
            cwd: '<%= site.app %>',
            src: [
              'images/**/*',
              'css/**/*',
              'js/**/*'
            ],
            dest: '<%= site.dist %>'
          }
        ]
      },
      images: {
        files: [
          {
            expand: true,
            dot: true,
            src: [
              'img/**/*'
            ],
            dest: '<%= site.dist %>'
          }
        ]
      }
    },

    less: {
      options: {
        compress: false,
        sourceMap: true
      },
      css: {
        files: [
          {
            expand: true,
            cwd: '<%= site.app %>/_less',
            src: '*.less',
            dest: '<%= site.dist %>/css',
            ext: '.css'
          }
        ]
      },
      test: {}
    },

    postcss: {
      build: {
        options: {
          map: {
            prev: 'css/',
            inline: false
          },
          processors: [
            require('autoprefixer')({browsers: 'last 2 versions'}),
            require('cssnano')()
          ]
        },
        files: [
          {
            expand: true,
            cwd: '<%= site.dist %>/css',
            src: [
              '*.css',
              '!animate.css',
              '!branding.css',
              '!ctu.css',
              '!homepage.css',
              '!ie.css',
              '!screen.css'
            ],
            dest: '<%= site.dist %>/css'
          }
        ]
      }
    },

    connect: {
      options: {
        hostname: '0.0.0.0',
        port: 9084,
        middleware: function (connect, options, middlewares) {
          middlewares.unshift(function (request, response, next) {
            response.setHeader('Access-Control-Allow-Origin', '*');
            response.setHeader('Access-Control-Allow-Methods', '*');
            return next();
          });
          return middlewares;
        },
        useAvailablePort: true
      },
      local: {
        options: {
          base: '<%= site.dist %>'
        }
      }
    },

    watch: {
      gruntfile: {
        files: ['Gruntfile.js'],
        options: {
          reload: true
        }
      },
      legacy: {
        files: [
          '<%= site.app %>/images/**/*',
          '<%= site.app %>/css/**/*',
          '<%= site.app %>/js/**/*'
        ],
        tasks: ['copy:legacy']
      },
      images: {
        files: ['img/**/*.*'],
        tasks: ['copy:images']
      },
      less: {
        files: ['<%= site.app %>/_less/**/*.less'],
        tasks: ['less:css', 'postcss:build']
      },
      javascript: {
        files: ['<%= site.app %>/_js/**/*.js'],
        tasks: ['concat:javascript']
      },
      jekyll: {
        files: [
          '_*.*',
          '<%= site.app %>/**/*.{xml,html,yml,md,mkd,markdown,rb,txt}'
        ],
        tasks: ['jekyll:server']
      }
    },

    concat: {
      options: {
        sourceMap: true
      },
      javascript: {
        files: [
          {
            src: [
              '<%= site.app %>/_js/LICENSE',
              '<%= site.app %>/_js/lib/util.js',
              '<%= site.app %>/_js/models/**/*.js',
              '<%= site.app %>/_js/views/**/*.js',
              '<%= site.app %>/_js/controllers/**/*.js',
              '<%= site.app %>/_js/components/**/*.js',
              '<%= site.app %>/_js/main.js'
            ],
            dest: '<%= site.dist %>/js/core.js'
          },
          {
            src: [
              '<%= site.app %>/_js/licenses/x11.js',
              'node_modules/smoothscroll/smoothscroll.min.js',
              '<%= site.app %>/_js/licenses/license-end.js',
            ],
            dest: '<%= site.dist %>/js/smoothscroll.min.js'
          }
        ]
      }
    },

    uglify: {
      options: {
        sourceMap: true,
        sourceMapIncludeSources: true,
        check: 'gzip',
        preserveComments: saveLicense
      },
      js: {
        files: {
          '<%= site.dist %>/js/core.js': '<%= site.dist %>/js/core.js'
        }
      }
    },

    concurrent: {
      external_scripts: [
        'execute:sync_petitions',
        'execute:sync_tumblr'
      ],
      compile: [
        'copy',
        'less:css',
        'concat:javascript'
      ]
    }
  });

  grunt.registerTask('dev', [
    'clean:init',
    'jekyll:server',
    'concurrent:compile',
    'postcss:build',
    'connect:local',
    'watch'
  ]);

  grunt.registerTask('build', [
    'clean:init',
    'concurrent:external_scripts',
    'jekyll:build',
    'concurrent:compile',
    'uglify:js',
    'postcss:build'
  ]);

  grunt.registerTask('review', [
    'clean:init',
    'jekyll:review',
    'concurrent:compile',
    'uglify:js',
    'postcss:build'
  ]);

  grunt.registerTask('test', [
    'jekyll:check'
  ]);

  grunt.registerTask('default', [
    'dev'
  ]);
};
