---
title: bind实现
tags: 点滴
category: JavaScript
---

## 概述
首先是MDN上的描述啦：bind()方法创建一个新的函数, 当被调用时，将其this关键字设置为提供的值，在调用新函数时，在任何提供之前提供一个给定的参数序列。
> fun.bind(thisArg[, arg1[, arg2[, ...]]])

**thisArg**：
当绑定函数被调用时，该参数会作为原函数运行时的 this 指向。当使用new 操作符调用绑定函数时，该参数无效。

**arg1, arg2, ...**：
当绑定函数被调用时，这些参数将置于实参之前传递给被绑定的方法。

我们只要基本实现上面的功能就可以了。

### bind乞丐版

先不考虑多个参数的情况
```js
let obj1 = { a: '11111' }
function test(){
  return this.a
}
Function.prototype._bind = function(obj){
	let that = this
	return function(){
		return that.apply(obj)
	}
}
test._bind(obj1)() // 11111
```
_bind方法返回一个函数，函数在词法作用域以外的地方被调用，产生了一个闭包。
这里的let that = this可以不写，而是把下面的函数改成箭头函数。

### 进阶版之es6
现在需要考虑多个参数的情况
es6的解构赋值和rest操作简化了一下数组操作
```js
let obj1 = {a: 111}

function test(b,c){
  return [this.a , b , c]
}
Function.prototype._bind = function(obj,...args){
  return (..._args) => {
    console.log([...args,..._args])
    return this.apply(obj,[...args,..._args])
  }
}
test._bind(obj1,1000,1)(10000) // [111,1000,1]
test.bind(obj1,1000,1)(10000) // [111,1000,1]
```

### 进阶版之es5
es5不支持rest操作，所以对参数的操作只能改成数组操作。
arguments对象不是数组，只是内置了iterator接口，可以被遍历等。但是没有数组的内置方法。
```js
let obj1 = {a: 111}

function test(b,c){
  return [this.a , b , c]
}
Function.prototype._bind = function(){
  var slice = Array.prototype.slice
  var that = this
  var obj = arguments[0]
  var arg = slice.call(arguments,1)
  return function(){
    return that.apply(obj,arg.concat(slice.call(arguments,0)))
  }
}
test._bind(obj1,1000,1)(10000) // [111,1000,1]
```
## 未完待续