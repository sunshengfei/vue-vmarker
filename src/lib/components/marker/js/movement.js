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
import { toElement, attrtoSvg, attrstringify } from "aha-svg";
import { resizeDotClasses, dotCls, supportShapes } from './config';
import { RectAnnoTransformer } from './anno-transformers-rect';
import { CircleAnnoTransformer } from './anno-transformers-circle';
import { Rect, RectF } from "aha-graphic";
export default class Movement {

  constructor(node, type = -1, boundRect, options) {
    this.moveNode = node;
    this.type = type;
    this.boundRect = boundRect;
    this.options = options;
  }

  transform = (offsetX, offsetY) => {
    if (!this.options.editable) return;
    let mainRect = this.moveNode.firstElementChild
    let shape = mainRect.nodeName
    if (shape == supportShapes[0]) {
      new RectAnnoTransformer(this).transform(offsetX, offsetY);
    } else if (shape == supportShapes[1]) {
      new CircleAnnoTransformer(this).transform(offsetX, offsetY);
    }

  };

}