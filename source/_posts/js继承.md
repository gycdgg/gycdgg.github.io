---
title: js继承
date: 2018-05-07 17:28:58
tags: 点滴
category: JavaScript
---

## 继承
js一直在模仿其他oop语言的继承机制。但是本质上是一种代理，以下归纳了常见的实现继承的方法

### 原型链 + new

```js
function Parent(){
    this.colors = ['red','blue']
	this.name = 'edguan'
}

Parent.prototype.getName = function(){
	console.log(this.name)
}

function Child(age){
	this.age = age
}


Child.prototype = new Parent()
Child.prototype.constructor = Child
Child.prototype.getAge = function(){
	console.log(this.age)
}

let child1 = new Child(25)
let child2 = new Child(26)
child1.colors.push('white')
console.log(child1.colors)
console.log(child2.colors)
```
缺点:
1. 父类引用类型共享
2. 创建子类型的实例的时候不能向父类设置传递参数，比如设置name

### 借用构造函数

```js
function Parent(name){
	this.name = name
	this.color = ["blue","white"]
}

Parent.prototype.getName = function(){
	return this.name
}

function Child(name, age){
	Parent.call(this,name)
	this.age = age
}

Child.prototype.getAge = function(){
	return this.age
}

let child1 = new Child('edguan',25)
let child2 = new Child('sandy',34)
child1.color.push("black")
child2.color //["blue","white"] 
child1.getName // undefined
```
缺点： 虽然可以传递参数了，引用类型不会共享，但是Father的原型中的方法(getName)在child中不可以被调用

### 混合继承
结合上面的2种思路

```js
function Parent(name){
	this.color = ["blue","red"]
	this.name = name
}

Parent.prototype.getName = function(){
	return this.name
}

function Child(name,age){
	Parent.call(this,name)
	this.age = age
}

Child.prototype.getAge = function(){
	return this.age
}

Child.prototype = new Parent()
Child.prototype.constructor = Child

let child1 = new Child("edguan",25)
let child2 = new Child("sandy",34)
```

缺点：new Parent()会产生Parent.prototype对象，并且会执行函数。函数内部可能有一些额外操作，这些是我们不需要的。

### 原型式继承
用Object.create代替new Parent()的方式，避免了一些risky
new实现Object.create的polyfill如下
es6 的 Object.setPrototypeOf(obj1,obj2)作用相似
```js
const create = (o) = > {
	let func = function Func(){}
	Func.prototype = o
	return new Func()
}
```
**但是Object.create可以接收第二个参数，但是不常用**

```js
function Parent(name){
	this.color = ["blue","red"]
	this.name = name
}

Parent.prototype.getName = function(){
	return this.name
}

function Child(name,age){
	Parent.call(this,name)
	this.age = age
}

Child.prototype = Object.create(Parent.prototype)
Child.prototype.constructor = Child
Child.prototype.getAge = function(){
	return this.age
}
let child1 = new Child("edguan",25)
let child2 = new Child("sandy",34)
```

比较常见的方式

### es6 class

```js
class Parent{
	constructor(name){
		this.name = name;
		this.color = ["while","red"]
	}
	getName(){
		return this.name
	}
	static getColor(){
		return this.color
	}
	_getColor(){
		return this.color
	}
}


class Child extends Parent{
	constructor(name,age){
		super(name);
		this.age = age
	}

	getAge(){
		return this.age
	}
}
let child1 = new Child("edguan",26)
let child2 = new Child("sandy",34)
child1.color.push('blue')

```
class 本质上就是基于prototype的语法糖。和之前原型式继承差别不大，就是写法上的区别，给人一种类生成对象的感觉。

```js
typeof Child // "function"
Child.prototype === child1.__proto__
```

