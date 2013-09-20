est (ECOM Styling Toolkit)
===

> From Middle English este, from Old English ēst (“will, consent, favour, grace, liberality, munificence, bounty, kindness, love, good pleasure, harmony, liberal gifts, luxuries”)


est是一个基于LESS的样式工具库，帮助您更轻松地书写LESS代码。

我们不提供直接给HTML调用的类名，不希望用「样式类」污染HTML代码的语义。当然您也可以根据自己的项目需求基于est搭建样式类库，提供类名接口来进行快速开发。

## 快速开始

下载Release版本：

[直接下载文件](https://github.com/ecomfe/est/releases/)

或clone最新稳定版：

```bash
$ git clone https://github.com/ecomfe/est.git
```

在LESS文件中引用：
```less
// 快速引用所有模块
@import "est/src/all.less";

// 覆盖全局变量
@support-old-ie: false;
@default-font-size: 14px;

// ...从这里开始书写其他样式代码...
```

## 文档

* [API说明](https://github.com/ecomfe/est/blob/master/doc/api.md)
* [Typography相关示例](http://ecomfe.github.io/est/example/typography.html)
* [Effects相关示例](http://ecomfe.github.io/est/example/effects.html)

