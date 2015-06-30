# Changelog
* 2.0.4 **最新**
  * 由于在 edp 发布了错误的 2.0.3 版本，跳升版本号

* 2.0.3
  * 优化了 `.font-family()` 的实现，当 IE 回退字体配置和默认配置想同时不再输出 hack
  * 优化了 `clockhand` 模块下 `.padding()` 和 `.margin()` 等 mixin 的输出，在等价情况下自动使用缩写属性值
  * 增加了插件 @ 规则去重功能的单测
  * 增加了插件代码的 JSDoc

* 2.0.2
  * 修正了 `margin-em()`、`padding-em()`、`margin-rem()` 和 `padding-rem()` 处理 0 值时的问题，并且优化了输出
  * 优化了所有 `margin-*-rem()` 和 `padding-*-rem()` 的实现

* 2.0.1
  * 修正了 `all.less` 没有默认引入 `grid.less` 的问题

* 2.0.0
  * 修正了 `.margin-em()` / `.padding-em()` / `.margin-rem()` / `.padding-rem()` 在 Less `1.5.0` 以上版本报错的问题
  * 增加了 `.rgba-background()`，实现兼容至 IE6 的半透明背景色
  * 优化了 `.font-face()` 的实现
  * 增加了 `util` 模块的多个测试用例
  * 增加了 `typography` 模块的测试用例

* 2.0.0-alpha
  * 增加 `@use-autoprefixer` 变量，默认为 `true`，此时兼容性 mixin 不自动添加前缀，交由 Autoprefixer 进行后处理
  * 增加 `@support-ie-version` 变量，默认为 `7`，其他根据 IE 版本给出的 hack 也据此设置
  * 废弃 `@support-old-ie` 变量，默认情况下仍作为兼容 IE6/7 处理；如原先进行过覆盖，请删除后使用 `@support-ie-version`
  * 根据 Autoprefixer 支持的列表和 `@use-autoprefixer` 变量增加使用 Autoprefixer 时老 mixin 的兼容
  * `.placeholder()` 现在支持传入 ruleset
  * 增加 `.background-origin`
  * 修正 `-ms-flex-wrap` 取值的错误
  * 去除了对 `-ms-flex-flow` 不必要的特殊处理
  * 去除了 `.transition-*()` 中不必要的 `-ms-` 前缀属性
  * 去除了 `.animation-*()` 中不必要的 `-ms-` 前缀属性
  * 修正 `.skew()` 的错误实现
  * 修正 `.animation-play-state()` 的默认值
  * 增加 `.transform-perspective()`
  * 修正 `.matrix3d()` 的错误名称
  * 清理了 flex 相关 mixin 中不必要的前缀属性
  * 修正了 `.flex-grow()` 和 `.flex-shrink()` 中 `-ms-` 前缀属性的实现
  * 去除了 `.justify-content()` 中 `box` 相关属性的实现
  * 规范了 `layout` 模块下的代码格式，增加了 `@support-ie-version` 的支持
  * 修正了 `.est-layout-horizontal-list()` 没有处理 `ol` 样式的问题
  * 为 `shapes` / `typography` / `util` 模块增加了 `@support-ie-version` 的支持
  * 将 `layout` 模块下的 mixin 都修改为可以自定义选择器的方式
  * 增加了 `grid` 模块，提供类似 Jeet 的栅格布局方案
  * 为多个模块补充了单测 case

* 1.3.0
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
