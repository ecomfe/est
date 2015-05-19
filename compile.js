var fs = require('fs');
var less = require('less');
var ProgressBar = require('progress');
var Est = require('./lib/index');

// Compile main.less
var styles = fs.readFileSync('main.less', {
    encoding: 'utf8'
});
if (styles) {
    console.log('Compiling main.less...');
    less.render(styles, {
        plugins: [new Est()],
        modifyVars: {
            'support-ie-version': '11',
            'use-autoprefixer': 'false'
        }
    }).then(function (output) {
        var compiled = output.css;
        fs.writeFileSync('main.css', compiled);
        console.log('Done.');
    }, function (err) {
        console.log(err);
    }).then(compileDemos);
}

var index = fs.readFileSync('index-source.html', {
    encoding: 'utf8'
});

function compileDemos() {
    console.log('Preparing demos...');
    var pattern = /(\s+)(<pre class="usage"><code class="less">)([\s\S]+?)(<\/code><\/pre>)/g;

    var codes = [];

    index.replace(pattern, function (match, indent, start, code, end) {
        codes.push(code);
    });

    var out = {};
    var remaining = codes.length;
    var bar = new ProgressBar('Compiling demos... :percent :elapseds', { total: remaining });
    for (var i = 0, j = remaining; i < j; i++) {
        var code = codes[i];
        (function (code) {
            less.render(code, {
                plugins: [new Est()],
                modifyVars: {
                    'support-ie-version': '7',
                    'use-autoprefixer': 'false'
                }
            }).then(function (output) {
                var compiled = output.css;
                out[code] = compiled;
                done();
            }, function (err) {
                console.log(err);
                out[code] = '';
                done();
            });
        })(code);
    }

    function done() {
        remaining--;
        bar.tick();

        if (remaining === 0) {
            var newIndex = index.replace(pattern, function (match, indent, start, code, end) {
                var compiled = out[code] ? '\n' + indent + '<pre class="output"><code class="css">' + out[code] + end : '';
                return indent + start + code + end + compiled;
            });

            fs.writeFileSync(__dirname + '/index.html', newIndex, {
                encoding: 'utf8'
            });

            console.log('All done!');
        }
    }
}

