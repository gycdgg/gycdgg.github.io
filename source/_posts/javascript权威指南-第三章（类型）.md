---
title: javascript权威指南-第三章（类型）
date: 2018-03-13 15:29:36
tags: 读书笔记
category: 读书笔记
---
## 概述
这一章主要是讲类型、值、变量。以前觉得大概都知道，但是静下心来好好看，还是看到了很多以前理解错误的地方。
### 数据类型
js中的数据类型：分为基本类型和引用类型
string num boolean undefined null，引用类型就是指object这一个大的类别，包括function array等。
null可以理解为特殊的对象值。理解了这个，typeof返回什么之类的就很清晰了。
### num
1. Math.max(...args) 居然原生支持取出最大值/最小值的api
2. Infinity 的概念。0/0 ,无穷大除以无穷大，或者强制转不能转成数字的操作都会返回NaN
3. Infinity 和 NaN 都只是可读的
4. NaN和谁都不相等。判断是不是NaN的方法 x != x.这个函数的作用和isNaN相识
5. 实数有无数个，但是js只能表现有限的个数。That is to say,js中实数都是一个近似值。2进制的表示法表示不了0.1这样的数字，所以 0.3-0.2 === 0.2-0.1返回false 

### string
string是基本的数据类型，任何操作都不会改变它，虽然可以操作数组一样操作它。<a href = 'http://www.cnblogs.com/littledu/archive/2011/04/18/2019475.html'>注意区分slice、substring、substr的区别</a>
简单来说，3个方法都可以截取字符串的一段，从开始位置到结束位置(不包括结束位置)，区别体现在位置参数为负数的时候

### bool值
涉及到一个强转的问题。null undefined 0 -0 NaN '' 都会转为false
### null 和 undefined
null: 关键字。表示对象字符串num是无值的，也是一个对象，表示‘非对象’

undefined：不是关键字。表示变量没有初始化
### 包装对象
存取字符串数字bool的属性的时候创建的对象，包装对象和原始值不全等
这里还是有点坑的，只是不愿意去理解太多。
### 不可变和可变
一言以蔽之，基本类型都是不可变的，引用类型都是可变的。

```js
let a = {a:1,b:2}
let b = a // b只是通过a拿到对象的引用，a,b指向的都是同一个内存空间
b.a = 3
a //也会改变
```
可以看下<a href = 'https://gycdgg.github.io/2017/08/31/%E5%AF%B9%E8%B1%A1%E7%9A%84%E6%8B%B7%E8%B4%9D/'>对象拷贝简单实现</a>
### 类型转换
== 和 === 的区别在于==在比较之前做了一次类型转换。
**太多规则，记不住。以后再看**

### 变量作用域
你不知道的js看了太多了。声明提前的操作在代码编译阶段，不是在执行阶段。一个有意思的代码块
```js
var scope = 'global'
function test(){
    console.log(scope)  // undefined,不是global，一定要注意，局部变量始终在函数体中有定义
    var scope = 'local'
    console.log(scope)  // 'local'
}
```

###总结
都是自己理解上不太准确的地方，或者说容易忘记的地方。记录一下