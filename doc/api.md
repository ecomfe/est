# est API Documentation

## variables

全局变量设置。

### `@support-old-ie`

是否添加支持IE 6/7相关的代码。

默认值：`true`。


### `@support-html5`

是否添加支持HTML5新元素相关的代码。

默认值：`true`。


### `@default-text-color`

默认的文字颜色。

默认值：`#666666`。


### `@default-input-placeholder-color`

文本输入框占位文字的默认颜色。

默认值：`#999999`。


### `@default-border-radius`

默认的圆角半径。

默认值：`5px`。


### `@default-box-shadow`

默认的元素阴影。

默认值：`0 1px 3px rgba(0, 0, 0, 0.25)`。


### `@header-z-index`

页头的默认z-index。

默认值：`1000`。


### `@footer-z-index`

页脚的默认z-index。

默认值：`1000`。


### `@modal-z-index`

浮层遮罩层的默认z-index。

默认值：`1050`。


***

## reset

基于Eric Meyer's CSS Reset。在整站中推荐使用`normalize`来初始化样式，`reset`仅建议在第三方页面局部使用。

### `.global-reset()`

进行全局reset。

***

## normalize

基于`normalize.css`，提供最基本的样式一致性及可读性。

#### 依赖于
* `variables`
* `compatibility`

### `.global-normalize()`

进行全局normalize。

***

## compatibility

提供基础的兼容性封装。

#### 依赖于
* `variables`

### `.inline-block()`

让元素表现为`display: inline-block`的状态，IE下通过`zoom: 1`近似。

### `.box-sizing()`

设定盒模型的计算方式。
```less
.box-sizing(@sizing)
```

##### 示例
```less
.box {
  .box-sizing(border-box);
}
```

### `.placeholder()`

设定文本输入框占位符的颜色。
```less
.placeholder(@color)
```
* `@color`默认为`@default-input-placeholder-color`。

### `.user-select()`

设定选区视觉显示的方式。
```less
.user-select(@type)
```

### `.opacity()`

设定不透明度。
```less
.opacity(@opacity)
```
* `@opacity`可取0-100，默认为100。

### `.border-radius()`

设定圆角。
```less
.border-radius(@radius)
.border-radius(@radius-x, @radius-y)
```
* `@radius-x`、`@radius-y`分别为水平和垂直方向的弧度；
* `@radius`默认值为`@default-border-radius`。

##### 示例
```less
.box-1 {
  .border-radius(5px);
}

.box-2 {
  .border-radius(3px 5px, 10px);
}
```

### `.border-top-left-radius()`
### `.border-top-right-radius()`
### `.border-bottom-right-radius()`
### `.border-bottom-left-radius()`

分别设定四个角的弧度。
```less
//以左上角为例
.border-top-left-radius(@radius)
.border-top-left-radius(@radius-x, @radius-y)
```
* `@radius`默认值为`@default-border-radius`；
* `@radius-x`、`@radius-y`分别为水平和垂直方向的弧度。

### `.box-shadow()`

设定元素的阴影，支持多个阴影。
```less
.box-shaodw(@shadow, ...)
```
* `@shadow`默认值为`@default-box-shadow`。

##### 示例
```less
.box-1 {
  .box-shadow(0 0 5px rgba(0, 0, 0, 0.5));
}

.box-2 {
  .box-shadow(0 -1px 0 #000, inset 0 1px 1px rgb(255, 0, 0));
}
```

### `.transition()`

过渡（transition）设定。
```less
.transition(@transition, ...)
```
每个`@transition`的写法请参考：
* [CSS Transitions](http://dev.w3.org/csswg/css-transitions/#the-transition-shorthand-property-)
* [transition - CSS|MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/transition)

##### 示例
```less
.box-1 {
  .transition(background-color 1s linear);
}

.box-2 {
  .transition(height 0.5s ease, opacity 2s linear 0.5s);
}
```

### `.transition-property()`

设定过渡（transition）相关的属性。
```less
.transition-property(@property, ...)
```

##### 示例
```less
.box-1 {
  .transition-property(background-color);
}

.box-2 {
  .transition-property(height, opacity);
}
```

### `.transition-duration()`

设定过渡（transition）的持续时间。
```less
.transition-duration(@duration, ...)
```

##### 示例
```less
.box-1 {
  .transition-duration(1s);
}

.box-2 {
  .transition-duration(0.5s, 2s);
}
```

### `.transition-timing-function()`

设定过渡（transition）的时间函数。
```less
.transition-timing-function(@timing-function, ...)
```

##### 示例
```less
.box-1 {
  .transition-timing-function(linear);
}

.box-2 {
  .transition-timing-function(ease, linear);
}
```

### `.transition-delay()`

设定过渡（transition）的延迟时间。
```less
.transition-delay(@delay, ...)
```

##### 示例
```less
.box-1 {
  .transition-delay(0);
}

.box-2 {
  .transition-delay(0, 0.5s);
}
```

### `.transform()`

变换（transform）操作。
```less
.transform(@transform-function, ...)
```
每个`@transform-function`的写法请参考：
* [CSS Transforms](http://dev.w3.org/csswg/css-transforms/#transform-property)
* [transform - CSS|MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/transform)

##### 示例
```less
.box-1 {
  .transform(matrix(1.0, 2.0, 3.0, 4.0, 5.0, 6.0));
}

.box-2 {
  .transform(translateX(10px), rotate(10deg), translateY(5px));
}
```

### `.transform-style`

设定变换是否支持3D。
```less
.transform-style(@style)
```

### `.transform-origin`

设定变换坐标原点。
```less
.transform-origin(@origin)
```

### `.backface-visibility`

设定3D变换后元素背面是否可见。
```less
.backface-visibility(@visibility)
```

### `.perspective`

设定透视距离。
```less
.perspective(@d)
```

### `.matrix()`
### `.translate()`
### `.translateX()`
### `.translateY()`
### `.scale()`
### `.scaleX()`
### `.scaleY()`
### `.rotate()`
### `.skew()`
### `.skewX()`
### `.skewY()`
### `.maxtrix3d()`
### `.translate3d()`
### `.translateZ()`
### `.scale3d()`
### `.scaleZ()`
### `.rotate3d()`
### `.rotateX()`
### `.rotateY()`
### `.rotateZ()`

单个变换函数的快捷方法，参数写法见[`.transform()`](#transform)中的参考文档。

### `.background-clip`

设定背景渲染范围。
```less
.background-clip(@clip, ...)
```

##### 示例
```less
.box-1 {
  .background-clip: content-box;
}

.box-2 {
  .background-clip: border-box, content-box;
}
```

### `.background-size`

设定背景渲染范围。
```less
.background-size(@size, ...)
```

##### 示例
```less
.box-1 {
  .background-size: cover;
}

.box-2 {
  .background-size: 50% auto, contain;
}
```

***

## util

提供常用工具函数。

#### 依赖于
* `variables`

### `.clearfix()`

清除元素内部的浮动，使元素获得应有的高度。

### `.size()`

设定元素尺寸。
```less
.size(@side-length)
.size(@width, @height)
```
* 只有一个参数时，元素为正方形，边长为`@side-length`；
* 有两个参数时，`@width`和`@height`分别为宽高。

***

## layout

提供常见的基础布局。

#### 依赖于
* `variables`
* `compatibility`
* `util`

### `.est-layout-fixed-header`

定高、相对视口固定页头布局。
```less
.est-layout-fixed-header(@height)
```
* 页头的`z-index`默认为`@header-z-index`；
* `est-header`、`est-body`为布局保留类名。

##### 示例
```html
<body>
  <div class="est-header"></div>
  <div class="est-body"></div>
</body>
```
```less
@import "normalize";

.global-normalize();

body {
  .est-layout-fixed-header(80px);
}
```

### `.est-layout-fixed-footer`

定高、相对视口固定页脚布局。
```less
.est-layout-fixed-footer(@height)
```
* 页脚的`z-index`默认为`@footer-z-index`；
* `est-body`、`est-footer`为布局保留类名。

##### 示例
```html
<body>
  <div class="est-body"></div>
  <div class="est-footer"></div>
</body>
```
```less
@import "normalize";

.global-normalize();

body {
  .est-layout-fixed-footer(80px);
}
```

### `.est-layout-sticky-footer`

当内容高度小于容器时也有显示在底部的固定高度页脚，内容高于容器后页脚会被挤压到视口外。
```less
.est-layout-sticky-footer(@height)
```
* `est-body`、`est-footer`为布局保留类名；
* 不能与其他布局混用。

##### 示例
```html
<body>
  <div class="est-body">
    <div>Content</div>

    <!-- @support-old-ie为true时需要下面的占位容器 -->
    <div class="est-footer-placeholder"></div>
  </div>
  <div class="est-footer"></div>
</body>
```
```less
@import "normalize";

.global-normalize();

html,
body {
  height: 100%;
}

body {
  .est-layout-sticky-footer(100px);
}
```

### `.est-layout-page`

定宽剧中页面布局。
```less
.est-layout-page(@width)
```

##### 示例
```html
<body>
  <div class="page"></div>
</body>
```
```less
@import "normalize";

.global-normalize();

.page {
  .est-layout-page(980px);
}
```

### `.est-layout-sidebar()`

支持左右两侧各最多一个定宽（可以是px/em/%）侧边栏，主内容区域填充剩余宽度。
```less
.est-layout-sidebar(left, @width)
.est-layout-sidebar(right, @width)
.est-layout-sidebar(@primary-width, @secondary-width)
```
* 当有两个侧边栏时，`@primary-width`为左侧宽度，`@secondary-width`为左侧宽度；
* `est-sidebar`、`est-sidebar-primary`、`est-sidebar-secondary`为布局保留类名。

##### 示例（左侧边栏）
```html
<body>
  <div class="est-main"></div>
  <div class="est-sidebar"></div>
</body>
```
```less
@import "normalize";

.global-normalize();

body {
  .est-layout-sidebar(left, 200px);
}
```


##### 示例（双侧边栏）
```html
<body>
  <div class="est-main"></div>
  <div class="est-sidebar-primary"></div>
  <div class="est-sidebar-secondary"></div>
</body>
```
```less
@import "normalize";

.global-normalize();

body {
  .est-layout-sidebar(200px, 150px);
}
```

### `.est-layout-popup()`

弹出层布局。
```less
.est-layout-popup(@position, @overlay-opacity)
```
* `@position`可取`top`/`right`/`bottom`/`left`/`center`，分别对应在视口顶部居中/右侧居中/底部居中/左侧居中/绝对居中；
* `@overlay-opacity`为遮罩层的不透明度，取值为0-100，如果为0则遮罩不显示，可以与弹出层周围的页面内容进行交互，否则则无法交互，默认值为0；
* 遮罩层的`z-index`默认值为`@modal-z-index`；
* `est-popup`为布局保留的类名。

##### 示例
```html
<body>
  <div>Content</div>
  <div class="overlay">

    <!-- @support-old-ie为true时需要下面的占位容器 -->
    <div class="est-valign-ghost"></div>

    <div class="est-popup">Popup Content</div>
  </div>
</body>
```
```less
.overlay {
  .est-layout-popup(center, 80);
}
```