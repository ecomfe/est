/**
 * @file Injector module
 * @author Justineo(justice360@gmail.com)
 */

/**
 * Get the visitor class that traces nested @-rules
 * @param {Object} less the less.js instance
 * @return {Object} the NestedVistor constructor
 */
function getNestedVisitor(less) {
    /**
     * The NestedVisitor constructor
     * @class
     * @extends less.visitors.Visitor
     */
    function NestedVisitor() {
        /**
         * The nested @-rule path logged while traversing
         * @private
         * @type {Array}
         */
        this._nested = [];

        /**
         * @override
         * @private
         */
        this._visitor = new less.visitors.Visitor(this);
    }

    /**
     * Nested conditional @-rules to be handled
     * @type {Object.<string, number>}
     */
    var nestedDirectives = {
        '@media': 1,
        '@supports': 1,
        '@document': 1
    };

    /**
     * @-rules that need duplication removal
     * @type {Object.<string, number>}
     */
    var uniqueDirectives = {
        '@keyframes': 1
    };

    /**
     * Get a standard @-rule name
     * @param {string} name an @-rule name with vendor prefix
     * @return {string} the standard @-rule name
     */
    function getNonVendorSpecificName(name) {
        var nonVendorSpecificName = name;
        if (name.charAt(1) === '-' && name.indexOf('-', 2) > 0) {
            nonVendorSpecificName = '@' + name.slice(name.indexOf('-', 2) + 1);
        }

        return nonVendorSpecificName;
    }
    NestedVisitor.prototype = {
        /**
         * @override
         */
        isReplacing: true,
        /**
         * @override
         */
        run: function (root) {
            return this._visitor.visit(root);
        },
        /**
         * @override
         */
        getPath: function (name) {
            return this._nested.concat([name]).join('/');
        },
        /**
         * @override
         */
        visitMedia: function (mediaNode) {
            var value = mediaNode.features.toCSS({compress: false});
            this._nested.push('@media ' + value);
            return mediaNode;
        },
        /**
         * @override
         */
        visitMediaOut: function () {
            this._nested.pop();
        },
        /**
         * @override
         */
        visitDirective: function (directiveNode) {
            var name = directiveNode.name;
            var nonVendorSpecificName = getNonVendorSpecificName(name);
            var processed = directiveNode;

            if (nestedDirectives[nonVendorSpecificName]) {
                this._nested.push(name + ' ' + directiveNode.value.value);
            }
            else if (uniqueDirectives[nonVendorSpecificName]) {
                processed = this.uniqueCallback(directiveNode);
            }

            return processed;
        },
        /**
         * @override
         */
        visitDirectiveOut: function (directiveNode) {
            if (!directiveNode) {
                return;
            }

            var nonVendorSpecificName = getNonVendorSpecificName(directiveNode.name);
            if (nestedDirectives[nonVendorSpecificName]) {
                this._nested.pop();
            }
        },
        /**
         * Runs when we visit a @-rule which needs duplication removal
         * @param {Object} directiveNode the directive node being visited
         * @return {Object} the modified directive node
         */
        uniqueCallback: function (directiveNode) {
            return directiveNode;
        }
    };

    return NestedVisitor;
}

/**
 * Get the visitor class that marks the last occurances of directives
 * @param {Object} less the less.js instance
 * @param {Object} uniqueMap the map which logs unique @-rule directives
 * @return {Object} the MarkUniqueVisitor constructor
 */
function getMarkUniqueVisitor(less, uniqueMap) {

    var NestedVisitor = getNestedVisitor(less);

    /**
     * The MarkUniqueVisitor constructor
     * @class
     * @extends less.visitors.Visitor
     */
    function MarkUniqueVisitor() {
        /**
         * @override
         * @private
         */
        this._visitor = new less.visitors.Visitor(this);
    }

    MarkUniqueVisitor.prototype = new NestedVisitor();
    MarkUniqueVisitor.constructor = MarkUniqueVisitor;

    /**
     * Marks the last occurrences of the @-rule directives
     * @override
     */
    MarkUniqueVisitor.prototype.uniqueCallback = function (directiveNode) {
        uniqueMap[this.getPath(directiveNode.name + ' ' + directiveNode.value.value)] = directiveNode;
        return directiveNode;
    };

    return MarkUniqueVisitor;
}

/**
 * Get the visitor class that removes duplicated directives with nested scope
 * @param {Object} less the less.js instance
 * @param {Object} uniqueMap the map which logs unique @-rule directives
 * @return {Object} the RemoveDuplicateVisitor constructor
 */
function getRemoveDuplicateVisitor(less, uniqueMap) {

    var NestedVisitor = getNestedVisitor(less);

    /**
     * The RemoveDuplicateVisitor constructor
     * @class
     * @extends less.visitors.Visitor
     */
    function RemoveDuplicateVisitor() {
        /**
         * @override
         * @private
         */
        this._visitor = new less.visitors.Visitor(this);
    }

    RemoveDuplicateVisitor.prototype = new NestedVisitor();
    RemoveDuplicateVisitor.constructor = RemoveDuplicateVisitor;

    /**
     * Remove duplicated @-rule directives
     * @override
     */
    RemoveDuplicateVisitor.prototype.uniqueCallback = function (directiveNode) {
        if (uniqueMap[this.getPath(directiveNode.name + ' ' + directiveNode.value.value)] !== directiveNode) {
            return;
        }
        return directiveNode;
    };

    return RemoveDuplicateVisitor;
}

module.exports = {
    /**
     * Installation
     * @param {Object} less the less.js instance
     * @param {Object} pluginManager less.js plugin manager instance
     */
    install: function (less, pluginManager) {
        var uniqueMap = {};
        var MarkUniqueVisitor = getMarkUniqueVisitor(less, uniqueMap);
        pluginManager.addVisitor(new MarkUniqueVisitor());
        var RemoveDuplicateVisitor = getRemoveDuplicateVisitor(less, uniqueMap);
        pluginManager.addVisitor(new RemoveDuplicateVisitor());
    }
};
