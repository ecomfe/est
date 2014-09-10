# Changelog
* 1.3.0 **最新**
  * 增加 `shapes` 模块，目前提供绘制直角三角形、圆形的功能
  * 增加 `clockhand` 模块，提供顺时针简写功能
  * 增加了 OpenType 相关 normalize 功能（使用了 [Normalize-OpenType.css](https://github.com/kennethormandy/normalize-opentype.css)）
  * 增加单行文字垂直居中功能

* 1.2.2
  * 修正 [#21 处理参数中 `url()` 表达式时无法同时兼顾 `'` 和 `"`](https://github.com/ecomfe/est/issues/21) 中提到的问题
  * 修正 `.animation()` 输出多逗号的问题

* 1.2.1
  * 修正 `.transition()` 输出多逗号的问题
  * 依赖的 less 版本提高到 `~1.6.3`

* 1.2.0
  * 修正了渐变结果中没有输出 `-o-` 前缀代码的问题
  * 增加了伸缩盒布局相关的兼容性实现（分为 box / flex 两种版本）

* 1.1.0
  * 修正了 `.animation()` 的错误实现
  * 切换到 [semver](http://semver.org/)
  * 在所有输出 `url()` 的地方提供直接输入 url 表达式作为参数的功能，以在开启 `--relative-urls`（`-ru`）参数时能正常工作。见此 [issue](https://github.com/ecomfe/est/issues/15)
  * 修复了文档页面 Chrome 下抖动的问题

* 1.0.2
  * 增加了 `margin-rem` / `margin-em` / `padding-rem` / `padding-em` 等相关功能
  * 增加了对渐变的支持
  * 增加了对同一边两个角设定 `border-radius` 的功能
  * 修正了 `.border-*-*-radius()` 的错误实现
  * 修正了 `.box-shadow()` 在单值下参数中调用函数时可能出现的错误
  * 调整了一些代码风格，增加了一些注释
  * `.no-bullet()` 和 `.no-bullets()` 被弃置，不推荐使用
  * 重写了文档和项目主页，可以通过 [http://ecomfe.github.io/est/](http://ecomfe.github.io/est/) 来访问
  * 增加了 LICENSE 文件

* 1.0.1
  * 增加font-family相关支持
  * 增加`effects`模块
  * 增加`compatibility`中`animation`相关的功能
  * bug修复

* 1.0.0
  * 最初版本
