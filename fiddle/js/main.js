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
    var lessVersion = $('less-version');
    var version = lessVersion.value;

    lessVersion.onchange = function () {
        updateVersion(this.value);
    };

    var useEstBox = $('use-est');
    var useEst = useEstBox.checked;

    useEstBox.onchange = function () {
        useEst = this.checked;
        $('source').classList[useEst ? 'add' : 'remove']('est');
        parse();
    };

    var autoRunBox = $('auto-run');
    var isAutoRun = autoRunBox.checked;

    autoRunBox.onchange = function () {
        isAutoRun = this.checked;
        parse();
    };

    var runButton = $('run');
    runButton.onclick = function () {
        parse(true);
    };

    var imports = '@import "../src/all.less";\n';

    function getImports() {
        return useEst ? imports : '';
    }

    function getLineNum(line) {
        return useEst ? line - 1 : line;
    }

    function parse(isForce) {
        if (!isAutoRun && !isForce) {
            return;
        }
        parser.parse(getImports() + est.getValue(), function (e, tree) {
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
    };

    function showError(e) {
        css.setValue(
            e.type + ' error: ' + e.message + '\n'
            + 'Line ' + getLineNum(e.line) + ': ' + e.extract[1]
        );
        $('compiled').classList.add('error');
    }

    if (localStorage) {
        var lessCode = localStorage.getItem('lessCode');
        lessCode && est.setValue(lessCode);
    }

    var t;
    est.on('change', function() {
        t && clearTimeout(t);

        if (localStorage) {
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
