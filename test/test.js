var fs = require('fs');
var path = require('path');
var less = require('less');

function extractName(file, ext) {
    var pattern = new RegExp('([^\\/\\\\]+)\\.' + ext + '$', 'i');
    var match = file.match(pattern);
    return match ? match[1] : null;
}

function log(msg) {
    process.stdout.write(msg);
}

function logLine(msg) {
    log(msg + '\n');
}

var chalk = require('chalk');
function diff(left, right) {
    require('diff').diffLines(left, right).forEach(function (item) {
        if (item.added || item.removed) {
            var text = item.value.replace('\n', '\u00b6\n').replace('\ufeff', '[[BOM]]');
            log(chalk[item.added ? 'green' : 'red'](text));
        } else {
            var value = item.value.replace('\ufeff', '[[BOM]]');
            var lines = value.split('\n');

            // max line count for each item
            var keepLines = 6;
            // lines to be omitted
            var omitLines = lines.length - keepLines;
            if (lines.length > keepLines) {
                lines.splice(Math.floor(keepLines / 2), omitLines, chalk.gray('(...' + omitLines + ' lines omitted...)'));
            }
            log(lines.join('\n'));
        }
    });
    log('\n');
}

/**
 * Get all modules
 */
var modules = ['plugin'];
var srcDir = path.resolve(__dirname, '../src');
fs.readdirSync(srcDir).forEach(function (moduleFile) {
    var module = extractName(moduleFile, 'less');
    if (!module || module.toLowerCase() === 'all') {
        return;
    }
    modules.push(module);
});

/**
 * Get test suites
 */
var suites = [];
var noTests = [];
var specDir = path.resolve(__dirname, 'specs');
modules.forEach(function (module) {
    var moduleDir = specDir + '/' + module;
    if (!fs.existsSync(moduleDir)) {
        noTests.push(module);
        return;
    }
    if (fs.statSync(moduleDir).isDirectory()) {
        var files = fs.readdirSync(moduleDir);
        if (files.length === 0) {
            noTests.push(module);
        }
        files.forEach(function (partFile) {
            var part = extractName(partFile, 'less');
            if (!part) { // .css files
                return;
            }
            var src = fs.readFileSync(path.resolve(moduleDir, partFile), {
                encoding: 'utf8'
            });

            var expected = '';
            if (fs.existsSync(path.resolve(moduleDir, part + '.css'))) {
                expected = fs.readFileSync(path.resolve(moduleDir, part) + '.css', {
                    encoding: 'utf8'
                });
            }

            suites.push({
                part: chalk.bold(module) + chalk.white('.') + part,
                src: src,
                expected: expected
            });
        });
    }
});
logLine('\u2731 No test specs found for the following module'
    + (noTests.length > 1 ? 's' : '') + ':\n'
    + noTests.join('\n') + '\n'
);

/**
 * Prepare tests
 */
var tests = [];
var est = new (require('../lib/index.js'))({});

tests = suites.map(function (suite) {
    return function (callback) {
        less.render(suite.src, {
            plugins: [est]
        }).then(
            function (result) {
                var isPassed = true;
                var actual = result.css;
                var expected = suite.expected;
                if (actual !== expected) {
                    logLine(chalk.red('\u2718 ' + suite.part));
                    diff(actual, expected);
                    isPassed = false;
                } else {
                    logLine(chalk.green('\u2714 ' + suite.part));
                }
                callback(isPassed);
            },
            function (err) {
                logLine(chalk.red('\u2718 ' + suite.part));
                logLine('Less compile error:');
                logLine(err);
                callback(false);
            }
        );
    };
});

function TestRunner(tests) {
    this.tests = tests;
    this.total = tests.length;
    this.failed = 0;
}
TestRunner.prototype.next = function () {
    var runner = this.tests.shift();
    if (runner) {
        var me = this;
        runner(function (isPassed) {
            if (!isPassed) {
                me.failed++;
            }
            me.next();
        });
    } else {
        this.end();
    }
};
TestRunner.prototype.end = function () {
    logLine('\n--------\n');
    if (!this.failed) {
        logLine('All ' + this.total + ' spec' + (this.total > 1 ? 's' : '') + ' passed.');
    } else {
        var passed = this.total - this.failed;
        logLine(
            passed + ' spec' + (passed > 1 ? 's' : '') + ' passed, '
            + this.failed + ' spec' + (this.failed > 1 ? 's' : '') + ' failed.'
        );

        // exit with code 1
        process.on('exit', function () {
            process.reallyExit(1);
        });
    }
};
TestRunner.prototype.start = function () {
    this.next();
};

var runner = new TestRunner(tests);
runner.start();
