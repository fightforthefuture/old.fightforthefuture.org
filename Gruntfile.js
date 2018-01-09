var Habitat = require('habitat');
var saveLicense = require('uglify-save-license');

Habitat.load('.env');

var
  env = new Habitat('', {
    url: 'http://0.0.0.0:9084',
    petitions_api: 'http://0.0.0.0:9104',
    aws_s3_bucket: 's3.fightforthefuture.org'
  });

module.exports = function (grunt) {
  "use strict";

  require('time-grunt')(grunt);
  require('jit-grunt')(grunt, {});

  grunt.initConfig({
    site: {
      app: 'site',
      dist: 'public',
      scripts: 'scripts',
      assets: 'public',
      javascript_files: [
        'js/LICENSE',
        'js/lib/util.js',
        'js/views/**/*.js',
        'js/components/**/*.js',
        'js/callbacks/**/*.js',
        'js/main.js'
      ]
    },

    clean: [
      '<%= site.dist %>/*'
    ],

    execute: {
      sync_tumblr: {
        src: ['<%= site.scripts %>/sync_tumblr.js']
      },
      sync_petitions: {
        src: ['<%= site.scripts %>/prefetch_ids.js']
      },
      sync_congress: {
        src: ['<%= site.scripts %>/sync_congress.js']
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
      server: {
        files: [
          {
            expand: true,
            dot: true,
            src: [
              'js/one-off/**/*.js',
              'img/**/*.{gif,png,jpg,jpeg,svg}'
            ],
            dest: '<%= site.dist %>'
          }
        ]
      },
      deploy: {
        files: [
          {
            expand: true,
            dot: true,
            src: [
              'img/**/*.{gif,png,jpg,jpeg,svg}',
              'js/one-off/**/*.js'
            ],
            dest: '<%= site.assets %>'
          }
        ]
      }
    },

    less: {
      options: {
        compress: false,
        sourceMap: true
      },
      server: {
        files: [
          {
            expand: true,
            cwd: 'less',
            src: '*.less',
            dest: '<%= site.dist %>/css',
            ext: '.css'
          }
        ]
      },
      deploy: {
        files: [
          {
            expand: true,
            cwd: 'less',
            src: '*.less',
            dest: '<%= site.assets %>/css',
            ext: '.css'
          }
        ]
      }
    },

    postcss: {
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
      server: {
        files: [
          {
            expand: true,
            cwd: '<%= site.dist %>/css',
            src: '*.css',
            dest: '<%= site.dist %>/css'
          }
        ]
      },
      deploy: {
        files: [
          {
            expand: true,
            cwd: '<%= site.assets %>/css',
            src: '*.css',
            dest: '<%= site.assets %>/css'
          }
        ]
      }
    },

    concat: {
      options: {
        sourceMap: true
      },
      server: {
        files: [
          {
            src: '<%= site.javascript_files %>',
            dest: '<%= site.dist %>/js/core.js'
          },
          {
            src: [
              'js/_licenses/x11.js',
              'node_modules/smoothscroll/smoothscroll.min.js',
              'js/_licenses/license-end.js'
            ],
            dest: '<%= site.dist %>/js/smoothscroll.min.js'
          }
        ]
      },
      deploy: {
        files: [
          {
            src: '<%= site.javascript_files %>',
            dest: '<%= site.assets %>/js/core.js'
          },
          {
            src: [
              'js/_licenses/x11.js',
              'node_modules/smoothscroll/smoothscroll.min.js',
              'js/_licenses/license-end.js'
            ],
            dest: '<%= site.assets %>/js/smoothscroll.min.js'
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
      deploy: {
        files: {
          '<%= site.assets %>/js/core.js': '<%= site.assets %>/js/core.js'
        }
      }
    },

    cdnify: {
      deploy: {
        options: {
          rewriter: function (url) {
            var
              stamp = Date.now();
            if (url[0] === '/') {
              return url + '?' + stamp;
            } else {
              return url;
            }
          }
        },
        files: [{
          expand: true,
          cwd: '<%= site.dist %>',
          src: '**/*.html',
          dest: '<%= site.dist %>'
        }, {
          expand: true,
          cwd: '<%= site.assets %>',
          src: '**/*.css',
          dest: '<%= site.assets %>'
        }]
      }
    },

    concurrent: {
      external_scripts: [
        'execute:sync_petitions',
        'execute:sync_tumblr',
        'execute:sync_congress'
      ],
      server: [
        'jekyll:server',
        'less:server',
        'concat:server',
        'copy:server'
      ],
      review: [
        'jekyll:review',
        'less:server',
        'concat:server',
        'copy:server'
      ],
      deploy1: [
        'jekyll:build',
        'less:deploy',
        'concat:deploy',
        'copy:deploy'
      ],
      deploy2: [
        'uglify:deploy',
        'cdnify:deploy'
      ]
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
      images: {
        files: ['img/**/*.*'],
        tasks: ['copy:server']
      },
      less: {
        files: ['less/**/*.less'],
        tasks: ['less:server', 'postcss:server']
      },
      javascript: {
        files: ['js/**/*.js'],
        tasks: ['concat:server']
      },
      jekyll: {
        files: [
          '_*.*',
          '<%= site.app %>/**/*.{xml,html,yml,md,mkd,markdown,rb,txt}'
        ],
        tasks: ['jekyll:server']
      }
    }
  });

  grunt.registerTask('dev', [
    'clean',
    'concurrent:server',
    'postcss:server',
    'connect:local',
    'watch'
  ]);

  grunt.registerTask('build', [
    'clean',
    'concurrent:external_scripts',
    'concurrent:deploy1',
    'concurrent:deploy2'
  ]);

  grunt.registerTask('review', [
    'clean',
    'concurrent:external_scripts',
    'concurrent:review',
    'postcss:server'
  ]);

  grunt.registerTask('test', [
    'jekyll:check'
  ]);

  grunt.registerTask('default', [
    'dev'
  ]);
};
