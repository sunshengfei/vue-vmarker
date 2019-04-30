'use strict'
// made by fred 2018年08月12日
import {
  BdAIMarker,
  positionP2S
} from 'ui-picture-bd-marker'

export default class PictureMarker {
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
