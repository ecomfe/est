var fs = require('fs');
var less = require('less');
var ProgressBar = require('progress');
var Est = require('./lib/index');

var index = fs.readFileSync('index-source.html', {
    encoding: 'utf8'
});

console.log('Preparing...');
var pattern = /(\s+)(<pre class="usage"><code class="less">)([\s\S]+?)(<\/code><\/pre>)/g;

var codes = [];

index.replace(pattern, function (match, indent, start, code, end) {
    codes.push(code);
});

var out = {};
var remaining = codes.length;
var bar = new ProgressBar('Compiling... :percent :elapseds', { total: remaining });
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
            return indent + start + code + end + '\n' + indent + '<pre class="usage"><code class="css">' + out[code] + end;
        });

        fs.writeFileSync(__dirname + '/index.html', newIndex, {
            encoding: 'utf8'
        });

        console.log('All done!');
    }
}
