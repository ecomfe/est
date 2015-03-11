est (EFE Styling Toolkit)
===

> From Middle English este, from Old English ēst (“will, consent, favour, grace, liberality, munificence, bounty, kindness, love, good pleasure, harmony, liberal gifts, luxuries”)

*est 是一个基于 Less 的样式工具库，帮助您更轻松地书写 Less 代码。*

est 提供了一系列方便快捷的 [mixin](http://lesscss.org/features/#mixins-feature)，只在调用时才输出代码。est 不希望提供直接给 HTML 调用的类名，用「样式类」污染 HTML 代码的语义。当然您也可以根据自己的项目需求基于 est 搭建样式类库，提供类名接口来进行快速开发。


## 快速开始

est 可以以两种方式引入您的项目：

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
