---
title: 你不知道的Javascript上卷——下
date: 2018-04-26 15:31:20
tags: 读书笔记
category: 读书笔记
---
看了一个月，全书终于看完了，上下分别是关于作用域与闭包，this。而最后一部分是关于原型链的，这部分看了很久，很多地方理解都没到点上，所以一直没写。这次尝试写一下。

## 概述
本文主要分为2部分，一部分是对象，一部分是原型。对象这个章节讲了一些平时见怪不怪但是一直不知其所以然的tips。

### 对象

### 内置对象
内置对象可以理解为内置的函数，加上new 操作后，作为构造函数使用，创建一个对应子类型的新对象。
```js
let str = "i am a string"
typeof str // "string"
str instanceof String // false

let _str = new String('i am a string two')
typeof _str // "object"
str instanceof String // true
```
str 是一个变量，"i am a string"是一个字面量，不是对象。如果对这个字面量做一些操作，比如获取长度等，需要转成String 对象。必要的时候语言会自动转成对象。

null和undefined没有构造形式，他们也不是内置对象

### 属性描述符
es5以后所有的属性都具备了属性描述符
```js
var obj = {
	a:'a'
}

Object.getOwnPropertyDescriptor(obj,"a") // {value: "a", writable: true, enumerable: true, configurable: true}
```

* writable: 是否可以修改值
* enumrable：是否可以被遍历中被找到
* configuarable： 是否可以用defineProperty配置属性。configuable为false的时候会阻止delete这个属性

### 不变性
1. 对象常量
```js
var obj = {}
Object.defineProperty(obj, "a",{
	value: 'aaa',
	configurable: false,
	writeable: false
})
```

2. 禁止扩展
```js
var obj = {
    a: "aaa"
}
Object.preventExtensions(obj) // 阻止扩展，但是a还是writeable
```

3. 密封

Object.seal(..)会创建一个密封的对象，这个方法的本质就是调用preventExtensions方法并且在所有的属性设置为configurable：false。
所以密封不仅不能添加属性，也不能重新配置。但是可以修改属性的值

4. 冻结

Object.freeze(..)会创建一个冻结对象。调用了Object.seal()并且设置writable为false。当然，利用递归也可以进行深度冻结。

### [[Get]] and [[Put]]

访问属性有一个很微妙的细节，我一直的理解是obj.a,是在obj这个对象中寻找名字为a的属性，实际上这里面有一个内部实现的[[get]]操作。
默认的[get]操作就是查找是否有与名称相同的属性，如果没有并且在原型链上也没有找到找到就会返回undefined。
**注意：这里和访问变量是不一样的**，属性访问找不到会报异常。

### Getter和Setter

```js
var myObj = {
    get a(){
        return 2
    }
}

Object.definePropery(myObj,'b',{
    get: function(){
        return this.a * 2
    },
    enumerable: true // 确保b穿现在属性列表中
})
```
这里执行 myObj.a = 3,myObj.a依旧还是2.因为自身定义的getter只能返回2.所有set没意义。

为了更加合理
```js
var obj = {
    get a(){
        return this._a_
    }

    set a(a){
        this._a_ = value*2
    }
}

obj.a = 2
obj.a // 4
```

## 原型