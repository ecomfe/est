(function () {
    function $(id) {
        return document.getElementById(id);
    };

    function showCode() {
        document.body.classList.add('ready');
    }

    function hideCode() {
        document.body.classList.remove('ready');
    }

    function showCompiled() {
        document.body.classList.remove('compiling');
    }

    function hideCompiled() {
        document.body.classList.add('compiling');
    }

    function parseQuery(search) {
        var query = {};
        search = search.substring(search.indexOf('?') + 1 || search.indexOf('#') + 1);
        search.split('&').forEach(function (token) {
            var kv = token.split('=').filter(function (s) {
                return !!s.length;
            });
            if (kv.length === 2) {
                query[kv[0]] = decodeURIComponent(kv[1]);
            }
            else if (kv.length === 1) {
                query[kv[0]] = true;
            }
        });
        return query;
    }

    function stringifyQuery(query) {
        var kvs = [];

        for (var key in query) {
            kvs.push(key + '=' + encodeURIComponent(query[key]));
        }

        return kvs.join('&');
    }

    function saveSetting(key, value) {
        var current = parseQuery(location.hash);
        current[key] = value;
        location.hash = stringifyQuery(current);
    }

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
     * Initialize Less
     */
    var _LESS_VERSIONS = {};

    function loadScript(url, callback) {
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
    }

    function updateParser() {
        setTimeout(function() {
            parser = new less.Parser({
                useFileCache: true
            });
            parse();

            if (isReady) {
                showCompiled();
            } else {
                showCode();
            }
            isReady = true;
        }, 10);
    }

    function updateVersion(version) {
        version = version || lessVersion.value;
        if (isReady) {
            hideCompiled();
        } else {
            hideCode();
        }
        delete window.less;
        if (_LESS_VERSIONS[version]) {
            less = _LESS_VERSIONS[version];
            updateParser();
        } else {
            loadScript('js/less-' + version + '.min.js', function () {
                _LESS_VERSIONS[version] = less;
                updateParser();
            });
        }
    }

    /* Settings */

    // getting settings via query string
    var settings = parseQuery(location.hash);

    settings.version = settings.version || '2.0.0-b1';
    settings.est = settings.est !== 'false';
    settings.autorun = settings.autorun !== 'false';

    var lessVersion = $('less-version');
    lessVersion.value = settings.version; // init

    var useEstBox = $('use-est');
    useEstBox.checked = settings.est;

    var autoRunBox = $('auto-run');
    autoRunBox.checked = settings.autorun;

    function updateUseEst(value) {
        $('source').classList[value ? 'add' : 'remove']('est');
        parse();
    }

    lessVersion.onchange = function () {
        saveSetting('version', this.value);
        settings.version = this.value;
        updateVersion(this.value);
    };

    useEstBox.onchange = function () {
        saveSetting('est', this.checked);
        settings.est = this.checked;
        updateUseEst(this.checked);
    };

    autoRunBox.onchange = function () {
        saveSetting('autorun', this.checked);
        settings.autorun = this.checked;
        parse();
    };

    var runButton = $('run');
    runButton.onclick = function () {
        parse(true);
    };

    var imports = '@import "../src/all.less";\n';

    function getImports() {
        return settings.est ? imports : '';
    }

    function getLineNum(line) {
        return settings.est ? line - 1 : line;
    }

    function parse(isForce) {
        if (!settings.autorun && !isForce) {
            return;
        }

        var src = getImports() + est.getValue();
        if (less.render) { // 2.0.0 and above
            less.render(src, function (e, result) {
                var s = src;
                if (!e) {
                    css.setValue(result.css);
                    $('compiled').classList.remove('error');
                }
                else {
                    showError(e);
                }
            });
        }
        else {
            parser.parse(src, function (e, tree) {
                if (!e) {
                    try {
                        css.setValue(tree.toCSS());
                        $('compiled').classList.remove('error');
                    }
                    catch (e) {
                        showError(e);
                    }
                }
                else {
                    showError(e);
                }
            });
        }
    };

    function showError(e) {
        css.setValue(
            e.type + ' error: ' + e.message + '\n'
            + 'Line ' + getLineNum(e.line) + ': ' + e.extract[1]
        );
        $('compiled').classList.add('error');
    }

    var defaultCode = '@support-old-ie: false;\
\
.box {\
    .clearfix();\
    .box-shadow(0 -1px 0 #000, inset 0 1px 1px rgb(255, 0, 0));\
    .rotate(30deg);\
\
    .item {\
        .transition(transform 1s, color 1s);\
    }\
}';

    var code;
    if (settings.code) {
        code = settings.code;
    }
    else if (localStorage) {
        code = localStorage.getItem('lessCode');
    }
    else {
        code = defaultCode;
    }

    est.setValue(code);

    var t;
    est.on('change', function() {
        t && clearTimeout(t);

        if (!settings.code && localStorage) {
            localStorage.setItem('lessCode', est.getValue());
        }

        t = setTimeout(parse, 200);
    });

    /**
     * Load for the first time
     */

    var isReady = false;
    updateVersion();
})();
