/**
 * @file Custom functions module
 * @author Justineo(justice360@gmail.com)
 */

/**
 * The functions provided by this module
 * @private
 * @type {Object.<string, function>}
 */
var functions = null;

module.exports = {
    /**
     * Installation
     * @param {Object} less the less.js instance
     * @param {Object} pluginManager less.js plugin manager instance
     */
    install: function (less, pluginManager) {
        var functions = this.getInstance(less);
        var registry = less.functions.functionRegistry;

        for (var name in functions) {
            // only inject if not exsits
            if (functions.hasOwnProperty(name) && !registry.get(name)) {
                registry.add(name, functions[name]);
            }
        }
    },
    /**
     * Get an instance of the plugin module
     * @param {Object} less the less.js instance
     * @return {Object} the functions to be injected
     */
    getInstance: function (less) {

        var Keyword = less.tree.Keyword;
        var DetachedRuleset = less.tree.DetachedRuleset;

        var isa = function (n, Type) {
            return (n instanceof Type) ? Keyword.True : Keyword.False;
        };

        if (!functions) {
            functions = {
                isruleset: function (n) {
                    return isa(n, DetachedRuleset);
                }
            };
        }
        return functions;
    }
};
