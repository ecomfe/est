est (EFE Styling Toolkit) [![NPM package](https://img.shields.io/npm/v/less-plugin-est.svg?style=flat-square)](https://www.npmjs.com/package/less-plugin-est) [![Build Status](https://img.shields.io/travis/ecomfe/est/dev.svg?style=flat-square)](https://travis-ci.org/ecomfe/est)
===

> From Middle English este, from Old English ēst (“will, consent, favour, grace, liberality, munificence, bounty, kindness, love, good pleasure, harmony, liberal gifts, luxuries”)

*Est is a mixin library based on Less which helps you write Less code more efficiently.*

Est provides over 100 handy [mixins](http://lesscss.org/features/#mixins-feature) which generate style rules only when you call them. Est doesn't provide any styles for specific HTML classe names because such “visual classe names” may contaminate HTML semantics. You can build your own style library based on est to accelerate your development.


## Quick Start

est can be included in three ways:

1. import in your Less code:

    Download the latest version:
    [.zip](https://github.com/ecomfe/est/archive/master.zip) or [.tar.gz](https://github.com/ecomfe/est/archive/master.tar.gz)

    or just clone it:

    ```bash
    $ git clone https://github.com/ecomfe/est.git
    ```

    ```less
    // quick import
    @import 'est/src/all.less';

    // override global variables
    @support-ie-version: 10;
    @default-font-size: 14px;

    // ...your own awesome less code starts here...
    ```

2. include using compile options:

    * install Less plugin:

        ```bash
        $ npm install -g less-plugin-est
        ```

    * use the plugin:

        ```bash
        $ lessc styles.less --est
        ```

3. use it programatically in Node.js apps:

    ```js
    var less = require('less');
    var Est = require('less-plugin-est');

    var src = '.box { .clearfix(); }';

    less.render(src, {
        plugins: [
            new Est()
        ]
    }).then(function (result) {
        // handle compiling result
    });
    ```

## Plugin Features & Options

Est Less plugin can take two arguments for now:

* `autoImport`

    Automatically import est code before everything. `true` by default. **Only works from Less `2.4.0`.**
     

* `uniqueDirectives`

    Eliminate duplicate named at-rules (Less calls them *directives*). This enables you to define `@keyframes` inside mixins and don't have to worry about duplicate output if you call those mixins for several times. `true` by default.

You can specify arguments like this to turn off unwanted features:

```bash
$ lessc style.less --est="autoImport=false&uniqueDirectives=false"
```

### Headsup

Less supports auto import by plugins only after version `2.4.0`. So if you are using older versions, you have to import est using `@import` directive in your Less code.

When used as a plugin, est provides `isruleset` function (which est used) which is not supported by Less before `2.3.0`.


## Docs & Demos

* [API Docs](http://ecomfe.github.io/est/) (zh_Hans)
* [Typography demos](http://ecomfe.github.io/est/example/typography.html) (zh_Hans)
* [Effects demos](http://ecomfe.github.io/est/example/effects.html) (zh_Hans)


## Contribution

Please feel free to submit [issues](https://github.com/ecomfe/est/issues) or just make pull requests.

### Unit Test

Test cases are under `test/specs`. One directory for each module and each module can have one or more spec files.

Run this under est project directory:

```bash
$ npm install
$ npm test
```
