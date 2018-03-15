---
title: Js事件机制（下）
date: 2018-03-13 15:13:12
tags: Javascript事件
category: JavaScript
---
上文介绍了事件流和事件类型，本文介绍事件对象和事件代理
## 事件对象
> 在触发DOM上的某个事件时，会产生一个事件对象event，这个对象中包括所有与事件有关的信息。

#### DOM中的事件对象
兼容DOM的浏览器将一个event对象传入到事件处理程序中。无论指定的事件使用什么方法，DOM 0 级和 DOM 2级，都会传入event对象
```html
<input onclick="alert(event.type)"/>
<input onclick = "handleClick(event)"/>
<script>
  //HTML事件，html中参数必须为event
  function handleClick(e){
    console.log(e.type)
  }
  let btn = document.getElementById("myBtn")
  // DOM 0 级事件
  btn.onclick = function(e){
  console.log(e.type)
  }
  btn.addEventListener("click", function(e){
    console.log(e.type)
  },false)
</script>
```

HTML原生事件，DOM 0 级事件，DOM 2 级事件都可以获取到event对象。
Event对象成员

|属性/方法| 类型 | 读/写 | 说明 |
| :-: | :-: | :-: |  :-: |
| bubbles | Boolean| 只读 | 表明事件是否冒泡|
|cancelable| boolean | 只读 |  表明是否可以取消事件的默认行为|
|currentTarget | Element | 只读 | 表明事件处理程序当前处理的那个程序|
|defaultPrevented | boolean | 只读 | 为true表示事件已经调用过preventDefault|
|details | Interger | 只读 | 与事件相关的细节信息|
|eventPhrase| Interger | 只读 |调用事件处理程序的阶段，1表示捕获，2表示目标阶段，3表示冒泡|
|preventDefault()| Function | 只读 | 取消事件的默认行为|
|stopImmediatePropagation() | Function | 只读| 取消事件的进一步冒泡，同时阻止任何事件处理程序被调用|
|stopPropagation() | Function| 只读 | 取消事件的进一步冒泡|
|target | Element|  只读 | 事件的目标DOM|
|trusted | Boolean | 只读| true表示是浏览器生成的|
|type | String| 只读 | 被触发的事件类型|
|view | AbstractView | 只读 | 与事件关联的抽象视图|

**只有在事件处理程序执行期间，event对象才会存在， 执行完会销毁**

#### IE中的事件对象
在使用DOM 0 级方法添加事件处理函数时，event对象作为window对象的一个属性存在。
```js
 btn.onclick = function(){
  var event = window.event;
  console.log(event.type) //"click"
}
```
如果用atttchEvent添加的，那么就会有一个event对象作为参数传入事件处理函数中
```js
  btn.attachEvent("onclick", function(event){
    console.log(event.type)
  })
```
IE的event对象同样也包含于创建他的事件相关的属性和方法。

|属性/方法| 类型 | 读/写 | 说明 |
| :-: | :-: | :-: |  :-: |
| cancelBubble | Boolean| 读/写 | default value 为 false，当设置为true时等同于DOM中的stopPropagation()|
|returnValue| boolean | 读/写 | default value 为 true，当设置为false时等同于DOM中的preventDefault|
|srcElement | Element | 只读 | 与DOM事件中的target相同|
|type | boolean | 只读 | 被触发的事件类型|

#### 跨浏览器的事件对象
虽然DOM和IE的event对象不同，但是基于他们之间的相似性依然可以拿出跨浏览器的方案来。
```js
let untilEvent = {
  getEvent: function (event) {
     return event || window.event
  },
  getTarget: function (event) {
    return event.target || event.srcElement
  },
  stopProparation: function(event){
    if(event.stopPropagation) {
      event.stopPropagation()
    } else {
      event.cancelBubble = true
    }
  },
  preventDefault: function(event){
    if (event.preventDefault)
    {
      event.preventDefault()
    } else {
      event.returnValue = false
    }
  }
}
```
#### 时间代理
// 明天继续写吧