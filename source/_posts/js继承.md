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
缺点：1. 父类引用类型共享 2. 创建子类型的实例的时候不能向父类设置传递参数，比如设置name