---
title: css中的长度单位与居中
date: 2018-03-26 15:45:39
tags: 小知识
category: CSS
---

css居中问题一只是经典问题啦，实现的方式有很多，但是还是需要记录一下。

## 长度单位
1. px：(pixel)像素，像素px是相对于显示器屏幕分辨率而言的(引自CSS2.0手册)。电子屏幕上组成一幅图画或照片的最基本单元；
2. pt: (point)点，印刷行业常用单位，等于1/72英寸，就是我们在Word或者WPS等办公软件中使用的字体大小单位；
3. ppi: (pixel per inch)每英寸像素数，该值越高，则屏幕越细腻，用于计算机和电视屏幕上每英寸显示的像素点的数量；
4. dpi: (dot per inch)每英寸多少点，该值越高，则图片越细腻，用于打印；
5. dp: (dip，Density-independent pixel) 是安卓开发用的长度单位，1dp表示在屏幕像素点密度为160ppi时1px长度；
6. sp: (scale-independent pixel)安卓开发用的字体大小单位；
7. em:(emphasize) 是相对长度单位，相对于当前对象内文本的字体尺寸，即em的计算是基于父级元素font-size的；
8. rem: （root em，根em）是css3新增的一个相对单位，与em的区别在于，它是相对于html根元素的(在body标签里面设置字体大小不起作用)；
9. vw：viewpoint width，视窗宽度，1vw等于视窗宽度的1%。
10. vh：viewpoint height，视窗高度，1vh等于视窗高度的1%。
11. vmin：vw和vh中较小的那个。
12. vmax：vw和vh中较大的那个。

vw, vh, vmin, vmax：IE9+局部支持，chrome/firefox/safari/opera支持，iOS safari 8+支持，Android browser4.4+支持，chrome for android39支持

## 居中

### 水平居中

#### 固定宽度块级元素水平居中

```css
width:200px;
margin:0 auto
```

