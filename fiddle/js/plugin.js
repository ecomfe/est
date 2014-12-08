(function (define, require) {
    var less = require('less');
    if (!less) {
        return;
    }

    // NestedVisitor
    var NestedVisitor = (function () {
        function NestedVisitor(uniqueMap) {
            this._nested = [];
            this._uniqueMap = uniqueMap;
            this._visitor = new less.visitors.Visitor(this);
        }

        var nestedDirectives = {
            '@media': 1,
            '@supports': 1,
            '@document': 1
        };

        var uniqueDirectives = {
            '@keyframes': 1
        };

        function getNonVendorSpecificName(name) {
            var nonVendorSpecificName = name;
            if (name.charAt(1) == '-' && name.indexOf('-', 2) > 0) {
                nonVendorSpecificName = "@" + name.slice(name.indexOf('-', 2) + 1);
            }

            return nonVendorSpecificName;
        }

        NestedVisitor.prototype = {
            isReplacing: true,
            run: function (root) {
                return this._visitor.visit(root);
            },
            getPath: function (name) {
                return this._nested.concat([name]).join('/');
            },
            visitMedia: function (mediaNode) {
                var value = mediaNode.features.toCSS({ compress: false });
                this._nested.push('@media ' + value);
                return mediaNode;
            },
            visitMediaOut: function () {
                this._nested.pop();
            },
            visitDirective: function (directiveNode) {
                var name = directiveNode.name;
                var nonVendorSpecificName = getNonVendorSpecificName(name);
                var processed = directiveNode;

                if (nestedDirectives[nonVendorSpecificName]) {
                    this._nested.push(name + ' ' + directiveNode.value.value);
                } else if (uniqueDirectives[nonVendorSpecificName]) {
                    processed = this.uniqueCallback(directiveNode);
                }

                return processed;
            },
            visitDirectiveOut: function (directiveNode) {
                if (!directiveNode) {
                    return;
                }

                var nonVendorSpecificName = getNonVendorSpecificName(directiveNode.name);
                if (nestedDirectives[nonVendorSpecificName]) {
                    this._nested.pop();
                }
            },
            uniqueCallback: function (directiveNode) {
                return directiveNode;
            }
        };

        return NestedVisitor;
    })();


    // MarkUniqueVisitor
    var MarkUniqueVisitor = (function () {
        function MarkUniqueVisitor() {
            NestedVisitor.apply(this, arguments);

            // clear the map
            for (var key in this._uniqueMap) {
                if (this._uniqueMap.hasOwnProperty(key)) {
                    delete this._uniqueMap[key];
                }
            }
        }

        MarkUniqueVisitor.prototype = new NestedVisitor();
        MarkUniqueVisitor.constructor = MarkUniqueVisitor;

        MarkUniqueVisitor.prototype.uniqueCallback = function (directiveNode) {
            this._uniqueMap[this.getPath(directiveNode.name + ' ' + directiveNode.value.value)] = directiveNode;
            return directiveNode;
        };

        return MarkUniqueVisitor;
    })();


    // RemoveDuplicateVisitor
    var RemoveDuplicateVisitor = (function () {
        function RemoveDuplicateVisitor() {
            NestedVisitor.apply(this, arguments);
        }

        RemoveDuplicateVisitor.prototype = new NestedVisitor();
        RemoveDuplicateVisitor.constructor = RemoveDuplicateVisitor;

        RemoveDuplicateVisitor.prototype.uniqueCallback = function (directiveNode) {
            if (this._uniqueMap[this.getPath(directiveNode.name + ' ' + directiveNode.value.value)] !== directiveNode) {
                return;
            }
            return directiveNode;
        };

        return RemoveDuplicateVisitor;
    })();

    var plugin = {
        install: function(less, pluginManager) {
            var uniqueMap = {};
            pluginManager.addVisitor(new MarkUniqueVisitor(uniqueMap));
            pluginManager.addVisitor(new RemoveDuplicateVisitor(uniqueMap));
        }
    };

    define('lessPluginUniqueDirectives', function (require, exports, module) {
        module.exports = plugin;
    });
})(typeof define === 'function' && define.amd ? define : function (id, factory) {

    //
    // Define it the UMD way

    if (typeof exports !== 'undefined') {
        factory(require, exports, module);
    } else {
        var mod = {};
        var exp = {};

        factory(function(value) {
            return window[value];
        }, exp, mod);

        if (mod.exports) {
            // Defining output using `module.exports`
            window[id] = mod.exports;
        } else {
            // Defining output using `exports.*`
            window[id] = exp;
        }
    }
}, typeof define === 'function' && define.amd && require ? require : function (id) {
    return window[id];
});
