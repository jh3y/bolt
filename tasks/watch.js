(function(){
  var fs    = require('fs'),
    styles  = require('./styles'),
    scripts = require('./scripts'),
    markup  = require('./markup'),
    utils   = require('./utils'),
    compiler = {
      styles : styles,
      scripts: scripts,
      markup : markup
    },
    watch   = function() {
      var args = utils.getArgs(process.argv);
      if (typeof args.name === 'string') {
        console.log(args.name, 'watcher started!');
      }
      if (args.dir && args.exec) {
        fs.watch(args.dir, function(event, filename) {
          if (filename) {
            console.log(filename, 'changed!');
            compiler[args.exec](filename);
          }
        });
      } else {
        throw('bolt: Directory and execution options must be defined for watch');
      }
    };
  if (require.main === module) {
    watch();
  } else {
    module.exports = watch;
  }
}(this));
