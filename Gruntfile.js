module.exports = function (grunt) {
  require('time-grunt')(grunt);
  require('jit-grunt')(grunt, {});

  grunt.initConfig({
    site: {
      app: 'site',
      dist: 'public'
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
        src: ['sync_tumblr.js']
      }
    },

    jekyll: {
      options: {
        bundleExec: true,
        config: '_config.yml',
        dest: '<%= site.dist %>',
        src: '<%= site.app %>'
      },
      build: {
        options: {
          config: '_config.yml,_config.build.yml'
        }
      },
      server: {
        options: {
          config: '_config.yml'
        }
      },
      check: {
        options: {
          doctor: true
        }
      }
    },

    copy: {
      assets: {
        files: [
          {
            expand: true,
            dot: true,
            cwd: '<%= site.app %>',
            src: [
              'images/**/*',
              'img/**/*',
              'css/**/*',
              'js/**/*'
            ],
            dest: '<%= site.dist %>'
          }
        ]
      }
    },

    less: {
      options: {
        compress: true
      },
      css: {
        options: {
          compress: false,
          sourceMap: true
        },
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
          map: true,
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
      images: {
        files: [
          '<%= site.app %>/images/**/*.*',
          '<%= site.app %>/img/**/*.*' // late 2015 attempt to clean house
        ],
        tasks: ['copy:assets']
      },
      less: {
        files: ['<%= site.app %>/_less/**/*.less'],
        tasks: ['less:css']
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
        sourceMap: true,
        separator: grunt.util.linefeed + ';'
      },
      javascript: {
        files: [
          {
            src: [
              '<%= site.app %>/_js/components/**/*.js',
              '<%= site.app %>/_js/models/**/*.js',
              '<%= site.app %>/_js/views/**/*.js',
              '<%= site.app %>/_js/main.js'
            ],
            dest: '<%= site.dist %>/js/core.js'
          }
        ]
      }
    },

    uglify: {
      options: {
        sourceMap: true,
        sourceMapIncludeSources: true,
        check: 'gzip'
      },
      build: {
        files: {
          '<%= site.dist %>/js/core.js': '<%= site.dist %>/js/core.js'
        }
      }
    },

    concurrent: {
      server: [
        'copy:assets',
        'execute:sync_tumblr',
        'jekyll:server',
        'less:css',
        'concat:javascript'
      ],
      build: [
        'copy:assets',
        'execute:sync_tumblr',
        'jekyll:build',
        'less:css',
        'concat:javascript'
      ]
    }
  });

  grunt.registerTask('dev', [
    'clean:init',
    'concurrent:server',
    'connect:local',
    'watch'
  ]);

  grunt.registerTask('build', [
    'clean:init',
    'concurrent:build',
    'postcss:build'
  ]);

  grunt.registerTask('test', [
    'jekyll:check'
  ]);

  grunt.registerTask('default', [
    'dev'
  ]);
};
