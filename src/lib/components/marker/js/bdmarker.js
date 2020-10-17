// MIT License

// Copyright (c) 2018 FredDon

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

'use strict';
import './compatible'
import {
  MOUSE_EVENT,
  TOUCH_EVENT,
  PREFIX_RESIZE_DOT,
  defaultConfig,
  UUID, positionP2S, transformDataArray
} from './config';
import ResizeAnnotation from './anno';

class BdAIMarker {
  eventTargetOnTransform = false;

  constructor(layer, draft, resizeAnnotation, configs = {}) {
    if (typeof configs !== 'object') {
      throw 'Please provide a callback Config for BdAIMarker';
    }
    this.options = { ...defaultConfig.options, ...configs.options };
    if (layer) {
      this.layer = layer;
      this.draft = draft;
      this.actionDown = false;
      this.draftRect = {};
      this.anchorX = -1;
      this.anchorY = -1;
      this.boundRect = () => {
        return layer.getBoundingClientRect();
      };
      this.resizeAnnotation = resizeAnnotation ? resizeAnnotation : new ResizeAnnotation(
        draft.parentNode, this._compatibalBoundRect, configs, this.$callback_handler);
      let self = this;
      if (this.options.deviceType == 'both' || this.options.deviceType == 'mouse') {
        MOUSE_EVENT.forEach((currentValue, index, arr) => {
          layer.addEventListener(currentValue, (e) => {
            let x = e.clientX,
              y = e.clientY;
            self.mouseEventHandler(e, x, y);
          }, true);
        });
      }
      if (this.options.deviceType == 'both' || this.options.deviceType == 'touch') {
        TOUCH_EVENT.forEach((currentValue, index, arr) => {
          layer.addEventListener(currentValue, (e) => {
            if (e.targetTouches) {
              let touch = e.targetTouches[0]
              let x = touch ? touch.clientX : undefined,
                y = touch ? touch.clientY : undefined;
              self.mouseEventHandler(e, x, y);
            }
          }, true);
        });
      }
    }
  }

  $callback_handler = (onTrans) => {
    this.eventTargetOnTransform = onTrans;
  }

  setConfigOptions = (newOptions) => {
    this.options = { ...this.options, ...newOptions.options }
    if (this.resizeAnnotation) {
      this.resizeAnnotation.setConfigOptions(newOptions);
    }
  }

  _compatibalBoundRect = () => {
    let boundRect = this.boundRect();
    if (typeof boundRect.x != 'undefined') return boundRect;
    return {
      x: boundRect.left,
      y: boundRect.top,
      left: boundRect.left,
      top: boundRect.top,
      right: boundRect.right,
      bottom: boundRect.bottom,
      width: boundRect.width,
      height: boundRect.height
    }
  }

  mouseEventHandler = (e, clientX, clientY) => {
    // e.preventDefault();
    // e.stopPropagation();
    let eventType = e.type;
    let boundRect = this._compatibalBoundRect();
    if (clientX) {
      this.moveX = clientX - boundRect.x;
    }
    if (clientY) {
      this.moveY = clientY - boundRect.y;
    }
    if (eventType === MOUSE_EVENT[6]) {
      this.eventTargetOnTransform = false;
      this.actionDown = false;
      this.resizeAnnotation.dragEventOn(e);
      return;
    }
    if (this.eventTargetOnTransform) {
      this.resizeAnnotation.dragEventOn(e);
      return;
    }
    if (eventType === MOUSE_EVENT[0] || eventType === TOUCH_EVENT[0]) {
      if (e.target.classList.contains(this.options.annotationClass) ||
        e.target.classList.contains(`${PREFIX_RESIZE_DOT}`)) {
        this.eventTargetOnTransform = true;
        this.resizeAnnotation.dragEventOn(e);
        return;
      }
      if (this.actionDown) {
        this.dragTo(this.moveX, this.moveY);
        return;
      }
      this.resizeAnnotation.removeSelectedAnnotation()
      this.actionDown = true;
      this.anchorX = this.moveX;
      this.anchorY = this.moveY;
      this.resetDraft();
      this.anchorAt(this.anchorX, this.anchorY);
    } else if (eventType === MOUSE_EVENT[1] || eventType === TOUCH_EVENT[1]) {
      if (this.actionDown) {
        this.dragTo(this.moveX, this.moveY);
      }
    } else if (eventType === MOUSE_EVENT[4] || eventType === TOUCH_EVENT[2] || eventType === TOUCH_EVENT[4]) {
      if (this.actionDown && this.resizeAnnotation) {
        this.resizeAnnotation.drawAnnotation(this.draftRect);
        this.resetDraft();
      }
      this.actionDown = false;
    } else {
      if (this.actionDown && this.filterOutOfBounds(this.moveX, this.moveY)) {
        // console.log(`eventType=${eventType}`);
        // console.log(this.draftRect);
        if (this.resizeAnnotation) {
          this.resizeAnnotation.drawAnnotation(this.draftRect);
          this.resetDraft();
        }
        this.actionDown = false;
      }
    }
    // console.log(`eventType=${eventType}`);
  };


  //  更新定位点
  anchorAt = (x, y) => {
    if (!this.options.editable) return;
    let ccRect = this._compatibalBoundRect()
    this.draft.style.display = '';
    if (this.moveX < x) {
      this.draft.style.right = 100 * Math.abs(ccRect.width - x) / ccRect.width +
        '%';
      this.draft.style.left = '';
      this.draftRect = Object.assign(this.draftRect,
        {
          x: (100 * Math.abs(this.moveX) / ccRect.width).toFixed(3) + '%',
        });
    } else {
      this.draft.style.left = (100 * Math.abs(x) / ccRect.width).toFixed(3) + '%';
      this.draft.style.right = '';
      this.draftRect = Object.assign(this.draftRect,
        {
          x: (100 * Math.abs(x) / ccRect.width).toFixed(3) + '%',
        });
    }
    if (this.moveY < y) {
      this.draft.style.bottom = (100 * Math.abs(ccRect.height - y) /
        ccRect.height).toFixed(3) +
        '%';
      this.draft.style.top = '';
      this.draftRect = Object.assign(this.draftRect,
        {
          y: (100 * Math.abs(this.moveY) / ccRect.height).toFixed(3) + '%',
        });
    } else {
      this.draft.style.top = (100 * Math.abs(y) / ccRect.height).toFixed(3) + '%';
      this.draft.style.bottom = '';
      this.draftRect = Object.assign(this.draftRect,
        {
          y: (100 * Math.abs(y) / ccRect.height).toFixed(3) + '%',
        });
    }
  };

  filterOutOfBounds = (x, y) => {
    return (
      x >= this._compatibalBoundRect().width ||
      // x >= this._compatibalBoundRect().x + this._compatibalBoundRect().width + 2 ||
      y >= this._compatibalBoundRect().height ||
      // y >= this._compatibalBoundRect().y + this._compatibalBoundRect().height + 2 ||
      x < 1 || y < 1
    );
  };

  resetDraft = () => {
    //reset
    this.draftRect = { x: -1, y: -1, width: 0, height: 0 };
    this.draft.style.width = '0%';
    this.draft.style.height = '0%';
  };

  /**
   * 清空数据
   */
  clearAll = () => {
    let annotations = this.layer.querySelectorAll(`.${this.options.annotationClass}`);
    annotations.forEach((item) => {
      item.remove()
    })
    this.renderData(void 0)
  };

  dragTo = (x, y) => {
    if (!this.options.editable) return;
    if (this.filterOutOfBounds(x, y)) {
      this.actionDown = false;
    }
    this.anchorAt(this.anchorX, this.anchorY);
    let widthRatio = (100 * Math.abs(x - this.anchorX) / this._compatibalBoundRect().width).toFixed(3);
    let heightRatio = (100 * Math.abs(y - this.anchorY) / this._compatibalBoundRect().height).toFixed(3);
    this.draftRect = Object.assign(this.draftRect,
      {
        width: widthRatio + '%',
        height: heightRatio + '%',
      });
    this.draft.style.width = this.draftRect.width;
    this.draft.style.height = this.draftRect.height;
  };


  /**
   * 渲染数据
   */
  renderData = (dataArray = [], base) => {
    let ra = this.resizeAnnotation;
    if (ra) {
      ra.renderData(dataArray, base);
    }
  };

  /**
   * 打标签
   * {
   * id:'',
   * name:'',
   * }
   */
  setTag = (tag) => {
    if (this.resizeAnnotation && tag) {
      this.resizeAnnotation.setTagForCurrentMovement(tag);
    }
  };

  selectMarkerByTagId = (tagId) => {
    if (tagId) {
      this.resizeAnnotation.selectMarkerByTagId(tagId);
    }
  };

  /**
   * 获取所有数据
   */
  dataSource = () => {
    if (this.resizeAnnotation) {
      return this.resizeAnnotation.dataSource();
    }
    return void 0;
  };

  /**
   * 获取某个标签的数据
   */
  dataForTag = (tagId, uuid) => {
    return this.resizeAnnotation.dataSourceOfTag(tagId, uuid);
  }
}

export {
  ResizeAnnotation,
  BdAIMarker,
  UUID,
  positionP2S,
  transformDataArray,
};