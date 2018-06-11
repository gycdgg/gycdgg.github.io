---
title: Js事件机制（下）
date: 2018-03-14 15:13:12
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
let eventUtil = {
  addHandler: function(element,type,handler) {
    if (element.addEventListener) {
      element.addEventListener(type,handler,false)
    } else if(event.attachEvent) {
      element.attachEvent("on" + type, handler)
    } else {
      element["on" + type] = handler
    }
  },
  getEvent: function (event) {
     return event || window.event
  },
  getTarget: function (event) {
    return event.target || event.srcElement
  },
  stopProparation: function (event) {
    if(event.stopPropagation) {
      event.stopPropagation()
    } else {
      event.cancelBubble = true
    }
  },
  preventDefault: function (event) {
    if (event.preventDefault)
    {
      event.preventDefault()
    } else {
      event.returnValue = false
    }
  },
  removeHandle: function (event) {
    if (element.removeEventListener) {
      element.removeEventListener(type,handler,false)
    } else if(event.detachEvent) {
      element.detachEvent("on" + type, handler)
    } else {
      element["on" + type] = null
    }
  }
}
```
#### 事件代理
通过之前的学习，我们知道事件处理程序让HTML与JS交互提供了可能。但是每次给DOM元素添加一个事件函数，那么就会在内存中加入一个对象，对象越多，性能也会有很大的影响。其次必须首先指定所有事件处理程序，这个过程需要很多的DOM访问，会影响整个页面的交互就绪时间。
举个例子。
```html
<ul id = "ul">
  <li id = "li1">1</li>
  <li id = "li2">2</li>
  <li id = "li3">3</li>
  .....
<ul>
<script>
  let li1 = document.getElementById('li1')
  let li2 = document.getElementById('li2')
  let li3 = document.getElementById('li3')
  eventUtil.addHandler(li1,"click", function(event){
    console.log(event.target)
  })
  eventUtil.addHandler(li2,"click", function(event){
    console.log(event.target.id)
  })
  eventUtil.addHandler(li3,"click", function(event){
    console.log(event.target.id)
  })
</script>
```
这种方式无疑很粗暴的，如果有成百上千个li，必然需要很大的代码量，就算采用的遍历的方式，代码量会少，但是遍历和过多的直接操作DOM也是不可取的。
这个时候需要引入事件代理。

**事件代理（有些人会叫事件委托）：只需要在DOM树中尽量最高的层次添加一个事件处理程序，利用事件冒泡的原理，子元素的事件也可以捕获到**

还是上面的例子，用事件代理的方式实现
```js
let ul = document.getElementById("ul")
eventUtil.addHandler(ul, "click",function(event){
  event = eventUtil.getEvent(event)
  let target = eventUtil.getTarget(event)
  switch (target.id) {
    case "li1":
      console.log(target.id)
      break
    case "li2":
      console.log(target.id)
      break
    case "li3":
      console.log(target.id)
      break 
  }
})
```
最适合采用事件委托的事件包括click,mousedown,mouseup,keydown,keyup和keypress。
封装一下事件代理 delegate
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>
<body>
  <ul id = 'test' style="height:200px; background:red">
    <li>123</li>
    <li>456</li>
    <li>789</li>
  </ul>
</body>
<script>
  let ul = document.getElementById('test')

  function delegate(parent,type,selector,fn){
    function handle(e){
      let _e = window.e || e
      let target = _e.target || _e.srcElement
      if(target.id === selector || target.nodeName.toLowerCase() === selector){
        fn(_e)
      }
    }
    parent[type] = handle
  }
  delegate(ul,'onclick','li',function(e){
    e.target.innerHTML = e.target.innerHTML.split('').reverse().join('')
  })
</script>
</html>

```

**事件代理的本质还是利用了事件冒泡**



