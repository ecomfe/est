/**
 * @file The main module for the plugin
 * @author Justineo(justice360@gmail.com)
 */
var DEFAULT_OPTIONS = {
    autoImport: true,
    uniqueDirectives: true
};

/**
 * Simple shallow clone
 * @param {Object} obj the object to be cloned
 * @return {Object} the clone result
 */
function clone(obj) {
    var result = {};
    obj = obj || {};

    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            result[key] = obj[key];
        }
    }
    return result;
}

/**
 * Extend the destination object with the given source
 * @param {Object} dest the object to be extended
 * @param {Object} source the source object
 * @return {Object} the extended object
 */
function extend(dest, source) {
    dest = dest || {};
    source = source || {};

    var result = clone(dest);
    for (var key in source) {
        if (source.hasOwnProperty(key)) {
            result[key] = source[key];
        }
    }
    return result;
}


/**
 * The plugin constructor
 * @class
 * @param {Object} options the plugin options
 */
function Est(options) {
    this.options = extend(DEFAULT_OPTIONS, options);
}

Est.prototype =  {
    /**
     * Installation method
     * @method
     * @param {Object} less the less.js instance
     * @param {Object} pluginManager less.js plugin manager instance
     */
    install: function (less, pluginManager) {
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
    /**
     * Prints usage
     * @method
     */
    printUsage: function () {
        console.log('');
        console.log('Usage:');
        console.log('Specify plugin with `--est`.');
        console.log('');
        console.log('Arguments:');
        console.log('The argument is a query string with the available options below:');
        console.log('* `autoImport`');
        console.log('  Determines if est is automatically imported before everything else.');
        console.log('  `true` by default.');
        console.log('* `uniqueDirectives`');
        console.log('  Determines if est eliminates duplicate named at-rules like @keyframes or @counter-style.');
        console.log('  `true` by default.');
        console.log('');
        console.log('Examples:');
        console.log('lessc style.less --est="autoImport=false&uniqueDirectives=false"');
        console.log('');
    },
    /**
     * Prints usage
     * @method
     * @param {Object} options the options object
     */
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
    /**
     * Parses the plugin options
     * @method
     * @param {string} qs the input query string
     * @return {Object} the parse result
     */
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
            }
            else if (value.toLowerCase() === 'false') {
                value = false;
            }
            options[kv[0]] = value;
        });

        return options;
    },
    /**
     * Minimum version of less.js the plugin supports
     * @member
     * @type {Array.<number>}
     */
    minVersion: [2, 0, 0]
};

module.exports = Est;
