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
