'use strict';

var LIVERELOAD_PORT = 35729,
	lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT}),
	gateway = require('gateway'),
	mountFolder = function (connect, dir) {
		return connect.static(require('path').resolve(dir));
	};


module.exports = function (grunt) {

	// show elapsed time at the end
	require('time-grunt')(grunt);
	// load all grunt tasks
	require('load-grunt-tasks')(grunt);


	// configurable paths
	var yeomanConfig = {
		app: 'app',
		dist: 'dist'
	};


	grunt.initConfig({
		yeoman: yeomanConfig,
		watch: {
			bower: {
				files: ['<%%= yeoman.app %>/scripts/vendor/**/*.js'],
				tasks: ['bower']
			},
			javascript: {
				files: [
					'<%%= yeoman.app %>/scripts/**/*.js',
					'!<%%= yeoman.app %>/scripts/vendor'
				],
				tasks: ['jshint']
			},<% if (preprocessorSelected === 'less') { %>
			less: {
				files: ['<%%= yeoman.app %>/styles/{,*/}*.less'],
				tasks: ['less:server']
			},<% } else if (preprocessorSelected === 'sass') { %>
			compass: {
				files: ['<%%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
				tasks: ['compass:server']
			},<% } %>
			livereload: {
				options: {
					livereload: LIVERELOAD_PORT
				},
				files: [
					'<%%= yeoman.app %>/{,*/}*.html',
					'<%%= yeoman.app %>/{,*/}*.php',
					'{.tmp,<%%= yeoman.app %>}/scripts/src/{,*/}*.js',
					'{.tmp,<%%= yeoman.app %>}/styles/{,*/}*.css',
					'<%%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
				]
			}
		},<% if (preprocessorSelected === 'sass') { %>
		compass: {
			options: {
				sassDir: '<%%= yeoman.app %>/styles',
				cssDir: '.tmp/styles',
				generatedImagesDir: '.tmp/images/generated',
				imagesDir: '<%%= yeoman.app %>/images',
				javascriptsDir: '<%%= yeoman.app %>/scripts',
				/*fontsDir: '<%%= yeoman.app %>/styles/fonts',*/
				importPath: '<%%= yeoman.app %>/bower_components',
				httpImagesPath: '/images',
				httpGeneratedImagesPath: '/images/generated',
				httpFontsPath: '/styles/fonts',
				relativeAssets: false
			},
			dist: {},
			server: {
				options: {
					debugInfo: true
				}
			}
		},<% } else if (preprocessorSelected === 'less') { %>
		less: {
			options: {
                paths: ['<%%= yeoman.app %>/styles'],
				optimization: 0
			},
			dist: {
				files: [
					{expand: true, cwd:  '<%%= yeoman.app %>/styles', src: ['*.less'], dest: '.tmp/styles', ext: '.css'}
				]
			},
			server: {
				files: [
					{expand: true, cwd:  '<%%= yeoman.app %>/styles', src: ['*.less'], dest: '.tmp/styles', ext: '.css'}
				]
			}
		},<% } %>

		php2html: {
			all: {
				options: {
				// relative links should be renamed from .php to .html
					processLinks: true
				},
				files: [
					{expand: true, cwd: yeomanConfig.app, src: ['**/*.php','!bower_components/**/*.php'], dest: yeomanConfig.dist, ext: '.html' }
				]
			}
		},

		clean: {
			server: '.tmp',
			dist: ['<%%= yeoman.dist %>/scripts/main.js','<%%= yeoman.dist %>/scripts/main.js.map'],
			bower: ['<%%= yeoman.app %>/scripts/vendor/*']
		},

		// Testing Tools
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			all: [
				'Gruntfile.js',
				'<%%= yeoman.app %>/scripts/**/*.js',
				'!<%%= yeoman.app %>/scripts/config.js',
				// no tests on external code,
				// won't make you happy
				'!<%%= yeoman.app %>/scripts/vendor/**/*.js'
				//     'test/{,*/}*.js'
			]
		},<% if (testFramework === 'qunit') { %>
		qunit: {
			all: {
				options: {
					// Pipe output console.log from your JS to grunt. False by default.
					log: true,
					urls: ['http://localhost:<%%= connect.options.port %>/test/index.html']
				}
			}
		},<% } else if (testFramework === 'mocha') { %>
		mocha: {
			all: {
				options: {
					log: true,
					// Select a Mocha reporter
					// http://visionmedia.github.com/mocha/#reporters
					// Pipe output console.log from your JS to grunt. False by default.
					reporter: 'Spec',
					urls: ['http://localhost:<%%= connect.options.port %>/test/index.html']
				}
			}
		},<% } else if (testFramework === 'jasmine') { %>
		jasmine: {
			all: {
				options: {
					specs: '<%%= yeoman.app %>/test/spec/*Spec.js',
					host: 'http://localhost:<%%= connect.options.port %>/',
					template: require('grunt-template-jasmine-requirejs'),
					templateOptions: {
						requireConfigFile: '<%%= yeoman.app %>/scripts/config.js',
						requireConfig: {
							baseUrl: '<%%= yeoman.app %>/scripts/'
						}
					}
				}
			}
		},<% } %>
		requirejs: {
			all: {
				// Options: https://github.com/jrburke/r.js/blob/master/build/example.build.js
				options: {
					baseUrl                 : '<%%= yeoman.app %>/scripts',
					name                    : '../bower_components/require',
					include                 : 'main',
					out                     : '<%%= yeoman.dist %>/scripts/main.js',
					mainConfigFile          : '<%%= yeoman.app %>/scripts/config.js',
					preserveLicenseComments : false,
					useStrict               : true,
					wrap                    : true,
					optimize                : 'uglify2',
					generateSourceMaps      : true,
					useSourceUrl            : true
				}
			}
		},
		bower: {
			options: {
				exclude: [
					'modernizr',<% if (testFramework === 'qunit') { %>
					'qunit'<% } else if (testFramework === 'mocha') { %>
					'mocha',
					'chai'<% } else if (testFramework === 'jasmine') { %>
					'jasmine'<% } %>
				]
			},
			all: {
				rjsConfig: '<%%= yeoman.app %>/scripts/config.js'
			}
		},
		imagemin: {
			dist: {
				files: [{
					expand: true,
					cwd: '<%%= yeoman.app %>/images',
					src: '{,*/}*.{png,jpg,jpeg}',
					dest: '<%%= yeoman.dist %>/images'
				}]
            }
        },
        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%%= yeoman.app %>/images',
                    src: '{,*/}*.svg',
                    dest: '<%%= yeoman.dist %>/images'
                }]
            }
        },
        cssmin: {
            dist: {
                files: {
                    '<%%= yeoman.dist %>/styles/main.css': [
                        '.tmp/styles/{,*/}*.css',
                        '<%%= yeoman.app %>/styles/{,*/}*.css'
                    ]
                }
            }
        },
        htmlmin: {
            dist: {
                options: {
                    /*removeCommentsFromCDATA: true,
                    // https://github.com/yeoman/grunt-usemin/issues/44
                    //collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeAttributeQuotes: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true*/
                },
                files: [{
                    expand: true,
                    cwd: '<%%= yeoman.app %>',
					src: '*.html',
					dest: '<%%= yeoman.dist %>'
				}]
			}
		},
		// Put files not handled in other tasks here
		copy: {
			dist: {
				files: [{
					expand: true,
					dot: true,
					cwd: '<%%= yeoman.app %>',
					dest: '<%%= yeoman.dist %>',
					src: [
						'*.{ico,png,txt}',
						'.htaccess',
						'images/{,*/}*.{webp,gif}',
						'styles/fonts/*'
					]
				}, {
					expand: true,
					cwd: '.tmp/images',
					dest: '<%%= yeoman.dist %>/images',
					src: [
						'generated/*'
					]
				}]
			}
		},
		concurrent: {
			server: [<% if (preprocessorSelected === 'sass') { %>
				'compass:server'<% } else if (preprocessorSelected === 'less') { %>
				'less:server'<% } %>
			],
			test: [<% if (preprocessorSelected === 'sass') { %>
				'compass'<% } else if (preprocessorSelected === 'less') { %>
				'less'<% } %>
			],
			dist: [<% if (preprocessorSelected === 'sass') { %>
				'compass:dist',<% } else if (preprocessorSelected === 'less') { %>
				'less:dist',<% } %>
				'imagemin',
				'svgmin',
				'htmlmin'
			]
		},
		open: {
			server: {
				path: 'http://localhost:<%%= connect.options.port %>'
			}
		},
		connect: {
			options: {
				port: 9000,
				// change this to '0.0.0.0' to access the server from outside
				hostname: 'localhost'
			},
			livereload: {
				options: {
					middleware: function (connect) {
						return [
							lrSnippet,
							gateway(__dirname + '/' + yeomanConfig.app, {
								'.php': 'php-cgi'
							}),
							mountFolder(connect, '.tmp'),
							mountFolder(connect, yeomanConfig.app)
						];
					}
				}
			},
			test: {
				options: {
					middleware: function (connect) {
						return [
							mountFolder(connect, '.tmp'),
							mountFolder(connect, yeomanConfig.app)
						];
					}
				}
			},

			dist: {
				options: {
					middleware: function (connect) {
						return [
							mountFolder(connect, yeomanConfig.dist)
						];
					}
				}
			}
		}
	});

	grunt.registerTask('server', function (target) {
		if (target === 'dist') {
			return grunt.task.run(['build', 'connect:dist:keepalive']);
		}

		grunt.task.run([
			'clean:server',
			'concurrent:server',
			'connect:livereload',
			'open:server',
			'watch'
		]);
	});



	grunt.registerTask('test',  function () {
		grunt.task.run(['jshint:all']);
<% if (testFramework === 'mocha' || testFramework === 'jasmine' || testFramework === 'qunit') { %>
		// testserver
		grunt.task.run(['clean:server', 'connect:test']);
<% } %>
<% if (testFramework === 'mocha') { %>
		// mocha
		grunt.task.run(['mocha']);
<% } else if (testFramework === 'jasmine') { %>
		// jasmine
		grunt.task.run(['jasmine']);
<% } else if (testFramework === 'qunit') { %>
		// qunit
		grunt.task.run(['qunit']);
<% } %>
	});


	grunt.registerTask('build', [
        'clean:dist',
        'useminPrepare',
        'concurrent:dist',
        'requirejs',
        'cssmin',
        'usemin'
    ]);

	grunt.registerTask('build2', [
		'bower',
		'requirejs'
	]);

	grunt.registerTask('default', [
		'test',
		'build'
	]);
};


