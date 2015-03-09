var path = require('path');
var functions = null;

module.exports = {
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
