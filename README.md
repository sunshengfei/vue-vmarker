# vue-picture-bd-marker

![](https://img.shields.io/github/license/sunshengfei/vue-ui-picture-bd-marker) ![](https://img.shields.io/npm/v/vue-picture-bd-marker.svg?color=%23ff4400&style=popout)


```
npm i vue-picture-bd-marker

```


效果图：

![](https://sagocloud.com/ibucket/vm_sample.jpg)


> 关于[ui-picture-bd-marker](https://www.npmjs.com/package/ui-picture-bd-marker)插件的Vue组件封装
 
github仓库地址：[https://github.com/sunshengfei/vue-ui-picture-bd-marker](https://github.com/sunshengfei/vue-ui-picture-bd-marker)

文档地址：[https://vmarker.sagocloud.com/](https://vmarker.sagocloud.com/about/)


更新说明
---

## 1.4.1-beta02
---
提升`ui-picture-bd-marker`最低版本

## v1.3.8

同步更新`ui-picture-bd-marker`修复的bug


## v1.3.7

删除@vmarker:onSelect、@vmarker:onDrawOne事件

```
<AiPanel
      ref="aiPanel-editor"
      class="ai-observer"
      :ratio="ratio"
      v-bind:uniqueKey="1"
      @vmarker:onAnnoSelected="onAnnoSelected"
      @vmarker:onAnnoAdded="onAnnoAdded"
      @vmarker:onUpdated="onUpdated"
      @vmarker:onReady="onAiPanelReady"
      @vmarker:onImageLoad="onImageLoad"
      v-bind:readOnly="false"
      v-bind:imgUrl="currentImage"
    />
```
可以通过this.$refs["aiPanel-editor"].getMarker().updateConfig(config)更新配置，vue-marker内部config默认如下

```
config = {
      options: {
        blurOtherDots: true,
        blurOtherDotsShowTags: true,
        editable: this.readOnly ? false : true,
        trashPositionStart: 1
      },
      onAnnoContextMenu: function(annoData, element, annoContext) {
        // console.log("🦁onAnnoContextMenu🦁 data=", annoData);
        self.$emit("vmarker:onAnnoContextMenu", annoData, element, self.key);
      },
      onAnnoRemoved: function(annoData) {
        // console.log("🦁onAnnoRemoved🦁 data=", annoData);
        self.$emit("vmarker:onAnnoRemoved", annoData, self.key);
        return true;
      },
      onAnnoAdded: function(insertItem, element) {
        // console.log("🦁onAnnoAdded🦁 data=", insertItem);
        self.$emit("vmarker:onAnnoAdded", insertItem, self.key);
      },
      onAnnoChanged: function(newValue, oldValue) {
        // console.log("🦁onAnnoChanged🦁 ", newValue, oldValue);
        self.$emit("vmarker:onAnnoChanged", newValue, oldValue, self.key);
      },
      onAnnoDataFullLoaded: function() {
        // console.log("🦁onAnnoDataFullLoaded🦁 data=", self.key);
        self.$emit("vmarker:onAnnoDataFullLoaded", self.key);
      },
      onAnnoSelected: function(value, element) {
        // console.log("🦁onAnnoSelected🦁 data=", value);
        self.$emit("vmarker:onAnnoSelected", value, element, self.key);
      },
      onUpdated: function(data) {
        self.$emit("vmarker:onUpdated", data, self.key);
      }
    };
```

内部可配置defaultConfig如下：
```
const defaultConfig = {
    options: {
        deviceType: 'both',//both | mouse | touch
        blurOtherDots: false,
        blurOtherDotsShowTags: false,
        editable: true,
        showTags: true,
        supportDelKey: false,
        tagLocation: defaultPositions.bottom,//1 2
        trashPositionStart: 0,
        boundReachPercent: 0.01,
        annotationClass: 'annotation',
    },
    onAnnoContextMenu: function (annoData, element, annoContext) { },
    onAnnoRemoved: function (annoData, element) { return true },
    onAnnoAdded: function (insertItem, element) { },
    onAnnoChanged: function (newValue, oldValue) { },
    onAnnoDataFullLoaded: function () { },
    onAnnoSelected: function (value, element) { },
    onUpdated: function () { },
};
```

## v1.3.5

1. 增加Mobile支持
2. 修复键盘删除键失效问题

## v1.3.0

1. 重新适配`ui-picture-bd-marker@2.0.0`
2. 修复ratio默认不生效问题。（[issue#3](https://github.com/sunshengfei/ui-picture-bd-marker/issues/3) ）

## v1.2.1

> 注意：不兼容1.0.x版本

1. 防止事件名称冲突，更改emit回调事件名称前缀`vmarker`,如:`this.$emit("vmarker:onReady", this.key);`
2. 增加修改config更改后画布自动刷新机制