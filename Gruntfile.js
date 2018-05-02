module.exports = (grunt) => {
    
      // Project configuration.
      grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        concat: {
            options: {
              separator: ';',
            },
            dist: {
              src: ["node_modules/jquery/dist/jquery.min.js", "node_modules/plotly.js/dist/plotly.min.js"],
              dest: 'public/js/libs.js',
            },
          }
      });
    
      // Load the plugin that provides the "concat" task.
      grunt.loadNpmTasks("grunt-contrib-concat");
    
      // Default task(s).
      grunt.registerTask("default", ["concat"]);
    
    };