est (ECOM Styling Toolkit)
===

> From Middle English este, from Old English ēst (“will, consent, favour, grace, liberality, munificence, bounty, kindness, love, good pleasure, harmony, liberal gifts, luxuries”)

*est 是一个基于 LESS 的样式工具库，帮助您更轻松地书写 LESS 代码。*

est 提供了一系列方便快捷的 [mixin](http://lesscss.org/#-mixins)，只在调用时才输出代码。est 不希望提供直接给 HTML 调用的类名，用「样式类」污染 HTML 代码的语义。当然您也可以根据自己的项目需求基于 est 搭建样式类库，提供类名接口来进行快速开发。

## 快速开始

下载最新稳定版本：
[.zip](https://github.com/ecomfe/est/archive/master.zip) 或 [.tar.gz](https://github.com/ecomfe/est/archive/master.tar.gz)

或clone最新稳定版：

```bash
$ git clone https://github.com/ecomfe/est.git
```

在 LESS 代码中引用、配置。
```less
// quick import
@import 'est/src/all.less';

// override global variables
@support-old-ie: false;
@default-font-size: 14px;

// ...your own awesome less code starts here...
```

## 文档

* [API说明](http://ecomfe.github.io/est/)
* [Typography相关示例](http://ecomfe.github.io/est/example/typography.html)
* [Effects相关示例](http://ecomfe.github.io/est/example/effects.html)

