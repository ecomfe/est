/* Visitor that traces nested @-rules */
function getNestedVisitor(less) {
    function NestedVisitor() {
        this._nested = [];
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
}

/* Visitor marks the last occurances of directives */
function getMarkUniqueVisitor(less, uniqueMap) {

    var NestedVisitor = getNestedVisitor(less);

    function MarkUniqueVisitor() {
        this._visitor = new less.visitors.Visitor(this);
    }

    MarkUniqueVisitor.prototype = new NestedVisitor();
    MarkUniqueVisitor.constructor = MarkUniqueVisitor;

    MarkUniqueVisitor.prototype.uniqueCallback = function (directiveNode) {
        uniqueMap[this.getPath(directiveNode.name + ' ' + directiveNode.value.value)] = directiveNode;
        return directiveNode;
    };

    return MarkUniqueVisitor;
}

/* Visitor removes duplicated directives with nested scope */
function getRemoveDuplicateVisitor(less, uniqueMap) {

    var NestedVisitor = getNestedVisitor(less);

    function RemoveDuplicateVisitor() {
        this._visitor = new less.visitors.Visitor(this);
    }

    RemoveDuplicateVisitor.prototype = new NestedVisitor();
    RemoveDuplicateVisitor.constructor = RemoveDuplicateVisitor;

    RemoveDuplicateVisitor.prototype.uniqueCallback = function (directiveNode) {
        if (uniqueMap[this.getPath(directiveNode.name + ' ' + directiveNode.value.value)] !== directiveNode) {
            return;
        }
        return directiveNode;
    };

    return RemoveDuplicateVisitor;
}

module.exports = {
    install: function (less, pluginManager) {
        var uniqueMap = {};
        var MarkUniqueVisitor = getMarkUniqueVisitor(less, uniqueMap);
        pluginManager.addVisitor(new MarkUniqueVisitor());
        var RemoveDuplicateVisitor = getRemoveDuplicateVisitor(less, uniqueMap);
        pluginManager.addVisitor(new RemoveDuplicateVisitor());
    }
}
