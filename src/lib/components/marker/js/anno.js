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
import {
    supportShapes,
    MOUSE_EVENT,
    TOUCH_EVENT,
    dotCls,
    imageOpTag,
    imageOpContent,
    PREFIX_RESIZE_DOT,
    defaultPositions,
    defaultConfig,
    resizeDotClasses,
    UUID
} from './config';
import Movement from './movement';
import { toElement, attrtoSvg, attrstringify } from "aha-svg";
import { Rect, RectF } from "aha-graphic";
import { initdraft, draftresize, resizeDotPoints, getShapeAnnoSVGString, getFrameData } from "./drafthelper"

export default class ResizeAnnotation {

    constructor(parentNode, boundRect, callback = defaultConfig, callback_handler) {
        this.options = {
            ...defaultConfig.options,
        };
        this.currentShape = ''
        this.rawConfig = { ...defaultConfig };
        this.callback_handler = callback_handler;
        this.annotationContainer = parentNode;
        this.boundRect = boundRect;
        this.actionDown = false;
        this.currentMovement = null;
        this.data = [];
        let that = this
        this.delEvent = function (e) {
            if (e.keyCode === 8 || e.keyCode === 46) {
                let currentMovement = that.currentMovement
                if (currentMovement) {
                    that.removeAnnotation(currentMovement.moveNode);
                }
            }
        }
        this.setConfigOptions(callback)
    }

    _event = () => {
        if (this.options.supportDelKey) {
            document.addEventListener("keydown", this.delEvent)
        } else {
            document.removeEventListener("keydown", this.delEvent)
        }
    }

    _uiconstruct = () => {
        if (this.annotationContainer) {
            let imageOpContents = this.annotationContainer.querySelectorAll(`.${imageOpContent}`)
            for (let index = 0; index < imageOpContents.length; index++) {
                const opContent = imageOpContents[index];
                if (!this.options.showTags) {
                    opContent.style.visibility = 'collapse';
                } else {
                    opContent.style.visibility = 'visible';
                }
                if (this.options.tagLocation == defaultPositions.out_bottom) {
                    opContent.style.position = 'absolute';
                    opContent.style.bottom = null;
                } else {
                    opContent.style.position = null;
                }
            }
        }
        //
        if (this.currentMovement && !this.options.editable) {
            this.currentMovement.moveNode.querySelectorAll(`[class*=${PREFIX_RESIZE_DOT}]`)
                .forEach((node) => {
                    if (node.classList.contains(dotCls[8])) {
                        node.classList.remove('hidden');
                    } else {
                        node.classList.add('hidden');
                    }
                });
        }

    }

    setConfigOptions = (newOptions) => {
        this.options = { ...this.options, ...newOptions.options }
        this.rawConfig = { ...this.rawConfig, ...newOptions }
        this._event()
        this._uiconstruct()
    }

    //获取数据模板
    dataTemplate = (tagObject, rRect) => {
        if (!/^.+$/gi.test(tagObject.tag)) {
            tagObject.tag = `temp@${new Date().getTime()}`
        }
        let shape = tagObject.shape
        let position = null
        if (shape == supportShapes[0]) {
            let pRect = new Rect(
                parseFloat(rRect.x),
                parseFloat(rRect.y),
                parseFloat(rRect.width),
                parseFloat(rRect.height)
            )
            let rectF = pRect.mapToRectF()
            position = {
                x: rectF.left + "%",
                y: rectF.top + "%",
                x1: rectF.right + "%",
                y1: rectF.bottom + "%"
            }
        } else if (shape == supportShapes[1]) {
            position = {
                x: rRect.cx,
                y: rRect.cy,
                r: rRect.r
            }
        }
        return {
            ...tagObject,
            position
        };
    };

    reset = () => {
        this.data = []
    }

    isValid = (rect) => {
        return rect && (parseFloat(rect.width) > 1 && parseFloat(rect.height) > 1 || parseFloat(rect.r) > 1);
    };

    renderData = (
        dataArray = [], base = { width: this.boundRect().width, height: this.boundRect().height }) => {
        if (dataArray instanceof Array && dataArray.length > 0) {
            dataArray.forEach((data, index, arr) => {
                let rect;
                if (data.position.x.endsWith('%')) {
                    rect = {
                        x: data.position.x,
                        y: data.position.y,
                        width: (parseFloat(data.position.x1) - parseFloat(data.position.x)) + '%',
                        height: (parseFloat(data.position.y1) - parseFloat(data.position.y)) + '%'
                    }
                } else {
                    rect = {
                        x: (100 * data.position.x / base.width).toFixed(3) + '%',
                        y: (100 * data.position.y / base.height).toFixed(3) + '%',
                        width: (100 * (data.position.x1 - data.position.x) / base.width).toFixed(3) + '%',
                        height: (100 * (data.position.y1 - data.position.y) / base.height).toFixed(3) + '%'
                    };
                }
                this.drawAnnotation(rect, data, shape = data.shape);
            });
        } else {
            this.reset();
        }
        this.rawConfig.onAnnoDataFullLoaded();
    };

    dataSource = () => {
        return this.data;
    };

    dataSourceOfTag = (tagId, uuid) => {
        for (let i = 0; i < this.data.length; i++) {
            let value = this.data[i];
            if (value.tag === tagId && value.uuid == uuid) {
                return (value);
            }
        }
    };


    setTagForCurrentMovement = (tagOb) => {
        if (this.currentMovement) {
            const node = this.currentMovement.moveNode;
            let tag_str = '', tag_id = '';
            if (typeof tagOb === 'string') {
                tag_id = tag_str = tagOb;
            }
            const oldtag = node.dataset.id;
            let constData = {};
            if (typeof tagOb === 'object') {
                tag_str = tagOb['tagName']
                tag_id = tagOb['tag']
                constData = {
                    ...tagOb
                }
            }
            let uuid = node.dataset.uuid;
            //svg has no `innerText` 
            node.querySelector(`.${imageOpTag}`).innerHTML = tag_str;
            for (let i = 0; i < this.data.length; i++) {
                let value = this.data[i];
                let oldValue = Object.assign({}, value);
                if (value.tag === oldtag && value.uuid === uuid) {
                    value = {
                        ...value,
                        ...constData,
                        tag: tag_id,
                        tagName: tag_str,
                    }
                    node.dataset.id = tag_id;
                    node.dataset.name = tag_str;
                    this.rawConfig.onAnnoChanged(value, oldValue);
                    this.data[i] = value;
                }
            }
            this.rawConfig.onUpdated(this.dataSource());
        }
    };

    updateMovementData = () => {
        //获取tag
        if (this.currentMovement == null) return;
        const node = this.currentMovement.moveNode;
        let uuid = node.dataset.uuid;
        // querySelector(`.${imageOpTag}`)
        const tag = node.dataset.id;
        const mainElement = node.firstElementChild
        //从原有的数据集查找该tag 
        let changed = false
        for (let i = 0; i < this.data.length; i++) {
            let value = this.data[i];
            let oldValue = Object.assign({}, value);
            if (value.tag === tag && value.uuid === uuid) {
                let position = getFrameData(mainElement, value.shape)
                if (JSON.stringify(value.position) != JSON.stringify(position)) {
                    value.position = position;
                    this.data[i] = value;
                    changed = true
                    this.rawConfig.onAnnoChanged(value, oldValue);
                }
                break
            }
        }
        if (changed) {
            this.rawConfig.onUpdated(this.dataSource(), this.currentMovement);
        }
    };

    _removeAnnotationEvent = (e) => {
        if (!this.options.editable) return;
        let selectNode = e.currentTarget.parentNode.parentNode.parentNode;
        this.removeAnnotation(selectNode);
    };

    removeAnnotation = (node) => {
        if (node) {
            let uuid = node.dataset.uuid;
            // const tag = node.querySelector(`.${imageOpTag}`).dataset.id;
            let value;
            for (let i = 0; i < this.data.length; i++) {
                value = this.data[i];
                if (//value.tag === tag && 
                    value.uuid === uuid) {
                    if (this.rawConfig.onAnnoRemoved(value)) {
                        this.data.splice(i, 1);
                    }
                    break;
                }
            }
            this.rawConfig.onUpdated(this.dataSource());
            node.remove();
        }
    }

    //init
    drawAnnotation = (rRect, tag = void 0, shape = "rect") => {
        // debugger
        if (!this.isValid(rRect)) {
            return;
        }
        this.removeSelectedAnnotation();
        //创建Annotation节点
        // annotationContainer
        //边框
        let rr = this.boundRect()
        //region
        let collectionArr = []
        let rectStr = getShapeAnnoSVGString(rRect, `${this.options.annotationClass} selected`, shape);
        collectionArr.push(rectStr)
        // let rSize = {
        //     x: isNaN(rRect.x) ? parseFloat(rRect.x) * 0.01 * rRect.width : rRect.x,
        //     y: isNaN(rRect.y) ? parseFloat(rRect.y) * 0.01 * rRect.height : rRect.y,
        //     height: rr.height * 0.01 * parseFloat(rRect.height),
        //     width: rr.width * 0.01 * parseFloat(rRect.width),
        // }
        let uu = `${UUID(16, 16)}`;
        let tagString, tagId;
        if (typeof tag === 'object') {
            tagString = tag.tagName;
            tagId = tag.tag;
        }
        else if (typeof tag === 'string') {
            tagString = tag;
            tagId = tag;
        } else {
            tagString = '请选择或添加新标签';
            tagId = `temp@${uu}`;
        }
        tag = {
            ...tag,
            tag: tagId,
            tagName: tagString,
            shape
        }
        let pRect = new Rect(
            parseFloat(rRect.x),
            parseFloat(rRect.y),
            parseFloat(rRect.width),
            parseFloat(rRect.height)
        )
        let arr = resizeDotPoints({ tagId, tagString }, rRect, rr, shape, this.options)
        collectionArr.push(...arr)
        let annotation = toElement(`<g>${collectionArr.join('')}</g>`)//group
        annotation.dataset.shape = shape
        annotation.dataset.uuid = uu;
        annotation.dataset.id = tagId;
        this.annotationContainer.appendChild(annotation);

        // for (let prop in resizeDotClasses) {
        //     let resizeDot = document.createElement('div');
        //     if (i === 8) {
        //         resizeDot.className = `${this.options.blurOtherDotsShowTags
        //             ? ''
        //             : `${dotCls[i]}`} ${resizeDotClasses[prop]}`;
        //         let opContent = document.createElement('div');
        //         opContent.className = imageOpContent;
        //         if (!this.options.showTags) {
        //             opContent.style.visibility = 'collapse';
        //         } else {
        //             opContent.style.visibility = 'visible';
        //         }
        //         if (this.options.tagLocation == defaultPositions.out_bottom) {
        //             opContent.style.position = 'absolute';
        //             opContent.style.bottom = null;
        //         } else {
        //             opContent.style.position = null;
        //         }
        //         let trash = document.createElement('i');
        //         trash.className = 'g-image-op-del iconfont s-icon icon-trash s-icon-trash';
        //         trash.innerText = ' × ';
        //         trash.addEventListener('click', this._removeAnnotationEvent, true);
        //         let tag = document.createElement('span');
        //         tag.dataset.name = tagString;
        //         tag.className = `${imageOpTag}`;
        //         tag.innerText = tagString;
        //         tag.dataset.id = tagId;
        //         if (this.options.trashPositionStart) {
        //             opContent.appendChild(trash);
        //             opContent.appendChild(tag);
        //         } else {
        //             opContent.appendChild(tag);
        //             opContent.appendChild(trash);
        //         }
        //         resizeDot.appendChild(opContent);
        //     } else {
        //         resizeDot.className = `${resizeDotClasses[prop]} ${dotCls[i]} ${this.options.editable
        //             ? ''
        //             : 'hidden'}`;
        //     }
        //     annotation.appendChild(resizeDot);
        //     i++;
        // }
        // //加事件
        annotation.oncontextmenu = (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            let node = e.target;
            const tagAttr = e.target.querySelector(`.${imageOpTag}`).dataset;
            let ab = this.dataSourceOfTag(tagAttr.id, node.dataset.uuid);
            this.rawConfig.onAnnoContextMenu(ab, node, this);
            // this.removeAnnotation(selectNode);
            return true;
        }
        this.currentMovement = new Movement(annotation, 0, this.boundRect(), this.options);
        // this.selectAnnotation();
        let dts = this.dataTemplate(tag,
            rRect
        )
        let insertItem = { ...dts, uuid: uu };
        this.data.push(insertItem);
        this.rawConfig.onAnnoAdded(insertItem, annotation);
        this.rawConfig.onUpdated(this.dataSource());
    };

    dragEventOn = (e) => {
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
            return;
        }
        let clientX = e.clientX,
            clientY = e.clientY;
        if (e.targetTouches && e.targetTouches.length > 0) {
            let touch = e.targetTouches[0]
            clientX = touch ? touch.clientX : undefined
            clientY = touch ? touch.clientY : undefined
        }
        this.moveX = clientX;//- this.boundRect().x;
        this.moveY = clientY;//- this.boundRect().y;
        if (eventType === MOUSE_EVENT[0] || eventType === TOUCH_EVENT[0]) {
            this.actionDown = true;
            this.lastX = this.moveX;
            this.lastY = this.moveY;
            if (typeof this.callback_handler === 'function') {
                this.callback_handler(true);
            }
            // eventTargetOnTransform = true;
            this.targetEventType(e);
        } else if (eventType === MOUSE_EVENT[1] || eventType === MOUSE_EVENT[3] || eventType ===
            MOUSE_EVENT[5] || eventType === TOUCH_EVENT[1] || eventType === TOUCH_EVENT[3] || eventType === TOUCH_EVENT[5]
        ) {
            if (this.currentMovement == null) {
                return true;
            }
            if (this.actionDown) {
                if (this.filterOutOfBounds(this.moveX, this.moveY)) {
                    return;
                }
                this.currentMovement.transform(this.moveX - this.lastX, this.moveY - this.lastY);
                this.lastX = this.moveX;
                this.lastY = this.moveY;
            }
        } else {
            if (typeof this.callback_handler === 'function') {
                this.callback_handler(false);
            }
            // eventTargetOnTransform = false;
            if (this.actionDown) {
                this.updateMovementData();
                this.selectAnnotation();
            }
            this.actionDown = false;
        }
    };

    removeSelectedAnnotation = () => {
        if (this.currentMovement) {
            let cs = this.currentMovement.moveNode.classList;
            cs.remove('selected');
            if (this.options.blurOtherDots) {
                this.currentMovement.moveNode.querySelectorAll(`[class*=${PREFIX_RESIZE_DOT}]`)
                    .forEach((node) => {
                        if (node.classList.contains(dotCls[8])) {
                        } else {
                            node.classList.add('hidden');
                        }
                    });
            }
            // fix unselect mv can be deleted
            this.currentMovement = null
        }
    };

    selectAnnotation = (isUserinteracted = true) => {
        if (this.currentMovement) {
            let cs = this.currentMovement.moveNode.classList;
            cs.add('selected');
            if (this.options.blurOtherDots) {
                if (!this.options.editable) {
                    this.currentMovement.moveNode.querySelectorAll(`[class*=${PREFIX_RESIZE_DOT}]`)
                        .forEach((node) => {
                            if (node.classList.contains(dotCls[8])) {
                                node.classList.remove('hidden');
                            } else {
                                node.classList.add('hidden');
                            }
                        });
                    return;
                }
                this.currentMovement.moveNode.querySelectorAll(`[class*=${PREFIX_RESIZE_DOT}]`)
                    .forEach((node) => {
                        node.classList.remove('hidden');
                    });
            }
            if (!isUserinteracted) return;
            const node = this.currentMovement.moveNode;
            // const tag_str = node.querySelector(`.${imageOpTag}`).innerText;
            const tagAttr = node.dataset;
            let selectData = {
                ...tagAttr,
                ...this.dataSourceOfTag(tagAttr.id, tagAttr.uuid),
            }
            this.rawConfig.onAnnoSelected(selectData, node)
        }
    };

    selectMarkerByTagId = (tagId) => {
        let tag = this.annotationContainer.querySelector(`[data-id="${tagId}"]`);
        if (tag) {
            let markerAnnotation = tag.parentNode.parentNode.parentNode
            this.removeSelectedAnnotation();
            this.currentMovement = new Movement(markerAnnotation, -1, this.boundRect(), this.options);
            this.selectAnnotation(false);
        }
    }

    targetEventType = (e) => {
        this.removeSelectedAnnotation();
        let el = e.target;
        let parentEl = el.classList.contains('annotation') ? el.parentNode : el.parentNode;
        if (el.classList.contains(dotCls[0])) {
            //top
            this.currentMovement = new Movement(parentEl, 0, this.boundRect(), this.options);
        } else if (el.classList.contains(dotCls[1])) {
            //bottom
            this.currentMovement = new Movement(parentEl, 1, this.boundRect(), this.options);
        }
        else if (el.classList.contains(dotCls[2])) {
            //left
            this.currentMovement = new Movement(parentEl, 2, this.boundRect(), this.options);
        }
        else if (el.classList.contains(dotCls[3])) {
            //right
            this.currentMovement = new Movement(parentEl, 3, this.boundRect(), this.options);
        } else if (el.classList.contains(dotCls[4])) {
            //top-left
            this.currentMovement = new Movement(parentEl, 4, this.boundRect(), this.options);
        }
        else if (el.classList.contains(dotCls[5])) {
            //top-right
            this.currentMovement = new Movement(parentEl, 5, this.boundRect(), this.options);
        }
        else if (el.classList.contains(dotCls[6])) {
            //bottom-left
            this.currentMovement = new Movement(parentEl, 6, this.boundRect(), this.options);
        }
        else if (el.classList.contains(dotCls[7])) {
            //bottom-right
            this.currentMovement = new Movement(parentEl, 7, this.boundRect(), this.options);
        } else if (el.classList.contains('annotation')) {
            this.currentMovement = new Movement(parentEl, -1, this.boundRect(), this.options);
        } else {
            this.currentMovement = null;
        }
        // this.selectAnnotation();
    };


    filterOutOfBounds = (x, y) => {
        return (
            x >= this.boundRect().x + this.boundRect().width + 2 ||
            y >= this.boundRect().y + this.boundRect().height + 2 ||
            x < 5 || y < 5
        );
    };

}