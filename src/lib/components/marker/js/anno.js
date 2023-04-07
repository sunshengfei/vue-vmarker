"use strict";
import "./compatible";
import {
  MOUSE_EVENT,
  TOUCH_EVENT,
  dotCls,
  imageOpTag,
  imageOpContent,
  PREFIX_RESIZE_DOT,
  defaultPositions,
  defaultConfig,
  opContainer,
  opTagDel
} from "./config";
import Movement from "./movement";

export default class ResizeAnnotation {
  #boundRect;
  #callback_handler;
  #lastX;
  #lastY;
  #moveX;
  #moveY;
  #currentMovementDisabled;
  #draggingStartLazy = false;
  constructor(
    parentNode,
    boundRect,
    callback = defaultConfig,
    callback_handler
  ) {
    this.options = {
      ...defaultConfig.options
    };
    this.config = { ...defaultConfig };
    this.#callback_handler = callback_handler;
    this.annotationContainer = parentNode;
    this.#boundRect = boundRect;
    this.actionDown = false;
    this.currentMovement = null;
    this.data = [];
    let that = this;
    this.delEvent = function(e) {
      if (e.keyCode === 8 || e.keyCode === 46) {
        let currentMovement = that.currentMovement;
        if (currentMovement) {
          that.removeAnnotation(currentMovement.currentNode);
        }
      }
    };
    this.setConfigOptions(callback);
  }

  #event = () => {
    if (this.options.supportDelKey && this.options.closable) {
      document.addEventListener("keydown", this.delEvent);
    } else {
      document.removeEventListener("keydown", this.delEvent);
    }
  };

  #uiconstruct = () => {
    if (this.annotationContainer) {
      let imageOpContents = this.annotationContainer.querySelectorAll(
        `.${imageOpContent}`
      );
      for (let index = 0; index < imageOpContents.length; index++) {
        const opContent = imageOpContents[index];
        if (!this.options.showTags) {
          opContent.style.visibility = "collapse";
        } else {
          opContent.style.visibility = "visible";
        }
        if (this.options.tagLocation == defaultPositions.out_bottom) {
          opContent.style.position = "absolute";
          opContent.style.bottom = null;
        } else {
          opContent.style.position = null;
        }
        let delEl = opContent.querySelector("." + opTagDel);
        if (delEl) {
          if (this.options.closable) {
            delEl.style.display = "";
          } else {
            delEl.style.display = "none";
          }
        }
        if (this.options.textComponent) {
          let element = this.options.textComponent.apply(null, [opContent]);
          if (!element) {
            //默认
            break;
          }
          if (!(element instanceof Element)) {
            throw new Error("closeComponent not a Element");
          }
          if (opContent.hasChildNodes()) {
            let opChildren = opContent.childNodes;
            for (let index = opChildren.length - 1; index > -1; index--) {
              const rmEl = opChildren[index];
              rmEl && opContent.removeChild(rmEl);
            }
            opContent.appendChild(element);
          }
        }
      }
    }
    //
    if (this.currentMovement && !this.options.editable) {
      this.currentMovement.currentNode
        .querySelectorAll(`[class*=${PREFIX_RESIZE_DOT}]`)
        .forEach(node => {
          if (node.classList.contains(dotCls[8])) {
            node.classList.remove("hidden");
          } else {
            node.classList.add("hidden");
          }
        });
    }
  };

  setConfigOptions = newOptions => {
    const oldEditable = this.options.editable;
    this.options = { ...this.options, ...newOptions.options };
    const newOldEditable = this.options.editable;
    this.config = { ...this.config, ...newOptions };
    this.#event();
    this.#uiconstruct();
    if (!oldEditable && oldEditable != newOldEditable) {
      if (this.currentMovement) {
        this.selectAnnotation(false);
      }
    }
  };

  //获取数据模板
  dataTemplate = (...args) => {
    return Movement.dataTemplate(...args);
  };

  reset = () => {
    this.data = [];
    this.config.onUpdated([]);
  };

  isValid = rect => {
    if (!rect) {
      return false;
    }
    let valid = [];
    if (/^\d*(\.\d+)?%$/.test(rect.width)) {
      valid.push(true);
    } else if (parseFloat(rect.width) < 1) {
      valid.push(false);
    }
    if (/^\d*(\.\d+)?%$/.test(rect.height)) {
      valid.push(true);
    } else if (parseFloat(rect.height) < 1) {
      valid.push(false);
    }
    return valid.filter(Boolean).length == valid.length;
  };

  renderData = (
    dataArray = [],
    base = { width: this.#boundRect().width, height: this.#boundRect().height }
  ) => {
    if (dataArray instanceof Array && dataArray.length > 0) {
      dataArray.forEach((data, index, arr) => {
        let rect;
        if (data.position.x.endsWith("%")) {
          rect = {
            x: data.position.x,
            y: data.position.y,
            width:
              parseFloat(data.position.x1) - parseFloat(data.position.x) + "%",
            height:
              parseFloat(data.position.y1) - parseFloat(data.position.y) + "%"
          };
        } else {
          rect = {
            x: ((100 * data.position.x) / base.width).toFixed(3) + "%",
            y: ((100 * data.position.y) / base.height).toFixed(3) + "%",
            width:
              (
                (100 * (data.position.x1 - data.position.x)) /
                base.width
              ).toFixed(3) + "%",
            height:
              (
                (100 * (data.position.y1 - data.position.y)) /
                base.height
              ).toFixed(3) + "%"
          };
        }
        this.drawAnnotation(rect, data);
      });
    } else {
      this.reset();
    }
    this.config.onAnnoDataFullLoaded();
  };

  dataSource = () => {
    return this.data;
  };

  dataSourceOfTag = (tagId, uuid) => {
    for (let i = 0; i < this.data.length; i++) {
      let value = this.data[i];
      if (value.tag === tagId && value.uuid == uuid) {
        return value;
      }
    }
  };

  dataSourceOfUUID = uuid => {
    for (let i = 0; i < this.data.length; i++) {
      let value = this.data[i];
      if (value.uuid == uuid) {
        return value;
      }
    }
  };

  // getCurrentAnnotationData = () => {
  //     //  todo
  // }

  setTagForCurrentMovement = tagOb => {
    if (this.currentMovement) {
      const node = this.currentMovement.currentNode;
      let nTag = this.currentMovement.updateTag(tagOb);
      const oldtag = node.querySelector(`.${imageOpTag}`).dataset.id;
      for (let k in nTag) {
        node.querySelector(`.${imageOpTag}`).dataset[k] = nTag[k];
      }
      let uuid = node.dataset.uuid;
      node.querySelector(`.${imageOpTag}`).innerText = nTag.tagName;
      for (let i = 0; i < this.data.length; i++) {
        let value = this.data[i];
        let oldValue = Object.assign({}, value);
        if (value.tag === oldtag && value.uuid === uuid) {
          value = {
            ...value,
            ...nTag
          };
          node.querySelector(`.${imageOpTag}`).dataset.id = nTag.tag;
          node.querySelector(`.${imageOpTag}`).dataset.name = nTag.tagName;
          this.config.onAnnoChanged(value, oldValue);
          this.data[i] = value;
          break;
        }
      }
      this.config.onUpdated(this.dataSource());
    }
  };

  /**
   * 刷新位置数据
   * @returns
   */
  updateMovementData = () => {
    //获取tag
    if (this.currentMovement == null) return;
    const newData = this.currentMovement.data;
    if (!newData) {
      return;
    }
    //从原有的数据集查找该tag
    let changed = false;
    for (let i = 0; i < this.data.length; i++) {
      let oldValue = this.data[i];
      if (oldValue.tag === newData.tag && newData.uuid === oldValue.uuid) {
        if (JSON.stringify(oldValue) != JSON.stringify(newData)) {
          this.data[i] = newData;
          changed = true;
          this.config.onAnnoChanged(newData, oldValue);
        }
        break;
      }
    }
    if (changed) {
      this.config.onUpdated(this.dataSource(), this.currentMovement);
    }
  };

  #removeAnnotationEvent = e => {
    if (!this.options.editable) return;
    let selectNode = e.currentTarget.parentNode.parentNode.parentNode;
    this.removeAnnotation(selectNode);
  };

  #hideTagWhenDragging = isHide => {
    let cNode = this.currentMovement.currentNode;
    let classList = cNode.querySelector("." + opContainer).classList;
    if (classList.contains("hidden")) {
      classList.remove("hidden");
    }
    if (isHide) {
      classList.add("hidden");
    } else {
      classList.remove("hidden");
    }
  };

  /**
   * 删除标注
   * @param {*} node Element
   */
  removeAnnotation = node => {
    if (node) {
      let uuid = node.dataset.uuid;
      // const tag = node.querySelector(`.${imageOpTag}`).dataset.id;
      let value;
      for (let i = 0; i < this.data.length; i++) {
        value = this.data[i];
        if (
          //value.tag === tag &&
          value.uuid === uuid
        ) {
          if (this.config.onAnnoRemoved(value)) {
            this.data.splice(i, 1);
          }
          break;
        }
      }
      this.config.onUpdated(this.dataSource());
      if (typeof node.remove === "function") {
        node.remove();
      } else {
        node.parentNode?.removeChild(node);
      }
    }
  };

  //init
  drawAnnotation = (rect, tag = void 0) => {
    if (!this.isValid(rect)) {
      return;
    }
    this.removeSelectedAnnotation();
    //创建Annotation节点
    let annotation = document.createElement("div");
    annotation.className = `${this.options.annotationClass} selected`;
    annotation.style.position = "absolute";
    annotation.style.top = rect.y;
    annotation.style.left = rect.x;
    annotation.style.width = rect.width;
    annotation.style.height = rect.height;
    //创建8个resizeDot
    const resizeDotClasses = {
      top: `${PREFIX_RESIZE_DOT} top`,
      bottom: `${PREFIX_RESIZE_DOT} bottom`,
      left: `${PREFIX_RESIZE_DOT} left`,
      right: `${PREFIX_RESIZE_DOT} right`,
      topLeft: `${PREFIX_RESIZE_DOT} top-left`,
      topRight: `${PREFIX_RESIZE_DOT} top-right`,
      bottomLeft: `${PREFIX_RESIZE_DOT} bottom-left`,
      bottomRight: `${PREFIX_RESIZE_DOT} bottom-right`,
      trash: opContainer
    };
    let i = 0;
    if (typeof tag === "object") {
      tag = {
        ...Movement.tagTemplate(tag.tagName, tag.tag, tag.uuid),
        ...tag
      };
      console.log("💥💥💥💥💥💥💥", tag.uuid);
    }
    // else if (typeof tag === 'string') {
    //     tag = Movement.tagTemplate(tag, tag)
    // } else {
    //     tag = Movement.tagTemplate()
    // }
    for (let prop in resizeDotClasses) {
      let resizeDot = document.createElement("div");
      if (i === 8) {
        resizeDot.className = `${
          this.options.blurOtherDotsShowTags ? "" : `${dotCls[i]}`
        } ${resizeDotClasses[prop]}`;
        let opContent = document.createElement("div");
        opContent.className = imageOpContent;
        if (!this.options.showTags) {
          opContent.style.visibility = "collapse";
        } else {
          opContent.style.visibility = "visible";
        }
        if (this.options.tagLocation == defaultPositions.out_bottom) {
          opContent.style.position = "absolute";
          opContent.style.bottom = null;
        } else {
          opContent.style.position = null;
        }
        let trash = document.createElement("i");
        trash.className = opTagDel + " iconfont s-icon icon-trash s-icon-trash";
        trash.innerText = " × ";
        trash.addEventListener("click", this.#removeAnnotationEvent, true);
        if (!this.options.closable) {
          trash.style.display = "none";
        } else {
          trash.style.display = "";
        }
        let tagEl = document.createElement("span");
        tagEl.dataset.name = tag.tagName;
        tagEl.className = `${imageOpTag}`;
        tagEl.innerText = tag.tagName;
        tagEl.dataset.id = tag.tag;
        if (this.options.trashPositionStart) {
          opContent.appendChild(trash);
          opContent.appendChild(tagEl);
        } else {
          opContent.appendChild(tagEl);
          opContent.appendChild(trash);
        }
        resizeDot.appendChild(opContent);
      } else {
        resizeDot.className = `${resizeDotClasses[prop]} ${dotCls[i]} ${
          this.options.editable ? "" : "hidden"
        }`;
      }
      annotation.appendChild(resizeDot);
      i++;
    }
    //加事件
    this.annotationContainer.appendChild(annotation);
    annotation.oncontextmenu = e => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      let node = e.currentTarget;
      const tagAttr = node.querySelector(`.${imageOpTag}`).dataset;
      let ab = this.dataSourceOfTag(tagAttr.id, node.dataset.uuid);
      this.config.onAnnoContextMenu(ab, e.target, this);
      // this.removeAnnotation(selectNode);
      return true;
    };
    this.currentMovement = new Movement(
      annotation,
      0,
      this.#boundRect(),
      this.options
    );
    // this.selectAnnotation();
    // let dts = this.dataTemplate(tag, rect.x, rect.y,
    //     parseFloat(rect.x) + parseFloat(rect.width) + '%',
    //     parseFloat(rect.y) + parseFloat(rect.height) + '%')
    this.currentMovement.updateData({
      ...tag
    });
    this.currentMovement.fetchData();
    this.data.push(this.currentMovement.data);
    this.setTagForCurrentMovement(this.currentMovement.data);
    this.config.onAnnoAdded(this.currentMovement.data, annotation);
    // this.config.onUpdated(this.dataSource());
  };

  dispatchEventToAnno = e => {
    // e.preventDefault();
    // e.stopPropagation();
    // if (!e.target.classList.contains('annotation') &&
    // !e.target.classList.contains(`${PREFIX_RESIZE_DOT}`)) {
    //     eventTargetOnTransform = false;
    //   }
    const eventType = e.type;
    // console.log(`eventType=${eventType}`);
    if (eventType === MOUSE_EVENT[6]) {
      this.selectAnnotation();
      this.#hideTagWhenDragging(false);
      return;
    }
    let clientX = e.clientX,
      clientY = e.clientY;
    if (e.targetTouches && e.targetTouches.length > 0) {
      let touch = e.targetTouches[0];
      clientX = touch ? touch.clientX : undefined;
      clientY = touch ? touch.clientY : undefined;
    }
    // console.log('eventType', eventType)
    this.#moveX = clientX; //- this.#boundRect().x;
    this.#moveY = clientY; //- this.#boundRect().y;
    if (eventType === MOUSE_EVENT[0] || eventType === TOUCH_EVENT[0]) {
      this.actionDown = true;
      this.#lastX = this.#moveX;
      this.#lastY = this.#moveY;
      if (typeof this.#callback_handler === "function") {
        this.#callback_handler(true);
      }
      this.#draggingStartLazy = false;
      // eventTargetOnTransform = true;
      this.#targetEventType(e);
    } else if (
      eventType === MOUSE_EVENT[1] ||
      eventType === MOUSE_EVENT[3] ||
      eventType === MOUSE_EVENT[5] ||
      eventType === TOUCH_EVENT[1] ||
      eventType === TOUCH_EVENT[3] ||
      eventType === TOUCH_EVENT[5]
    ) {
      if (this.options.draggingNoTag && !this.#draggingStartLazy) {
        this.#hideTagWhenDragging(true);
      }
      this.#draggingStartLazy = true;
      if (this.currentMovement == null) {
        return true;
      }
      if (this.actionDown) {
        if (this.filterOutOfBounds(this.#moveX, this.#moveY)) {
          return;
        }
        this.currentMovement.transform(
          this.#moveX - this.#lastX,
          this.#moveY - this.#lastY
        );
        this.#lastX = this.#moveX;
        this.#lastY = this.#moveY;
      }
    } else {
      this.#draggingStartLazy = false;
      if (typeof this.#callback_handler === "function") {
        this.#callback_handler(false);
      }
      // eventTargetOnTransform = false;
      if (this.actionDown) {
        this.updateMovementData();
        this.selectAnnotation();
      }
      this.actionDown = false;
      if (this.options.draggingNoTag) {
        this.#hideTagWhenDragging(false);
      }
    }
  };

  removeSelectedAnnotation = () => {
    if (this.currentMovement) {
      let cs = this.currentMovement.currentNode.classList;
      cs.remove("selected");
      if (this.options.blurOtherDots) {
        this.currentMovement.currentNode
          .querySelectorAll(`[class*=${PREFIX_RESIZE_DOT}]`)
          .forEach(node => {
            node.classList.add("hidden");
          });
      }
    }
  };

  /**
   * 选择标注
   * @param {*} isUserinteracted 是否是手动触发
   * @returns
   */
  selectAnnotation = (isUserinteracted = true) => {
    if (this.currentMovement) {
      let cs = this.currentMovement.currentNode.classList;
      if (!cs.contains("annotation")) {
        return;
      }
      cs.add("selected");
      const node = this.currentMovement.currentNode;
      // const ln = node.querySelector(`.${imageOpTag}`);
      // const tag_str = ln.innerText;
      // const tagAttr = ln.dataset;
      let selectData = {
        ...this.currentMovement.data
        // ...this.dataSourceOfTag(tagAttr.id, node.dataset.uuid),
      };
      if (this.options.blurOtherDots) {
        if (!this.options.editable) {
          this.currentMovement.currentNode
            .querySelectorAll(`[class*=${PREFIX_RESIZE_DOT}]`)
            .forEach(node => {
              if (node.classList.contains(dotCls[8])) {
                node.classList.remove("hidden");
              } else {
                node.classList.add("hidden");
              }
            });
          if (this.options.readOnlyCanSelected) {
            this.config.onAnnoSelected(selectData, node);
          }

          return;
        }
        this.currentMovement.currentNode
          .querySelectorAll(`[class*=${PREFIX_RESIZE_DOT}]`)
          .forEach(node => {
            node.classList.remove("hidden");
          });
      }
      if (!isUserinteracted) return;
      this.config.onAnnoSelected(selectData, node);
    }
  };

  selectMarkerByTagId = tagId => {
    let tag = this.annotationContainer.querySelector(`[data-id="${tagId}"]`);
    if (tag) {
      let parentEl = tag.parentNode.parentNode.parentNode;
      this.removeSelectedAnnotation();
      if (this.currentMovement == null) {
        this.currentMovement = new Movement(
          parentEl,
          -1,
          this.#boundRect(),
          this.options
        );
      }
      let cData = this.data.find(item => item.uuid == parentEl.dataset.uuid);
      this.currentMovement.data = cData;
      this.currentMovement.currentNode = parentEl;
      this.currentMovement.boundRect = this.#boundRect();
      this.currentMovement.type = -1;
      this.selectAnnotation(false);
    }
  };

  #targetEventType = e => {
    this.removeSelectedAnnotation();
    let el = e.target;
    let parentEl = el.classList.contains("annotation") ? el : el.parentNode;
    if (this.currentMovement == null) {
      this.currentMovement = new Movement(
        parentEl,
        0,
        this.#boundRect(),
        this.options
      );
    }

    let cData = this.data.find(item => item.uuid == parentEl.dataset.uuid);
    this.currentMovement.data = cData;
    this.currentMovement.currentNode = parentEl;
    this.#currentMovementDisabled = false;
    this.currentMovement.boundRect = this.#boundRect();
    if (el.classList.contains(dotCls[0])) {
      //top
      this.currentMovement.type = 0;
    } else if (el.classList.contains(dotCls[1])) {
      //bottom
      this.currentMovement.type = 1;
    } else if (el.classList.contains(dotCls[2])) {
      //left
      this.currentMovement.type = 2;
    } else if (el.classList.contains(dotCls[3])) {
      //right
      this.currentMovement.type = 3;
    } else if (el.classList.contains(dotCls[4])) {
      //top-left
      this.currentMovement.type = 4;
    } else if (el.classList.contains(dotCls[5])) {
      //top-right
      this.currentMovement.type = 5;
    } else if (el.classList.contains(dotCls[6])) {
      //bottom-left
      this.currentMovement.type = 6;
    } else if (el.classList.contains(dotCls[7])) {
      //bottom-right
      this.currentMovement.type = 7;
    } else if (el.classList.contains("annotation")) {
      this.currentMovement.type = -1;
    } else {
      // this.currentMovement = null;
      this.#currentMovementDisabled = true;
    }
    // this.selectAnnotation();
  };

  filterOutOfBounds = (x, y) => {
    return (
      x >= this.#boundRect().x + this.#boundRect().width + 2 ||
      y >= this.#boundRect().y + this.#boundRect().height + 2 ||
      x < 5 ||
      y < 5
    );
  };
}
