---
title: Js事件机制（上）
date: 2018-03-13 15:04:46
tags: Javascript事件
category: JavaScript
---
很早就想好好总结一下事件机制了，终于有动力写了。文章分为上下2部分
JS和HTML的交互是通过事件来实现的。事件就是文档中发生的一些特定的交互瞬间。

## 事件流
> 当浏览器发展到第四代时（IE4 和  netscape Communicator 4）,开发团队遇到了一个有意思的问题：页面的哪一部分会拥有某个特定的事件，可以想象在一张纸上画一组同心圆，如果把手指放在圆心上，那么你的手指指向的不是一个圆，而是所有的圆。2家公司看待事件的想法是一致的。当你点击了一个按钮，他们都认为是点击不仅仅发生在按钮上。也就是说 当你点击按钮，你也点击了按钮的容器元素，甚至可以说点击了整个页面。
**事件流**描述的是，页面接收事件的顺序。IE和Netscape开发团队居然提出了完全相反的事件流的概念。IE的事件流是事件冒泡流，netScape是事件捕获流。


![image](http://upload-images.jianshu.io/upload_images/7821791-664099d3b7629a47..jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
#### 事件冒泡
IE的事件流流叫事件冒泡（event bubbling）
所有的现代浏览器都是支持事件冒泡，但是具体实现上有一点区别。
*IE5.5及其更早的版本会跳过html直接到document*

#### 事件捕获
netscape 团队提出的另一种事件流叫事件捕获。事件捕获的思想是不太具体的节点应该更早的接收到事件，具体的节点应该最后接受到事件。它的目的是在事件到达预定目标之前捕获它。

#### DOM事件流
> IE9、Opera、Firefox、Chrome、Safari都是支持DOM事件流的。**IE8及更早的版本不支持**

DOM 2级事件规定事件流包括3个阶段，事件捕获阶段、处于目标阶段、事件冒泡阶段。
首先发生的事件捕获，为截取事件提供了机会。然后是实际的目标接受事件，最后一个阶段是冒泡阶段。
## DOM事件级别
Dom事件主要分为3个级别，DOM 0 级、DOM2级、DOM3级，但是还有一个HTML事件，直接内嵌在HTML里面的。

#### HTML事件
```html
<button onclick = "handleClick()">click</button>
<script>
  function handleClick(){
    console.log('do something')
  }
<script>
```
这种强耦合的的事件方法存在2个弊端，首先是时差问题，用户可能在HTML元素一渲染在页面的时候就点击按钮，但是当时的事件处理程序组可能还没有执行条件，比如这个demo中handleClick是在页面的最底部定义的，如果用户在页面解析handleClick函数之前就点击了按钮，会引发错误。
其次这种强耦合也是不被提倡的。

#### DOM 0 级事件
```html
<button id = ‘myBtn’>click</button>
<script>
  var btn = document.getElementById('myBtn')
  btn.onclick = function (){
    console.log('do something', this.id)
  }
<script>
```
DOM 0 级事件是将一个函数赋给一个dom对象的处理函数属性。
可以通过给事件处理属性赋值null来解绑事件。
这个demo中就是讲函数赋给了btn的onclick属性
通过以下的demo可以看出来，**DOM 0 级事件的处理程序会在捕获阶段被处理。**
```html
<!DOCTYPE HTML>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
    <body>
        <div id="box" style="height:100px;width:300px;background-color:pink;"></div>
        <button id="reset">还原</button>
        <script>
            //IE8-浏览器返回div body html document
            //其他浏览器返回div body html document window
            reset.onclick = function () {
                history.go();
            }
            box.onclick = function () {
                box.innerHTML += 'div\n';
            }
            document.body.onclick = function () {
                box.innerHTML += 'body\n';
            }
            document.documentElement.onclick = function () {
                box.innerHTML += 'html\n';
            }
            document.onclick = function () {
                box.innerHTML += 'document\n';
            }
            window.onclick = function () {
                box.innerHTML += 'window\n';
            }
        </script
    </body>
</html>
```

#### DOM 2 级事件
 > IE9、Firefix、Safari、Chrome、Opera支持DOM 2 级事件处理程序

Dom 2 级事件定义了2个方法，用于指定和删除事件处理程序：addEventListener 和 removeEventListener。
他们都接受3个参数
* 需要处理的事件名：click，scroll，focuse // **注意没有 on，不是onclick**
* 事件的处理函数： 可以是函数名字
* useCapture： true表示在捕获阶段调用处理程序，false表示冒泡阶段调用。*默认为false*

removeEventListener的事件处理程序函数必须与addEventListener的相同。匿名函数没办法移除
```js
btn.addEventListener("click", handleClick, true)
btn.removeEventListener("click", handleClick, true)
```
大多数情况下，都是将是将事件处理程序添加到时间流的冒泡阶段，这样可以最大限度的兼容各种浏览器，但是也不排除有些场合需要在到达目标事件之前捕获它。
```html
<!DOCTYPE HTML>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
    <body>
        <div id="box" style="height:100px;width:300px;background-color:pink;"></div>
        <button id="reset">还原</button>
        <script>
            //IE8-浏览器不支持
            //其他浏览器返回window document html body div
            reset.onclick = function () {
                history.go();
            }
            box.addEventListener('click', function () {
                box.innerHTML += 'div\n'
            }, true)
            document.body.addEventListener('click', function () {
                box.innerHTML += 'body\n';
            }, true);
            document.documentElement.addEventListener('click', function () {
                box.innerHTML += 'html\n';
            }, true);
            document.addEventListener('click', function () {
                box.innerHTML += 'document\n';
            }, true);
            window.addEventListener('click', function () {
                box.innerHTML += 'window\n';
            }, true);
        </script>
    </body>
</html>
```
#### DOM 3 级事件
DOM3级事件在DOM2级事件的基础上添加了更多的事件类型，全部类型如下：
* UI事件，当用户与页面上的元素交互时触发，如：load、scroll
* 焦点事件，当元素获得或失去焦点时触发，如：blur、focus
* 鼠标事件，当用户通过鼠标在页面执行操作时触发如：dbclick、mouseup
* 滚轮事件，当使用鼠标滚轮或类似设备时触发，如：mousewheel
* 文本事件，当在文档中输入文本时触发，如：textInput
* 键盘事件，当用户通过键盘在页面上执行操作时触发，如：keydown、keypress
* 合成事件，当为IME（输入法编辑器）输入字符时触发，如：compositionstart
* 变动事件，当底层DOM结构发生变化时触发，如：DOMsubtreeModified
同时DOM3级事件也允许使用者自定义一些事件。

### IE事件处理程序
> 支持IE事件处理程序的浏览器只有IE和Opera

上文说到IE9以后才支持addEventListener和removeEventListener，IE9以前浏览器有类似的方法，attachEvent和detachEvent，但是这2个方法只接受2个参数，事件名称和事件处理程序函数。由于IE8及其之前的版本并不支持DOM事件流，只有事件冒泡，所以没有第三个参数也是意料之中的。
那这个和DOM 0 级事件有什么区别呢？
DOM 0 级事件处理函数中的this指代的是当前DOM元素，attachEvent中this指代的是window
```js
let btn = document.getElementById("myBtn")
btn.attachEventListener("onclick",function(){
  console.log("clicked")
})
btn.attachEventListener("onclick",function(){
  console.log("hello world")
})
```
顺序是先hello world 再clicked，这是和addEventListener不一样的地方。还有就是"click"&&"onclick"

## 小结
本文介绍了事件流和几种不同级别的DOM事件，不同浏览器的处理方式需要认真对待。

