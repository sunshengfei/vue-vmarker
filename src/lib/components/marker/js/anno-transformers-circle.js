import { toElement, attrtoSvg, attrstringify } from "aha-svg";
import { RectF, Rect } from "aha-graphic";
import { resizeDot as resizeRectDot } from "./resizedot_rect"
import { resizeDot as resizeCircleDot } from "./resizedot_circle"
import {
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
} from "./config"
export const supportShapes = [
  "rect",
  "circle",
  "polygon"
]

export class CircleAnnoTransformer {
  constructor(movement) {
    this.movement = movement
  }

  transform = (offsetX, offsetY) => {
    if (!this.movement.options.editable) return;
    let frame = this.movement.boundRect
    let mainRect = this.movement.moveNode.firstElementChild
    const r = parseFloat(mainRect.getAttribute('r'));
    const cy = parseFloat(mainRect.getAttribute('cy'));
    const cx = parseFloat(mainRect.getAttribute('cx'));
    let box = mainRect.getBBox();
    let boundry = new RectF(
      100 * box.x / frame.width,
      100 * box.y / frame.height,
      100 * (box.width + box.x) / frame.width,
      100 * (box.height + box.y) / frame.height,
    )
    const heightOffset = 100 * offsetY / this.movement.boundRect.height;
    const widthOffset = 100 * offsetX / this.movement.boundRect.width;
    // console.log( `this.movement.type=${this.movement.type},rawHeightp=${rawHeightp},rawWidthp=${rawWidthp},rawTop=${rawTop},rawLeft=${rawLeft},heightOffset=${heightOffset},widthOffset=${widthOffset}`);
    if (boundry.top + heightOffset < this.movement.options.boundReachPercent || boundry.top + heightOffset > (100 - this.movement.options.boundReachPercent)) {
      return;
    }
    let rRect = {}
    if (this.movement.type === 3) {
      //right
      if (-heightOffset + boundry.top < this.movement.options.boundReachPercent || heightOffset + boundry.bottom > (100 - this.movement.options.boundReachPercent)) {
        return;
      }
      if (-widthOffset + boundry.left < this.movement.options.boundReachPercent || widthOffset + boundry.right > (100 - this.movement.options.boundReachPercent)) {
        return;
      }
      rRect = {
        r: (r + widthOffset).toFixed(3) + '%'
      }
    } else if (this.movement.type === -1) {
      //move
      if (heightOffset + boundry.top < this.movement.options.boundReachPercent || heightOffset + boundry.bottom > (100 - this.movement.options.boundReachPercent)) {
        return;
      }
      if (widthOffset + boundry.left < this.movement.options.boundReachPercent || widthOffset + boundry.right > (100 - this.movement.options.boundReachPercent)) {
        return;
      }
      rRect = {
        cy: (heightOffset + cy).toFixed(3) + '%',
        cx: (widthOffset + cx).toFixed(3) + '%',
      }
    }
    if (this.movement.moveNode.tagName == 'g' && mainRect) {
      attrtoSvg(mainRect, {
        ...rRect
      });
      let pRect = new Rect(
        parseFloat(rRect.cx || cx),
        parseFloat(rRect.cy || cy),
        parseFloat(rRect.r || r),
        parseFloat(rRect.r || r)
      )
      this._transitionDots(pRect)
    }
  };


  _transitionDots = (pRect = {}) => {
    let moveNode = this.movement.moveNode
    let prop = "right"
    let className = `${resizeDotClasses[prop]} ${dotCls[3]}`;
    let cName = className.split(" ").join(".")
    let circle = moveNode.querySelector(`.${cName}`)
    attrtoSvg(circle, {
      cx: `${(pRect.x + pRect.width).toFixed(2)}%`,
      cy: `${pRect.y.toFixed(2)}%`
    })

    let groupSvg = moveNode.querySelector(`svg`)
    attrtoSvg(groupSvg, {
      x: `${(pRect.x - pRect.width).toFixed(2)}%`,
      y: `${(pRect.y + pRect.height).toFixed(2)}%`
    })
  }
}
