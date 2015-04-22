(function () {

    function $(id) {
        return document.getElementById(id);
    };

    var util = {};

    util.parseQuery = function (search) {
        var query = {};
        search = search.substring(search.indexOf('?') + 1 || search.indexOf('#') + 1);
        search.split('&').forEach(function (token) {
            var kv = token.split('=').filter(function (s) {
                return !!s.length;
            });
            if (kv.length === 2) {
                query[kv[0]] = decodeURIComponent(kv[1]);
            } else if (kv.length === 1) {
                query[kv[0]] = true;
            }
        });
        return query;
    };

    util.stringifyQuery = function (query) {
        var kvs = [];

        for (var key in query) {
            kvs.push(key + '=' + encodeURIComponent(query[key]));
        }

        return kvs.join('&');
    };

    util.saveSetting = function (key, value, isRewrite) {
        var current = util.parseQuery(window.location.hash);
        current[key] = value;

        var hash = util.stringifyQuery(current);
        if (isRewrite !== false) {
            window.location.hash = hash;
        }
        return hash;
    };

    util.loadScript = function (url, callback) {
        function doCallback() {
            if (typeof callback === 'function') {
                callback();
            }
        }

        var elem = document.createElement('script');
        elem.type = 'text/javascript';
        elem.charset = 'utf-8';
        if (elem.addEventListener) {
            elem.addEventListener('load', doCallback, false);
        } else { // IE
            elem.attachEvent('onreadystatechange', doCallback);
        }
        elem.src = url;
        document.getElementsByTagName('head')[0].appendChild(elem);
    };

    util.formPost = function (url, data) {
        var form = document.createElement('form');
        form.method = 'POST';
        form.action = url;
        form.target = '_blank';
        for (var key in data) {
            var field = document.createElement('textarea');
            field.name = key;
            field.value = data[key];
            form.appendChild(field);
        }
        document.body.appendChild(form);
        form.submit();
        form.parentNode.removeChild(form);
    };

    var timers = {};

    /**
     * Initialize code editors
     */
    var est = CodeMirror.fromTextArea($('est'), {
        mode: 'text/x-less',
        theme: 'monokai',
        indentUnit: 4,
        lineNumbers : true,
        matchBrackets : true
    });

    var css = CodeMirror.fromTextArea($('css'), {
        mode: 'css',
        theme: 'monokai',
        indentUnit: 4,
        lineNumbers : true,
        matchBrackets : true,
        readOnly: true
    });

    /**
     * Initialize settings
     */
    var vm = util.parseQuery(window.location.hash);

    var lessVersions = [{
        label: '2.5.x',
        options: ['2.5.0']
    }, {
        label: '2.4.x',
        options: ['2.4.0']
    }, {
        label: '2.3.x',
        options: ['2.3.1', '2.3.0']
    }, {
        label: '2.2.x',
        options: ['2.2.0']
    }, {
        label: '2.1.x',
        options: ['2.1.2', '2.1.1', '2.1.0']
    }, {
        label: '2.0.x',
        options: ['2.0.0']
    }, {
        label: '1.7.x',
        options: ['1.7.5', '1.7.4', '1.7.3', '1.7.2', '1.7.1', '1.7.0']
    }, {
        label: '1.6.x',
        options: [/*'1.6.3', */'1.6.2', '1.6.1', '1.6.0']
    }, {
        label: '1.5.x',
        options: ['1.5.1', '1.5.0']
    }, {
        label: '1.4.x',
        options: ['1.4.2', '1.4.1', '1.4.0']
    }];

    vm.version = vm.version || lessVersions[0].options[0];
    vm.est = vm.est !== 'false';
    vm.autorun = vm.autorun !== 'false';
    vm.versions = lessVersions;
    vm.autoprefix = vm.autoprefix !== 'false';

    vm.message = '';
    vm.toast = '';
    vm.isReady = false;
    vm.isCompiling = false;
    vm.isDiscussing = false;
    vm.isError = false;


    /**
     * Initialize Less
     */
    var lessInstances = {};

    /**
     * Initialize ViewModel
     */
    var fiddle = new Vue({
        el: 'body',
        data: vm,
        computed: {
            bodyClass: {
                get: function () {
                    var states = {
                        ready: this.isReady,
                        compiling: this.isCompiling,
                        discussing: this.isDiscussing,
                        error: this.isError,
                        auto: this.autorun,
                        est: this.est,
                        autoprefix: this.autoprefix
                    };
                    var classes = [];
                    for (var state in states) {
                        if (states[state]) {
                            classes.push(state);
                        }
                    }
                    return classes.join(' ');
                }
            },
            imports: {
                get: function () {
                    return this.est ? '@import "../src/all.less";\n' : '';
                }
            },
            lineNumOffset: {
                get: function () {
                    return this.est ? -1 : 0;
                }
            }
        },
        methods: {
            updateUrl: function (e) {
                var code = est.getValue();
                var hash = util.saveSetting('code', btoa(code), false);
                var url = window.location.href.split('#')[0] + '#' + hash;
                link.value = url;
                link.select();
            },

            launchJSFiddle: function () {
                var api = 'http://jsfiddle.net/api/post/library/pure/';
                var data = {
                    css: css.getValue(),
                    title: 'estFiddle to JSFiddle'
                };

                util.formPost(api, data);
            },

            launchCodePen: function () {
                var api = 'http://codepen.io/pen/define';
                var data = {
                    css: css.getValue(),
                    title: 'estFiddle to JSFiddle'
                };

                util.formPost(api, {
                    data: JSON.stringify(data)
                });
            },

            updateVersion: function (version) {
                version = version || this.version;
                if (this.isReady) {
                    this.compiling = true;
                }

                delete window.less;
                if (lessInstances[version]) {
                    less = lessInstances[version];
                    this.updateParser();
                } else {
                    var url = 'https://rawgit.com/less/less.js/v' + version
                        + '/dist/less' + (version.charAt(0) === '1' ? '-' + version : '') + '.min.js';
                    var me = this;
                    me.showLoading('Loading Less v' + version + '...');
                    util.loadScript(url, function () {
                        me.hideMessage();
                        lessInstances[version] = less;
                        me.updateParser();
                    });
                }
            },

            updateParser: function () {
                var me = this;
                setTimeout(function() {
                    if (!less.render) { // below 2.0.0
                        parser = new less.Parser({
                            useFileCache: true
                        });
                        me.doParse();
                    } else {
                        // init plugins
                        if (window['lessPluginUniqueDirectives']) {
                            me.doParse();
                        } else {
                            util.loadScript('dist/plugin.min.js', function () {
                                me.doParse();
                            });
                        }
                    }
                }, 10);
            },

            doParse: function () {
                this.isReady = true;
                this.parse();
                this.isCompiling = false;
            },

            showMessage: function (msg) {
                this.message = msg;
            },

            hideMessage: function () {
                this.message = '';
            },

            showLoading: function (msg) {
                this.showMessage('<i class="fa fa-spinner"></i> ' + msg);
            },

            parse: function (isForce) {
                if (!this.autorun && !isForce) {
                    return;
                }

                var me = this;
                if (!window['autoprefixer'] && this.autoprefix) {
                    me.showLoading('Loading Autoprefixer...');
                    util.loadScript('https://rawgit.com/ai/autoprefixer-rails/master/vendor/autoprefixer.js', function () {
                        me.hideMessage();
                        me.parse(isForce);
                    });
                    return;
                }

                var src = this.imports + est.getValue();
                if (less.render) { // 2.0.0 and above
                    var options = {};

                    if (me.est) {
                        options.plugins = [lessPluginUniqueDirectives];
                    }
                    less.render(src, options)
                        .then(function (output) {
                            var compiled = output.css;
                            if (me.autoprefix && autoprefixer) {
                                compiled = autoprefixer({ browsers: '> 1%' }).process(compiled, { safe: true }).css;
                            }
                            css.setValue(compiled);
                            me.isError = false;
                        }, function (error) {
                            me.showError(error);
                        });
                } else {
                    parser.parse(src, function (e, tree) {
                        if (!e) {
                            try {
                                css.setValue(tree.toCSS());
                                me.isError = false;
                            }
                            catch (e) {
                                me.showError(e);
                            }
                        } else {
                            me.showError(e);
                        }
                    });
                }
            },

            showError: function (e) {
                css.setValue(
                    e.type + ' error: ' + e.message + '\n'
                    + 'Line ' + (e.line + this.lineNumOffset) + ': ' + e.extract[1]
                );
                this.isError = true;
            }
        },
        created: function () {
            var me = this;
            ['est', 'autoprefix', 'autorun', 'version'].forEach(function (key) {
                me.$watch(key, function (newVal, oldVal) {
                    util.saveSetting(key, newVal, true);
                });
            });
        },
        ready: function () {
            var defaultCode;
            if (this.est) {
                defaultCode = [
                    '@support-ie-version: 10;',
                    '',
                    '.spin() {',
                    '    animation: rotate 1s linear infinite;',
                    '    @keyframes rotate {',
                    '       0%   { .rotate(0deg);   }',
                    '       100% { .rotate(360deg); }',
                    '    }',
                    '}',
                    '',
                    '.container {',
                    '    .clearfix();',
                    '',
                    '    .item {',
                    '        float: left;',
                    '        .circle(64px);',
                    '        .linear-gradient(30deg, lightgreen 0%, skyblue 100%);',
                    '        .spin();',
                    '    }',
                    '}'
                ].join('\n');
            } else {
                defaultCode = '';
            }

            var code;
            if (this.code) {
                code = atob(this.code);
            } else if (localStorage) {
                code = localStorage.getItem('lessCode');
            }

            est.setValue(code || defaultCode);

            var t;
            var me = this;
            est.on('change', function() {
                t && clearTimeout(t);

                if (!settings.code && localStorage) {
                    localStorage.setItem('lessCode', est.getValue());
                }

                t = setTimeout(function () {
                    me.parse();
                }, 200);
            });
            this.updateVersion();

            ZeroClipboard.config({ swfPath: 'js/ZeroClipboard.swf' });
            var client = new ZeroClipboard($('share'));
            client.on('ready', function () {
                client.on('copy', function (e) {
                    me.updateUrl();
                    e.clipboardData.setData('text/plain', $('link').value);
                });
                client.on('aftercopy', function (e) {
                    me.toast = '<i class="fa fa-check"></i> Copied!';
                    if (timers.toast) {
                        clearTimeout(timers.toast);
                    }
                    timers.toast = setTimeout(function () {
                        me.toast = '';
                    }, 2000);
                });
            });
        }
    });
})();
