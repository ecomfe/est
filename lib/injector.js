var path = require('path');
var injector = null;

module.exports = {
    install: function (less, pluginManager) {
        var injector = this.getInstance(less);

        // only auto inject after 2.4.0
        if (pluginManager.addPreProcessor) {
            pluginManager.addPreProcessor(injector);
        }
    },
    getInstance: function (less) {
        if (!injector) {
            var FileManager = less.FileManager;

            function Injector(options) {
                this.options = options || {};
            }

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

            injector = new Injector(this.options);
        }
        return injector;
    }
};
