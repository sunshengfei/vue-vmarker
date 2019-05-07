# vue-picture-bd-marker

> 关于[ui-picture-bd-marker](https://www.npmjs.com/package/ui-picture-bd-marker)插件的Vue组件封装
 
github仓库地址：[https://github.com/FRED5DON/vue-ui-picture-bd-marker](https://github.com/FRED5DON/vue-ui-picture-bd-marker)

文档地址：[https://vmarker.sagocloud.com/](https://vmarker.sagocloud.com/about/)


更新说明
---

## v1.2.0

> 注意：不兼容1.0.x版本

1. 防止事件名称冲突，更改emit回调事件名称前缀`vmarker`,如:`this.$emit("vmarker:onReady", this.key);`
2. 增加修改config更改后画布自动刷新机制