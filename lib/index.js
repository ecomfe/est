function Est(options) {
    this.options = options;
}

Est.prototype =  {
    install: function(less, pluginManager) {
        require('./injector').install(less, pluginManager);
        require('./unique-directives').install(less, pluginManager);
        require('./custom-functions').install(less, pluginManager);
    },
    printUsage: function () {
        console.log('## Usage');
    },
    setOptions: function (options) {
        this.options = options;
    },
    minVersion: [2, 0, 0]
};

module.exports = Est;
