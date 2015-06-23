est (EFE Styling Toolkit) [![NPM package](https://img.shields.io/npm/v/less-plugin-est.svg?style=flat-square)](https://www.npmjs.com/package/less-plugin-est) [![Build Status](https://img.shields.io/travis/ecomfe/est/dev.svg?style=flat-square)](https://travis-ci.org/ecomfe/est)
===

> From Middle English este, from Old English ēst (“will, consent, favour, grace, liberality, munificence, bounty, kindness, love, good pleasure, harmony, liberal gifts, luxuries”)

*est 是一个基于 Less 的样式工具库，帮助您更轻松地书写 Less 代码。*

est 提供了一系列方便快捷的 [mixin](http://lesscss.org/features/#mixins-feature)，只在调用时才输出代码。est 不希望提供直接给 HTML 调用的类名，用「样式类」污染 HTML 代码的语义。当然您也可以根据自己的项目需求基于 est 搭建样式类库，提供类名接口来进行快速开发。


## 快速开始

est 可以以三种方式引入您的项目：

1. Less 代码中引入：

    下载最新稳定版本：
    [.zip](https://github.com/ecomfe/est/archive/master.zip) 或 [.tar.gz](https://github.com/ecomfe/est/archive/master.tar.gz)

    或clone最新稳定版：

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

2. 使用 Less 插件在编译时引入：

    * 安装插件：

        ```bash
        $ npm install -g less-plugin-est
        ```

    * 调用插件：

        ```bash
        $ lessc styles.less --est
        ```

3. 在 Node.js 中以编程方式调用:

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


## 插件功能及选项

est 的 Less 插件目前接受两个可选项：

* `autoImport`

    自动在所有代码前引入 est。默认值为 `true`。**只在 Less `2.4.0` 及后续版本中有效。**
     

* `uniqueDirectives`

    为所有具名 At 规则去重（Less 中称为*指令*）。这将让您可以在 mixin 内部定义 `@keyframes`，又不必担心在多次调用后重复输出的问题。默认值为 `true`。

如果需要关闭不需要的功能，您可以按如下方式指定参数：

```bash
$ lessc style.less --est="autoImport=false&uniqueDirectives=false"
```

### 注意事项

est 支持的 Less 最低版本号为 `2.0.0`。

Less 只在 `2.4.0` 之后的版本才支持通过插件自动引入代码。所以如果您正在使用更老的版本，就只能通过在 Less 代码中使用 `@import` 来引入 est 了。

另外，作为插件使用时，est 支持 Less `2.3.0` 以前不支持的 `isruleset` 函数（est 代码中有使用）。

## 文档

* [API说明](http://ecomfe.github.io/est/)
* [Typography相关示例](http://ecomfe.github.io/est/example/typography.html)
* [Effects相关示例](http://ecomfe.github.io/est/example/effects.html)


## 贡献

欢迎提交 [issue](https://github.com/ecomfe/est/issues) 发表反馈意见或直接发送 pull request。

### 单测

单测用例在 `test/specs` 目录下，每个模块一个目录，下面可能拆成多个 spec 文件，也可能只含一个。

在 est 项目目录下，运行：

```bash
$ npm install
$ npm test
```
