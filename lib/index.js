var DEFAULT_OPTIONS = {
    autoImport: true,
    uniqueDirectives: true
};

function clone(obj) {
    var result = {};
    obj = obj || {};

    for (var key in obj) {
        result[key] = obj[key];
    }
    return result;
}

function extend(dest, source) {
    dest = dest || {};
    source = source || {};

    var result = clone(dest);
    for (var key in source) {
        result[key] = source[key];
    }
    return result;
}

function Est(options) {
    this.options = extend(DEFAULT_OPTIONS, options);
}

Est.prototype =  {
    install: function(less, pluginManager) {
        var version = less.version;

        var options = this.options;

        // won't work before 2.4.0
        if (options.autoImport && (version[0] > 2 || version[1] >= 4)) {
            require('./injector').install(less, pluginManager);
        }

        if (options.uniqueDirectives) {
            require('./unique-directives').install(less, pluginManager);
        }

        // needed before 2.3.0
        if (version[1] < 3) {
            require('./custom-functions').install(less, pluginManager);
        }
    },
    printUsage: function () {
        console.log('');
        console.log('Usage:');
        console.log('Specify plugin with `--est`.');
        console.log('');
        console.log('Arguments:');
        console.log('The argument is a query string with the available options below:');
        console.log('* `autoImport`');
        console.log('  Determines if est is automatically imported before everything else.\n  \`true`\' by default.');
        console.log('* `uniqueDirectives`');
        console.log('  Determines if est eliminates duplicate named at-rules like @keyframes or @counter-style.\n  \`true`\' by default.');
        console.log('');
        console.log('Examples:');
        console.log('lessc style.less --est="autoImport=false&uniqueDirectives=false"')
        console.log('');
    },
    setOptions: function (options) {
        options = options || {};
        var qs = '';
        if (typeof options === 'string') {
            qs = options;
            options = this.parseOptions(qs);
        }

        for (var key in options) {
            if (!(key in DEFAULT_OPTIONS)) {
                throw new Error('No such option.');
            }
        }
        if (qs.length && !Object.keys(options).length) {
            throw new Error('Invalid argument syntax.');
        }

        this.options = extend(DEFAULT_OPTIONS, options);
    },
    parseOptions: function (qs) {
        var items = qs.split('&');
        var options = {};
        items = items.filter(function (item) {
            return item.match(/^[\w_-]+=?$|^[\w_-]+=[^=]+$/);
        }).forEach(function (item) {
            var kv = item.split('=');
            var value = kv[1];
            if (value === undefined || value === '') {
                value = true;
            } else if (value.toLowerCase() === 'false') {
                value = false;
            }
            options[kv[0]] = value;
        });

        return options;
    },
    minVersion: [2, 0, 0]
};

module.exports = Est;
