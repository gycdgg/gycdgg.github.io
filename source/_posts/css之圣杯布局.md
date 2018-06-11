---
title: css之圣杯布局
date: 2018-03-21 11:08:15
tags: 页面布局
category: CSS
---
## 概述
css一只是我很薄弱的一个点，也一直不够重视。最近写一个页面的时候，常见的圣杯布局就写得很难受，所以就趁机好好学习一把。哈哈

## flex
阮一峰老师写的很全面了，浅显易懂。从自己的角度理解一下

<a href = "http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html">flex布局——语法篇</a>

<a href = "http://www.ruanyifeng.com/blog/2015/07/flex-examples.html">flex布局——实例篇</a>

采用 Flex 布局的元素，称为 Flex 容器（flex container），简称"容器"。它的所有子元素自动成为容器成员，称为 Flex 项目（flex item），简称"项目"。

#### 容器（container）的属性

任何容器都可以指定为flex布局
```css
.box {
    display: flex
}
```
容器一共有以下6个属性,第一个为默认值
> 这里注释是错误的。但是。。。我懒得改了
```css
.box {
    // 项目的排列方向
    flex-direction: row | row-reverse | column | column-reverse;

    // 换行方式
    flex-wrap: nowrap | wrap | wrap-reverse;

    // flex-direction 和 flex-wrap的简写，默认为 row nowrap
    flex-flow: <flex-direction> || <flex-wrap>;

    // justify-content属性定义了项目在主轴上的对齐方式
    justify-content: flex-start | flex-end | center | space-between | space-around;

    // align-items属性定义项目在交叉轴上如何对齐。
    align-items: flex-start | flex-end | center | baseline | stretch;

    // align-content属性定义了多根轴线的对齐方式。如果项目只有一根轴线，该属性不起作用。
    align-content: flex-start | flex-end | center | space-between | space-around | stretch
}

```
#### 项目的属性

项目属性同样也有6个
```css
.item {
    // order属性定义项目的排列顺序。数值越小，排列越靠前，默认为0
    order: <integer>;

    // flex-grow属性定义项目的放大比例，默认为0，即如果存在剩余空间，也不放大。
    flex-grow: <number>; /* default 0 */

    // flex-shrink属性定义了项目的缩小比例，默认为1，即如果空间不足，该项目将缩小。
    flex-shrink:  <number>; /* default 1 */

    //  flex-basis属性定义了在分配多余空间之前，项目占据的主轴空间（main size）。浏览器根据这个属性，计算主轴是否有多余空间。它的默认值为auto，即项目的本来大小。
     flex-basis: <length> | auto; /* default auto */

    // 该属性有两个快捷值：auto (1 1 auto) 和 none (0 0 auto)。
建议优先使用这个属性，而不是单独写三个分离的属性，因为浏览器会推算相关值。
  flex: none | [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ]

  //align-self属性允许单个项目有与其他项目不一样的对齐方式，可覆盖align-items属性。默
  align-self: auto | flex-start | flex-end | center | baseline | stretch;
}
```

#### 相对定位实现

直接看demo啦
```html
    <div class="container">
        <div class="main">main</div>
        <div class="left">left</div>
        <div class="right">right</div>
    </div>
```

通过-margin和相对定位实现

```css
     .container {
        padding: 0 200px 0 150px;
        height: 100vh;
        background-color: green
    }

    .main {
        width: 100%;
        background-color: red;
        float: left
    }

    .left {
        margin-left: -100%;
        position: relative;
        right: 150px;
        width: 150px;
        background-color: blue;
        float: left
    }

    .right {
        position: relative;
        margin-left: -200px;
        left:200px;
        width: 200px;
        float: left;        
        background-color: pink
    }
```

#### 双飞翼布局
圣杯布局和双飞翼布局解决问题的方案在前一半是相同的，也就是三栏全部float浮动，但左右两栏加上负margin让其跟中间栏div并排，以形成三栏布局。不同在于解决 “中间栏div内容不被遮挡”问题的思路不一样。 

html结构有所改变
```html
    <div class="container">
        <div class="main">
            <div class="content">main</div> 
        </div>
        <div class="left">left</div>
        <div class="right">right</div>
    </div>
```

```css
    .container {
        height: 100vh;
        text-align: center;
        background-color: green
    }
    .content {
        height:100%;
        margin: 0 200px 0 150px;
    }
    .main {
        width: 100%;
        height: 100%;
        background-color: red;
        float: left
    }

    .left {
        margin-left: -100%;
        height: 100%;
        width: 150px;
        background-color: blue;
        float: left
    }

    .right {
        margin-left: -200px;
        height: 100%;
        width: 200px;
        float: left;        
        background-color: pink
    }
```
css简单了，不需要相对定位了


#### flex实现
```css
    .container {
        height: 100vh;
        display: flex;
        background-color: green
    }

    .main {
        flex: 1;
        height: 90vh;
        background-color: red;
    }

    .left {
        order: -1;
        flex: 0 0 20%;
        height: 90vh;
        background-color: blue;
    }

    .right {
        flex: 0 0 15%;
        height: 90vh;
        background-color: pink
    }

```

个人最喜欢的实现方式

#### 小节

圣杯布局和双飞翼布局解决问题的方案在前一半是相同的，也就是三栏全部float浮动，但左右两栏加上负margin让其跟中间栏div并排，以形成三栏布局。不同在于解决”中间栏div内容不被遮挡“问题的思路不一样：圣杯布局，为了中间div内容不被遮挡，将中间div设置了左右padding-left和padding-right后，将左右两个div用相对布局position: relative并分别配合right和left属性，以便左右两栏div移动后不遮挡中间div。双飞翼布局，为了中间div内容不被遮挡，直接在中间div内部创建子div用于放置内容，在该子div里用margin-left和margin-right为左右两栏div留出位置。多了1个div，少用大致4个css属性（圣杯布局中间divpadding-left和padding-right这2个属性）。


