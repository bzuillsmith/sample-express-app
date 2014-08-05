module.exports = function (grunt) {
	'use strict';
	grunt.initConfig({
		express: {
			dev: {
				options: {
					script: 'server/start.js'
				}
			}
		},
		watch: {
			'express': {
				files: ['server/**'],
				tasks: ['express'],
				options: {
					spawn: false // The express task already spawns a new process
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-express-server');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['express', 'watch']);

};