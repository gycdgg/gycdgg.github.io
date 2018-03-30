---
title: 你不知道的Javascript上卷——中
date: 2018-03-29 17:37:33
tags: 读书笔记
category: 读书笔记
---

上卷中花了2章的时间来讲this，涉及到词法作用域，动态作用域，执行上下文等概念。this让函数可以自动引用合适的上下文对象，不需要显示的传递。

## 对this的误解
一开始学习的时候，我对this也产生了很多误解，最常见的2种误解就是指向本身和指向作用域，比如函数里面的this就指代函数本身

### 误解之指向本身

看一个demo
```js
function foo(num){
    console.log("num:", num)
    this.count++
}
foo.count = 0
for(var i = 0 ; i<5; i++){
    foo(i)
}

console.log("count:", foo.count) //0
```
这里跟理想的结果不一样了，如果函数内部的this指向这个函数本身，那么this.count会是5。可以得出一个结论，函数内部的属性count和this.count不是一个。虽然属性名相同，。但是跟对象不同。

为了解决这个问题，如果用以下的方法：
```js
function foo(num){
    console.log('num:', num)
    data.count++
}

var data = {
    count: 0
}
for(let i = 0; i < 5; i++){
    foo(i)
}
console.log(data.count)
```
这样做肯定没问题，但是无法理解this的含义和工作原理————而是返回的舒适区，单纯的用了一下词法作用域
比较合理的解决方法是：**强制让this指向foo函数对象**

```js
function foo(num){
    console.log('num:', num)
    this.count++
}

foo.count= 0
for(let i = 0; i < 5; i++){
    foo.call(foo, i)
}
console.log(foo.count)
```
通过上面的demo得出的结论是this指向函数本身是不正确的。

### 误解之指向函数的作用域
```js
funtion foo(){
    var a = 1
    this.bar()
}
function bar(){
    console.log(this.a) // undefined
}
foo()
```
这里的this并不指函数的词法作用域，而是window对象

### this到底是什么

排除了上面2种理解之后，this到底是什么呢。
this是在运行时绑定的，不是在编写的时候，那就肯定不是词法作用域。他的上下文取决于函数调用时的各种条件。
所以可以说this只取决于函数调用的方式。
当一个函数被调用的时候，会创建一个活动记录（有些地方会叫执行上下文），这个记录包含了函数在那被调用，调用方式，传入的参数信息，this也在里面。

## this全面解析
this有4种绑定的规则，并且有优先级排列，具体如下
### 默认绑定
默认绑定的this指向全局对象，window和global（node环境）
```js
function foo(){
    var a = 'foo'
    console.log(this.a) // window
}
var a = 'window'
function bar(){
    var a = 'bar'
    foo()
}
bar()
```
那么怎么判断采用默认绑定的方式呢？这个demo中foo直接采用不带任何修饰的函数引用进行调用的，因此就是默认绑定。
又一个小细节，foo运行在strict模式下，this不能绑定到全局对象。
**注意是运行不是调用，外部的调用函数在strict模式下没影响。**
### 隐式绑定
这条规则需要考虑调用位置是否有上下文的对象
```js
function foo(){
    console.log(this.a)
}

var obj = {
    a: 1;
    foo: foo
}
obj.foo() // 1
```
当函数有上下文对象时，隐式绑定会把this绑定到这个上下文对象。
**对象属性引用作用域链中只有上一层或者说最后一层在调用位置中起作用**
```js
function foo(){
    console.log(this.a)
}

var obj1 = {
    a: 'obj1',
    foo: foo
}
var obj2 = {
    obj1: obj1,
    a:'obj2'
}
obj2.obj1.foo() // obj1
```
**隐性丢失**
以下情况都会丢失绑定对象
```js
function foo(){
    console.log(this.a)
}
var obj = {
    foo: foo,
    a:'inner'
}
var _foo = obj.foo
var a = 'global'
_foo() // global
```
_foo是obj.foo的 一个引用，实际上他是引用foo函数本身，因此此时的调用也是一个不带任何修辞的函数调用，默认绑定。

**还有一种更加常见的丢失情况在回调函数中发生。**
```js
function foo(){
    console.log(this.a)
}
var a = 'global'
var obj = {
    a:1,
    foo:foo
}
function doFoo(fn){
    fn()
}
doFoo(obj.foo) // global

```
参数传递也是一种隐式赋值，结果跟上面的一样，丢失上下文对象
同样原生内置的方法，也是一样的。
```js
function foo(){
    console.log(this.a)
}
var obj = {
    foo: foo,
    a: 'inner'
}
var a = 'global'

setTimeout(obj.foo,1000) // global
```
### 显式绑定

Javascript所有的函数原型链上都有call和apply方法。这2个方法是如何工作的呢？第一个参数是一个对象，为this准备的，调用的时候绑定到this。

```js
function foo(){
    console.log(this.a)
}
var obj = {
    a:'inner'
}
foo.call(obj) // inner
```
解决绑定丢失的问题
```js
function foo(){
    console.log(this.a)
}

var obj1 = {
    a:'inner'
}

function bar(){
    foo.call(obj1)
}

setTimeout(bar,2000) // inner
```

apply 实现 bind
call 和 apply的区别在于第二个参数，跟bind的区别，bind()是绑定this并返回一个函数，并没有执行。call和apply直接执行
```js
function foo(something){
    console.log(this.a,something)
}

Function.prototype.bind = function(obj){
    let self = this
    return function(){
        self.apply(obj,arguments)
    }
}

var obj1 = {
    a:'try to do'
}

var bar = foo.bind(obj1)
bar('what you want') // try to do what you want
```
### new绑定

使用new调用函数，会执行以下操作

> 1. 创建全新的对象
> 2. 这个新对象会执行[[prototype]]连接
> 3. 这个新对象会绑定到函数调用的this
> 4. 如果函数没有返回其他对象，new表达式中的函数调用会自动返回这个新对象

```js
function foo(a){
    this.a = a
}

var obj = new foo('inner')
console.log(obj) // {a: inner}
```

**四种规则的优先级依次升高，new > 显式 > 隐式 > 默认**

## this词法

箭头函数中的this并不根据以上的几条规则来决定，根据外层作用域决定（词法作用域）。
```js
function foo(){
    return (a)=>{
        console.log(this.a)
    }
}
var obj1 = {
    a:'obj1'
}
var obj2 = {
    a:'obj2'
}

var bar = foo.call(obj1)
bar.call(obj2) // obj1
```
这里输出的是obj1，箭头函数的词法作用域中的this是obj1，所以继承下来了。
可以解决一些隐式绑定中丢失的问题。
以前一直好奇为啥有时候会写：**var self = this**
```js
var a = 'global'
var obj = {
    a:'inner'
}

function foo(){
    console.log('outThis:',this)
    var self = this
    setTimeout(function(){
        console.log('innerThis',this)
        console.log('self',self)
        console.log(self.a)
    },2000)
}

foo.call(obj)
```
现在我理解了，foo.call(obj)的时候，outThis是指向obj的，但是在回调中，隐式丢失，innerThis是global对象了，所以用一个变量self保存outThis，由于闭包的原理，self会一直保存对这个变量的引用并且内层函数有访问权限。

那么换一种实现呢
```js
var a = 'global'
var obj = {
    a: 'inner'
}

function foo(){
    setTimeout(()=>{
        console.log(this.a)
    },2000)
}

foo.call(obj) // inner
```

箭头函数的this绑定规则不遵守以上的4种规则。如下例
```js
const foo = () => {
    console.log(this.a)
}
var obj = {
    a: 'inner',
    foo: ()=> {
        console.log(this.a)
    }
}
var a = 'global'
obj.foo() // global
```
## 小结

this判断的规则
1. 由new调用？绑定到新创建的对象
2. 由call或者apply或者（bind）调用？绑定指定对象
3. 由上下文对象调用？绑定上下文对象
4. 默认，严格模式下到undefined，否则绑定global对象

箭头函数根据词法作用域决定