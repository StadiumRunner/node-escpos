module.exports = function (grunt) {

	grunt.initConfig({
		watch: {
			docs: {
				files: [ 'lib/*.js' ],
				tasks: [ 'jsdoc' ]
			},
			tests: {
				files: [ 'lib/*.js', 'test/*.js' ],
				tasks: [ 'nodeunit' ]
			}
		},
		nodeunit: {
			all: [ 'test/*.js' ],
			options: {
				//reporter: 'junit',
				//reporterOptions: {
				//	output: 'outputdir'
				//}
				//reporter: 'minimal'
				//reporter: 'nested'
				//reporter: 'tap'
				//reporter: 'verbose'
			}
		},
		jsdoc: {
			docs: {
				src: [ 'lib/*.js' ],
				dest: 'doc'
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');
	grunt.loadNpmTasks('grunt-jsdoc');

	grunt.registerTask('default', [ 'nodeunit', 'jsdoc' ]);

}