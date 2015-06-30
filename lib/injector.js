/**
 * @file Injector module
 * @author Justineo(justice360@gmail.com)
 */
var path = require('path');

/**
 * The singleton injector instance
 * @private
 * @type {Injector}
 */
var injector = null;

/**
 * The injecter constructor
 * @class
 * @param {Object} options the injector options
 */
function Injector(options) {
    this.options = options || {};
}

/**
 * The preprocessing method
 * @param {string} src the source code
 * @param {Object} extra extra data of the current context
 * @return {string} the processed code
 */
Injector.prototype.process = function (src, extra) {
    var injected = '@import "all.less";\n';
    var ignored = extra.imports.contentsIgnoredChars;
    var fileInfo = extra.fileInfo;
    ignored[fileInfo.filename] = ignored[fileInfo.filename] || 0;
    ignored[fileInfo.filename] += injected.length;
    if (!extra.context.paths) {
        extra.context.paths = [];
    }
    extra.context.paths.push(path.resolve(__dirname, '../src'));
    return injected + src;
};

module.exports = {
    /**
     * Installation
     * @param {Object} less the less.js instance
     * @param {Object} pluginManager less.js plugin manager instance
     */
    install: function (less, pluginManager) {
        var injector = this.getInstance(less);

        // only auto inject after 2.4.0
        if (pluginManager.addPreProcessor) {
            pluginManager.addPreProcessor(injector);
        }
    },
    /**
     * Get an instance of the preprocessor
     * @param {Object} less the less.js instance
     * @return {Object} the preprocessor instance
     */
    getInstance: function (less) {
        if (injector) {
            return injector;
        }
        injector = new Injector(this.options);
        return injector;
    }
};
