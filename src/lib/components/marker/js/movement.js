'use strict';

import {
  UUID
} from './config';

export default class Movement {
  type;
  boundRect;
  constructor(node, type = -1, boundRect = {}, options) {
    this.currentNode = node;
    this.type = type;
    this.boundRect = boundRect || {};
    this.options = options;
    let temData = Movement.tagTemplate()
    this.updateData({
      ...temData
    })
    this.fetchData()
  }

  updateData = (data = {}) => {
    this.data = { ...this.data, ...data }
    let { uuid = null } = this.data
    if (uuid) {
      this.currentNode.dataset.uuid = uuid;
    }
  }

  fetchData = () => {
    this.updateData({
      position: this.coordinate()
    })
  }

  /**
   * 
   * @returns 获取标注区域
   */
  frame = () => {
    return { ...this.boundRect }
  }

  /**
   * 移动
   * @param {*} offsetX  
   * @param {*} offsetY 
   * @returns 
   */
  transform = (offsetX, offsetY) => {
    if (!this.options.editable) return;
    let parentEl = this.currentNode;
    const rawHeightp = parseFloat(parentEl.style.height);
    const rawWidthp = parseFloat(parentEl.style.width);
    const rawTop = parseFloat(parentEl.style.top);
    const rawLeft = parseFloat(parentEl.style.left);
    const heightOffset = 100 * offsetY / this.boundRect.height;
    const widthOffset = 100 * offsetX / this.boundRect.width;
    // console.log( `this.type=${this.type},rawHeightp=${rawHeightp},rawWidthp=${rawWidthp},rawTop=${rawTop},rawLeft=${rawLeft},heightOffset=${heightOffset},widthOffset=${widthOffset}`);
    if (rawTop + heightOffset < this.options.boundReachPercent || rawTop + heightOffset > (100 - this.options.boundReachPercent)) {
      return;
    }
    if (this.type === 0) {
      //top
      if (rawHeightp - heightOffset < this.options.boundReachPercent) {
        return;
      }
      parentEl.style.top = (rawTop + heightOffset).toFixed(3) + '%';
      parentEl.style.height = (rawHeightp - heightOffset).toFixed(3) + '%';
    } else if (this.type === 1) {
      //bottom
      parentEl.style.height = (rawHeightp + heightOffset).toFixed(3) + '%';
    }
    else if (this.type === 2) {
      //left
      if (widthOffset + rawLeft < this.options.boundReachPercent || widthOffset + rawLeft >= rawWidthp + rawLeft) {
        return;
      }
      parentEl.style.left = (widthOffset + rawLeft).toFixed(3) + '%';
      parentEl.style.width = (rawWidthp - widthOffset).toFixed(3) + '%';
    }
    else if (this.type === 3) {
      //right
      parentEl.style.width = (rawWidthp + widthOffset).toFixed(3) + '%';
    } else if (this.type === 4) {
      //top-left
      if (rawHeightp - heightOffset < this.options.boundReachPercent) {
        return;
      }
      if (rawWidthp - widthOffset < this.options.boundReachPercent) {
        return;
      }
      parentEl.style.top = (rawTop + heightOffset).toFixed(3) + '%';
      parentEl.style.height = (rawHeightp - heightOffset).toFixed(3) + '%';
      parentEl.style.left = (widthOffset + rawLeft).toFixed(3) + '%';
      parentEl.style.width = (rawWidthp - widthOffset).toFixed(3) + '%';
    }
    else if (this.type === 5) {
      //top-right
      if (rawWidthp + widthOffset < this.options.boundReachPercent) {
        return;
      }
      if (rawHeightp - heightOffset < this.options.boundReachPercent) {
        return;
      }
      parentEl.style.top = (rawTop + heightOffset).toFixed(3) + '%';
      parentEl.style.height = (rawHeightp - heightOffset).toFixed(3) + '%';
      parentEl.style.width = (rawWidthp + widthOffset).toFixed(3) + '%';
    }
    else if (this.type === 6) {
      //bottom-left
      if (rawHeightp + heightOffset < this.options.boundReachPercent) {
        return;
      }
      if (rawWidthp - widthOffset < this.options.boundReachPercent) {
        return;
      }
      parentEl.style.height = (rawHeightp + heightOffset).toFixed(3) + '%';
      parentEl.style.left = (widthOffset + rawLeft).toFixed(3) + '%';
      parentEl.style.width = (rawWidthp - widthOffset).toFixed(3) + '%';
    }
    else if (this.type === 7) {
      //bottom-right
      if (rawHeightp + heightOffset < this.options.boundReachPercent) {
        return;
      }
      if (rawWidthp + widthOffset < this.options.boundReachPercent) {
        return;
      }
      parentEl.style.height = (rawHeightp + heightOffset).toFixed(3) + '%';
      parentEl.style.width = (rawWidthp + widthOffset).toFixed(3) + '%';

    } else if (this.type === -1) {
      // //move
      if (heightOffset + rawTop < this.options.boundReachPercent || heightOffset + rawTop + rawHeightp > (100 - this.options.boundReachPercent)) {
        return;
      }
      if (widthOffset + rawLeft < this.options.boundReachPercent || widthOffset + rawLeft + rawWidthp > (100 - this.options.boundReachPercent)) {
        return;
      }
      parentEl.style.top = (heightOffset + rawTop).toFixed(3) + '%';
      parentEl.style.left = (widthOffset + rawLeft).toFixed(3) + '%';
    }
    this.fetchData()
  };


  coordinate = () => {
    const node = this.currentNode;
    let position = {
      x: node.style.left,
      y: node.style.top,
      x1: (parseFloat(node.style.width) + parseFloat(node.style.left)).toFixed(3) + '%',
      y1: (parseFloat(node.style.height) + parseFloat(node.style.top)).toFixed(3) + '%',
    };
    return position
  }

  /**
   * 
   * @param {*} tagOb 
   */
  updateTag = (tagOb) => {
    let nTag = {}
    if (typeof tagOb === 'string') {
      nTag = {
        tag: tagOb,
        tagName: tagOb
      }
    }
    if (typeof tagOb === 'object') {
      nTag = {
        ...tagOb
      }
    }
    this.data = {
      ...this.data,
      ...nTag
    }
    return nTag
  }

  /**
   * 获取数据tag模板
   * @returns 
   */
  static tagTemplate = (tagName, tagIdstr, uuid) => {
    let uu = `${UUID(16, 16)}`;
    let tagString = '请选择或添加新标签';
    let tagId = `temp@${uu}`;
    return {
      uuid: uuid || uu,
      tag: tagIdstr || tagId,
      tagName: tagName || tagString
    }
  }



  /**
   * 获取数据模板
   * @param {*} tag 
   * @param {*} x 
   * @param {*} y 
   * @param {*} x1 
   * @param {*} y1 
   * @returns 
   */
  static dataTemplate = (tag, x, y, x1, y1) => {
    if (!tag || !/^.+$/gi.test(tag)) {
      tag = {
        tag: `temp@${new Date().getTime()}`,
      };
    }
    return {
      ...tag,
      position: {
        x,
        y,
        x1,
        y1,
      },
    };
  };
}