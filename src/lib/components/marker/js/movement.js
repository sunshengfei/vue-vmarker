'use strict';
export default class Movement {

    constructor(node, type = -1, boundRect, options) {
      this.moveNode = node;
      this.type = type;
      this.boundRect = boundRect;
      this.options = options;
    }
  
    transform = (offsetX, offsetY) => {
      if (!this.options.editable) return;
      let parentEl = this.moveNode;
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
    };
  
  }