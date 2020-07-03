# vue-picture-bd-marker

> 关于[ui-picture-bd-marker](https://www.npmjs.com/package/ui-picture-bd-marker)插件的Vue组件封装
 
github仓库地址：[https://github.com/FRED5DON/vue-ui-picture-bd-marker](https://github.com/FRED5DON/vue-ui-picture-bd-marker)

文档地址：[https://vmarker.sagocloud.com/](https://vmarker.sagocloud.com/about/)


更新说明
---

## v1.3.5

1. 增加Mobile支持
2. 修复键盘删除键失效问题

## v1.3.0

1. 重新适配`ui-picture-bd-marker@2.0.0`
2. 修复ratio默认不生效问题。（[issue#3](https://github.com/FRED5DON/ui-picture-bd-marker/issues/3) ）

## v1.2.1

> 注意：不兼容1.0.x版本

1. 防止事件名称冲突，更改emit回调事件名称前缀`vmarker`,如:`this.$emit("vmarker:onReady", this.key);`
2. 增加修改config更改后画布自动刷新机制