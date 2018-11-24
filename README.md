# vue-picture-marker @1.0.0

> 关于[ui-picture-bd-marker](https://www.npmjs.com/package/ui-picture-bd-marker)插件的Vue组件封装

1. 安装
---
`
npm install vue-picture-bd-marker
`


2. 使用
---

```
<template>
    <div>
    ...
    <!--  -->
    <AIMarker ref="aiPanel-editor" class="ai-observer" 
    v-bind:uniqueKey="1" 
    @onSelect="selectOne" 
    @onUpdated="onUpdated" 
    @onDrawOne="onDrawOne"
    @onReady="onReady" 
    @onImageLoad="onImageLoad" 
    v-bind:readOnly="readOnly" 
    v-bind:imgUrl="currentImage">
    </AIMarker>
    </div>
</template>
<script>
import {AIMarker,MiaozhenMarker} from 'vue-picture-marker'
export default {
  name: "stagePicPage",
  components: { AIMarker },
  data() {
      readOnly:false,//是否只读
      currentImage:"url或base64"
  },
  methods:{
      ...
  }
}
</script>

```


PS: MiaozhenMarker是简单封装了ui-picture-bd-marker（简称bdmarker）的一个类，可以通过AIMarker获取MiaozhenMarker实例直接调用实现与bdmarker的交互；一方面也可以通过MiaozhenMarker `getMarker()`获取原生的bdmarker实例来进行操作；
AIMarker内部就是直接使用了MiaozhenMarker来进行与bdmarker的交互的。


**MiaozhenMarker源码一览**


```js
'use strict'
// made by freddon 2018年08月12日
import {
  BdAIMarker,
  positionP2S
} from 'ui-picture-bd-marker'

export default class MiaozhenMarker {
  constructor(parentEl, draftEl, configs) {
    this.marker = this._makeMarker(parentEl, draftEl, configs)
  }

  _makeMarker = (parentEl, draftEl, configs) => {
    return new BdAIMarker(
      parentEl,
      draftEl,
      null,
      configs)
  }

  updateConfig = (configs) => {
    this.marker.setConfigOptions(configs)
  }

  getMarker = () => {
    return this.marker;
  }

  // 打标签
  setTag = (tag = {}) => {
    this.marker.setTag(tag)
  }

  // 渲染数据，数据格式如下
  // {
  //     tag: '009_X0918', //require
  //     tagName:'Diamond',//require
  //     pos:2,//自定义属性 ... +
  //     position: { //require
  //       x: 350,
  //       y: 306,
  //       x1: 377,
  //       y1: 334,
  //     },
  //   }
  renderData = (data, wihe) => {
    this.marker.renderData(data, wihe)
  }

  // 获取数据
  getData = () => {
    return this.marker.dataSource()
  }

  // 清空数据
  clearData = () => {
    this.marker.clearAll()
  }

  // 数据参照 renderData 参数
  mapDataPercent2Real = (dataArray, baseW, baseH) => {
    return dataArray.map(item => {
      item.position = positionP2S(item.position, baseW, baseH)
      return item
    })
  }
}
```

3. AIMarker组件属性
---
|属性/事件|描述|默认值|
|:---:|:---:|:--| 
|uniqueKey|识别控件唯一性，当页面存在多个控件时需要区分| 无|
|readOnly|是否只作显示|false|
|imgUrl|图片url|无|
|onImageLoad|图片加载完成后回调，不包含data:image格式。回调参数,data={rawW,rawH,currentW,currentH}|----|
|onReady|当控件准备完成后回调，参数为uniqueKey|----|
|onDrawOne|当画完一个标注框时回调，参数为data【标注数据】, uniqueKey|----|
|onSelect|当选中图片上的标注框时回调，参数为data【标注数据】, uniqueKey|----|
|onUpdated|当标注框位置或者标框属性发生改动时回调，参数为data【标注数据】, uniqueKey|----|
|onDataRendered|当标注框主动渲染数据后时回调，参数为uniqueKey|----|

----


[github仓库地址](https://github.com/FRED5DON/vue-ui-picture-bd-marker)
