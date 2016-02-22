(function(global) {
  var ipcRenderer = require('electron').ipcRenderer
  var remote = require('electron').remote

  var UNDEFINED,
  exportObject;

  if (typeof module !== "undefined" && module.exports) {
    exportObject = global.jasmineReporters = global.jasmineReporters || {}
  } else {
    exportObject = global.jasmineReporters = global.jasmineReporters || {};
  }

  function trim(str) { return str.replace(/^\s+/, "" ).replace(/\s+$/, "" ); }
  function elapsed(start, end) { return (end - start)/1000; }
  function isFailed(obj) { return obj.status === "failed"; }
  function isSkipped(obj) { return obj.status === "pending"; }
  function isDisabled(obj) { return obj.status === "disabled"; }
  function isPassed(obj) { return obj.status === "passed"; }

  function extend(dupe, obj) { // performs a shallow copy of all props of `obj` onto `dupe`
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        dupe[prop] = obj[prop];
      }
    }
    return dupe;
  }
  function log(str) {
    var con = global.console || console;
    if (con && con.log) {
      con.log(str);
    }
  }


  /**
  * TAP (http://en.wikipedia.org/wiki/Test_Anything_Protocol) reporter.
  * outputs spec results to the console.
  *
  * Usage:
  *
  * jasmine.getEnv().addReporter(new jasmineReporters.TapReporter());
  */
  exportObject.ElectronReporter = function() {
    var self = this;
    self.started = false;
    self.finished = false;

    var startTime,
    endTime,
    currentSuite = null,
    totalSpecsExecuted = 0,
    totalSpecsSkipped = 0,
    totalSpecsDisabled = 0,
    totalSpecsFailed = 0,
    totalSpecsDefined,
    // when use use fit, jasmine never calls suiteStarted / suiteDone, so make a fake one to use
    fakeFocusedSuite = {
      id: 'focused',
      description: 'focused specs',
      fullName: 'focused specs'
    };

    var __suites = {}, __specs = {};
    function getSuite(suite) {
      __suites[suite.id] = extend(__suites[suite.id] || {}, suite);
      return __suites[suite.id];
    }
    function getSpec(spec) {
      __specs[spec.id] = extend(__specs[spec.id] || {}, spec);
      return __specs[spec.id];
    }
    function printMsg(message) {
      log(message);
      ipcRenderer.send('test-logs', message);
    }

    self.jasmineStarted = function(summary) {
      self.started = true;
      totalSpecsDefined = summary && summary.totalSpecsDefined || NaN;
      startTime = exportObject.startTime = new Date();
    };
    self.suiteStarted = function(suite) {
      suite = getSuite(suite);
      currentSuite = suite;
      printMsg(' ' + suite.description);
    };
    self.suiteEnded = function(suite) {
      suite = getSuite(suite);
      currentSuite = suite;
      printMsg('\n');
    };
    self.specStarted = function(spec) {
      if (!currentSuite) {
        // focused spec (fit) -- suiteStarted was never called
        self.suiteStarted(fakeFocusedSuite);
      }
      spec = getSpec(spec);
      totalSpecsExecuted++;
      spec._suite = currentSuite;
    };
    self.specDone = function(spec) {
      spec = getSpec(spec);
      var resultStr = spec.description;
      if (isFailed(spec)) {
        var failedStr = ' ✗ ';
        totalSpecsFailed++;
        resultStr = failedStr + resultStr;
        for (var i = 0, failure; i < spec.failedExpectations.length; i++) {
          failure = spec.failedExpectations[i];
          failedStr += '\n ' + trim(failure.message);
          if (failure.stack && failure.stack !== failure.message) {
            failedStr += '\n === STACK TRACE ===';
            failedStr += '\n ' + failure.stack;
            failedStr += '\n === END STACK TRACE ===';
          }
        }
      }
      if (isSkipped(spec)) {
        totalSpecsSkipped++;
        var skippedStr = ' - '
        resultStr = skippedStr + resultStr
      }
      if (isDisabled(spec)) {
        totalSpecsDisabled++;
        var skippedStr = ' - '
        resultStr = skippedStr + resultStr
      }
      if (isPassed(spec)) {
        var successStr = ' ✓ '
        resultStr = successStr + resultStr
      }

      printMsg(resultStr);
    };
    self.suiteDone = function(suite) {
      suite = getSuite(suite);
      if (suite._parent === UNDEFINED) {
        // disabled suite (xdescribe) -- suiteStarted was never called
        self.suiteEnded(suite);
      }
      currentSuite = suite._parent;
    };
    self.jasmineDone = function() {
      if (currentSuite) {
        // focused spec (fit) -- suiteDone was never called
        self.suiteDone(fakeFocusedSuite);
      }
      endTime = new Date();
      var dur = elapsed(startTime, endTime),
      totalSpecs = totalSpecsDefined || totalSpecsExecuted,
      disabledSpecs = totalSpecs - totalSpecsExecuted + totalSpecsDisabled;

      if (totalSpecsExecuted === 0) {
        printMsg(' 1..0 # All tests disabled');
      } else {
        printMsg(' 1..' + totalSpecsExecuted);
      }
      var diagStr = '#';
      diagStr = ' # ' + totalSpecs + ' spec' + (totalSpecs === 1 ? '' : 's');
      diagStr += ', ' + totalSpecsFailed + ' failure' + (totalSpecsFailed === 1 ? '' : 's');
      diagStr += ', ' + totalSpecsSkipped + ' skipped';
      diagStr += ', ' + disabledSpecs + ' disabled';
      diagStr += ' in ' + dur + 's.';

      printMsg(diagStr);
      printMsg(' # NOTE: disabled specs are usually a result of xdescribe.');

      self.finished = true;
      // this is so phantomjs-testrunner.js can tell if we're done executing
      exportObject.endTime = endTime;
      // Quit the electron app
      remote.app.quit();
    };
  };
})(this);
