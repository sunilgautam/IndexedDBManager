module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            scripts: {
                files: ['*.js'],
                tasks: ['uglify'],
                options: {
                    spawn: false,
                }
            }
        },
        uglify: {
            build: {
                files: {
                    'indexed-db-manager.min.js'   : ['indexed-db-manager.js']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['uglify', 'watch']);
};