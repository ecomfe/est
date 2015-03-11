est (EFE Styling Toolkit)
===

> From Middle English este, from Old English ēst (“will, consent, favour, grace, liberality, munificence, bounty, kindness, love, good pleasure, harmony, liberal gifts, luxuries”)

*Est is a mixin library based on Less which helps you write Less code more efficiently.*

Est provides over 100 handy [mixins](http://lesscss.org/features/#mixins-feature) which generate style rules only when you call them. Est doesn't provide any styles for specific HTML classe names because such “visual classe names” may contaminate HTML semantics. You can build your own style library based on est to accelerate your development.


## Quick Start

est can be included in two ways:

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


## Docs & Demos

* [API Docs](http://ecomfe.github.io/est/) (zh_CN)
* [Typography demos](http://ecomfe.github.io/est/example/typography.html) (zh_CN)
* [Effects demos](http://ecomfe.github.io/est/example/effects.html) (zh_CN)


## Contribution

Please feel free to submit [issues](https://github.com/ecomfe/est/issues) or just make pull requests.

### Unit Test

Test cases are under `test/specs`. One directory for each module and each module can have one or more spec files.

Run this under est project directory:

```bash
$ npm install
$ npm test
```
