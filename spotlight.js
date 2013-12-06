(function(exports) {

    "use strict";

    var config = {
        metric: lcs,
        ignoreCase: true,
        alphabetic: true
    };

    var metrics = {};

    var filters = [];

    function lcs(s1, s2) {

        s1 = s1.split('');
        s2 = s2.split('');

        var c = [];
        var m = s1.length;
        var n = s2.length;
        var i, j;

        for (i = 0; i <= m; i++) {
            c[i] = [];
            for (j = 0; j <= n; j++) {
                c[i][j] = 0;
            }
        }

        for (i = 1; i <= m; i++) {
            for (j = 1; j <= n; j++) {
                if (s1[i - 1] === s2[j - 1]) {
                    c[i][j] = c[i - 1][j - 1] + 1;
                } else {
                    c[i][j] = Math.max(c[i][j - 1], c[i - 1][j]);
                }
            }
        }
        
        return c[m][n];
    }

    function levenshtein(s1, s2) {

        s1 = s1.split('');
        s2 = s2.split('');

        var d = [];
        var m = s1.length;
        var n = s2.length;
        var i, j;

        for (i = 0; i <= m; i++) {
            d[i] = [];
            d[i][0] = i;
        }

        for (j = 0; j <= n; j++) {
            d[0][j] = j;
        }

        for (j = 1; j <= n; j++) {
            for (i = 1; i <= m; i++) {
                if (s1[i - 1] === s2[j - 1]) {
                    d[i][j] = d[i - 1][j - 1];
                } else {
                    d[i][j] = Math.min(
                        d[i - 1][j] + 1, // a deletion
                        d[i][j - 1] + 1, // an insertion
                        d[i - 1][j - 1] + 1 // a substitution
                    );
                }
            }
        }
        
        return 1 - d[m][n] / Math.max(m, n);
    }

    function smithWaterman(s1, s2, w) {

        s1 = s1.split('');
        s2 = s2.split('');

        var h = [];
        var m = s1.length;
        var n = s2.length;
        var i, j;

        w = w || function(a1, a2) { // default gap-scoring scheme
            if (a2 == null) {
                return a1 ? 2 : -1;
            } else {
                return -1;
            }
        };

        for (i = 0; i <= m; i++) {
            h[i] = [];
            h[i][0] = 0;
            for (j = 0; j <= n; j++) {
                h[0][j] = 0;
            }
        }

        for (i = 1; i <= m; i++) {
            for (j = 1; j <= n; j++) {
                var inplace = h[i - 1][j - 1] + w(s1[i - 1] === s2[j - 1]); // match or mismatch
                var del = h[i - 1][j] + w(s1[i - 1], '-'); // deletion
                var ins = h[i][j - 1] + w('-', s2[j - 1]); // insertion
                h[i][j] = Math.max(0, inplace, del, ins);
            }
        }

        return h[m][n];
    }

    function toLowerCase(str) {
        return str.toLowerCase();
    }

    /**
     * Public API
     */
    var spotlight = {

        metrics: {},

        register: function(name, fn, isApply) {
            metrics[name] = fn;
            if (isApply) {
                config.metric = fn;
            }
        },

        search: function(needle, haystack, options) {
            var metric = config.metric;
            options = options || {};

            if (!metric) {
                throw 'No metric function found.';
            }

            var limit = options.limit || haystack.length;

            if (!needle) {
                return haystack.slice(0, limit);
            }

            if (config.ignoreCase) {
                needle = needle.toLowerCase();
            }

            return haystack.sort(function(s1, s2) {
                if (typeof options.mapper === 'function') {
                    s1 = options.mapper(s1);
                    s2 = options.mapper(s2);
                }
                if (config.ignoreCase) {
                    s1 = s1.toLowerCase();
                    s2 = s2.toLowerCase();
                }
                var result = metric(needle, s2) - metric(needle, s1);
                if (config.alphabetic && result === 0) {
                    result = s2 > s1 ? -1 : 1;
                }
                return result;
            }).slice(0, limit);
        },

        config: function(option, val) {
            if (val == null) {
                return config[option];
            } else {
                switch(option) {
                    case 'metric':
                        var metric = metrics[val];
                        if (!metric) {
                            throw 'No such registered metric function.';
                        }
                        config.metric = metric;
                        break;
                    case 'ignoreCase':
                        config.ignoreCase = !!val;
                        break;
                    default:
                        throw 'No such option.';
                }
            }
        }
    };

    spotlight.register('lcs', lcs, true);
    spotlight.register('levenshtein', levenshtein);
    spotlight.register('smithWaterman', smithWaterman);

    exports(spotlight);

})(function(api) {
    if (typeof define === 'function' && define.amd) { // AMD
        define(function() {
            return api;
        });
    } else if (typeof module === 'object' && typeof exports === 'object') { // CommonJS
        module.exports = api;
    } else { // vanilla
        this.spotlight = api;
    }
});