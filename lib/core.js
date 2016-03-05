'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

require('colors');
var winston = require('winston'),
    fs = require('fs');

var BoltInstance = function () {
  function BoltInstance() {
    _classCallCheck(this, BoltInstance);

    /**
      * When creating an instance, we want to register tasks
      * gathered from "bolt.tasks" directory.
    */
    this.tasks = {};
    var tasks = fs.readdirSync('bolt.tasks');
    try {
      this.registerTasks(tasks);
    } catch (err) {
      winston.error(err.toString());
    }
  }

  _createClass(BoltInstance, [{
    key: 'runTask',
    value: function runTask(name) {
      if (this.tasks[name]) this.tasks[name].run();
    }
  }, {
    key: 'info',
    value: function info() {
      var taskList = '\n';
      if (Object.keys(this.tasks).length > 0) for (var task in this.tasks) {
        taskList += '     ' + task.green + ': ' + this.tasks[task].doc.cyan + '\n';
      }var header = 'Available task to run:\n';
      winston.info('' + header + taskList);
    }
  }, {
    key: 'registerTasks',
    value: function registerTasks(files) {
      if (files.length === 0) throw new Error('No tasks in ./bolt.tasks/');
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = files[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var file = _step.value;

          var taskOpts = require(process.cwd() + '/bolt.tasks/' + file);
          this.tasks[taskOpts.name] = new BoltTask(taskOpts, this);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }]);

  return BoltInstance;
}();

var defaults = {
  name: 'compile:scripts',
  doc: 'compiles runtime JavaScript files',
  deps: ['winston'],
  func: function func(w) {
    w.info('hello');
  }
};

/**
  * whar does a task need to do?
  *
  * be Generic
  * be lightweight
  * self documented
  * super flexible
  * no pipes, no config files, just pure script.
  *
  * Can I do bolt scripts styles markup
  * Should this actually be watch glob?
  * bolt watch -d src/js -t scripts
  * I think maybe because watching is quite a challenge. If you want to create
  * a watcher, you create it as a task that runs???
  * should it really be one task per file or can I have multiple?? as an array?
  * can't differentiate between type array and type object, length???
  *
*/

var BoltTask = function () {
  function BoltTask() {
    var opts = arguments.length <= 0 || arguments[0] === undefined ? defaults : arguments[0];
    var daddy = arguments[1];

    _classCallCheck(this, BoltTask);

    this.name = opts.name;
    this.doc = opts.doc;
    this.func = opts.func;
    if (opts.deps.length > 0) {
      this.deps = [];
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = opts.deps[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var dep = _step2.value;

          if (dep !== 'bolt') this.deps.push(require(dep));else this.deps.push(daddy);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  }

  _createClass(BoltTask, [{
    key: 'info',
    value: function info() {
      winston.info(this.name + ': ' + this.doc);
    }
  }, {
    key: 'run',
    value: function run() {
      winston.info('Running ' + this.name);
      // gather deps here and pass them in.
      if (this.func && typeof this.func === 'function')
        // convert array to parameters here and pass into function.
        this.func.apply(this, _toConsumableArray(this.deps));
    }
  }]);

  return BoltTask;
}();

exports.BoltInstance = BoltInstance;
exports.BoltTask = BoltTask;