---
title: es6之let
date: 2018-03-13 15:26:31
tags: es6
category: 读书笔记
---
## 概述
在写上一篇文章，关于cookie的操作时有一个demo，涉及到一个作用域的问题，实验了一下，然后又归纳小结了一波，主要还是参考[阮大的es6入门](http://es6.ruanyifeng.com/#docs/let)，也算是面试经常问的问题，let和var的区别，之前都会回答块级作用域，具体一点的，申明提前，暂时性死区的都会大概提一提。想想还是好好梳理一下好了。

### 不存在变量提升
变量提升可以换一个词，在代码编译阶段做的申明提前操作。
随便看几个demo，和var的对比很容易看出来
```js
console.log(a) // undefined
var a = 'var'

console.log(b) // 报错，b is not defined
let b = 'let'
```
那么再看一个demo,涉及到作用域的
```js
var globalObj = {a:1}
var func = function() {
    console.log(globalObj)  //undefined
    globalObj.b = 2         //报错，cannot 'b' of undefined
    var globalObj = asdasd
}
console.log(globalObj)
```
虽然globalObj是全局作用域下，func也在里面，但是在内部局部的globalObj优先级高，虽然globalObj在内层是undefined也不影响。
今天在看犀牛书关于cookie操作的时候有个demo就有这个问题p591

### 暂时性死区
ES6明确规定，如果区块中存在let和const命令，这个区块对这些命令声明的变量，从一开始就形成了封闭作用域。凡是在声明之前就使用这些变量，就会报错。
继续用上一个demo，换成es6的版本，报的错不一样。
这么做个人感觉挺好，也算是一种规范，以前变量申明之前是可以用这个变量的，值是undefined，这样造成了很多意想不到的情况。
tips：typeOf方法也有可能报错啦
```js
let globalObj = {a:1}
const func = () => {
    console.log(globalObj)  //Identifier 'globalObj' has already been declared
    globalObj.b = 2
    let globalObj = asdasd
}
console.log(globalObj)
```

### 不允许重复申明
```js
var a = 1
var a = 2
let b = 3
let b = 4 // b报错， b has been declared
```
tip: 函数的形参也可以理解为申明了局部变量，所以也不能再次申明
### 块级作用域
先看一下函数作用域不好的地方
```js
var tmp = new Date();
function f() {
  console.log(tmp);
  if (false) {
    var tmp = 'hello world';
  }
}
f(); // undefined
```
阮大给的这个demo挺nice的，f调用的时候本来是想tmp没有暴露到f的作用域下，引擎对tmp执行RHS查询，找到上一层作用域的tmp，但是if条件里面的逻辑没有形成作用域，tem在f函数中为局部变量。
```js
var s = 'hello';

for (var i = 0; i < s.length; i++) {
  console.log(s[i]);
}

console.log(i); // 5
```
初学者写这种代码都没注意到内存泄露等问题，暴露过多的全局变量肯定是不好的。