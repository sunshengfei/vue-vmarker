import { toElement, attrtoSvg, attrstringify } from "aha-svg";
import { RectF } from "aha-graphic";
import { resizeDot as resizeRectDot } from "./resizedot_rect"
import { resizeDot as resizeCircleDot } from "./resizedot_circle"
import { supportShapes } from "./config"

export function initdraft(pointX = 0, pointY = 0, shape = 'rect') {
  if (shape == supportShapes[0]) {
    const slotString = attrstringify({
      x: pointX,
      y: pointY,
      height: 0,
      width: 0,
      style: "stroke: #f1f1f1;fill:rgba(0,0,0,0.2)"
    });
    return toElement(`<rect ${slotString}/>`);
  }
  if (shape == supportShapes[1]) {
    const slotString = attrstringify({
      cx: pointX,
      cy: pointY,
      r: 0,
      style: "stroke: #f1f1f1;fill:rgba(0,0,0,0.2)"
    });
    return toElement(`<circle ${slotString}/>`);
  }
  const slotString = attrstringify({
    points: `${pointX},${pointY} ${pointX},${pointY + 1} ${pointX + 1},${pointY}`,
    style: "stroke: #f1f1f1;fill:rgba(0,0,0,0.2)"
  });
  // debugger
  return toElement(`<polygon ${slotString}/>`);
}

export function getShapeAnnoSVGString(rRect = {}, className, shape = 'rect') {
  if (shape == supportShapes[0]) {
    const slotString = attrstringify({
      ...rRect,
      style: "stroke: #3e3e3e;fill:rgba(0,0,0,0.2)"
    });
    return `<rect class="${className}" ${slotString}/>`;
  }
  if (shape == supportShapes[1]) {
    const slotString = attrstringify({
      cx: rRect.cx,
      cy: rRect.cy,
      r: rRect.r,//|| (Math.abs(hypotenuse(rectF.width(), rectF.height())) + '%'),
      style: "stroke: #3e3e3e;fill:rgba(0,0,0,0.2)"
    });
    return `<circle class="${className}" ${slotString}/>`;
  }
}

export function draftresize(rRectF, boundRect, shape = 'rect') {
  if (shape == supportShapes[0]) {
    let widthRatio = (100 * Math.abs(rRectF.width()) / boundRect.width).toFixed(3);
    let heightRatio = (100 * Math.abs(rRectF.height()) / boundRect.height).toFixed(3);
    return {
      width: widthRatio + '%',
      height: heightRatio + '%',
    };
  }
  if (shape == supportShapes[1]) {
    let cx = (100 * Math.abs(rRectF.left) / boundRect.width).toFixed(3),
      cy = (100 * Math.abs(rRectF.top) / boundRect.height).toFixed(3),
      radius = (Math.abs(hypotenuse(100 * rRectF.width() / boundRect.width, 100 * rRectF.height() / boundRect.height))).toFixed(3);
    //边界判断
    // if (cx - radius < 0.01) {
    //   return {}
    // }
    // if (cx + radius > 100 - 0.01) {
    //   return {}
    // }
    return {
      cx: cx + '%',
      cy: cy + '%',
      r: radius + '%'
    };
  }
  return {}
}

export function hypotenuse(a, b) {
  return Math.sqrt(a ** 2 + b ** 2)
}


export function resizeDotPoints(tag, rRect, boundRect, shape = 'rect', options) {
  if (shape == supportShapes[0]) {
    return resizeRectDot(tag, rRect, boundRect, options)
  }
  if (shape == supportShapes[1]) {
    return resizeCircleDot(tag, rRect, boundRect, options)
  }
}

export function getFrameData(mainElement, shape = 'rect') {
  shape = shape || mainElement.nodeName
  if (shape == supportShapes[0]) {
    return {
      x: mainElement.getAttribute('x'),
      y: mainElement.getAttribute('y'),
      x1: (parseFloat(mainElement.getAttribute('width')) + parseFloat(mainElement.getAttribute('x'))).toFixed(3) + '%',
      y1: (parseFloat(mainElement.getAttribute('height')) + parseFloat(mainElement.getAttribute('y'))).toFixed(3) + '%',
    };
  }
  if (shape == supportShapes[1]) {
    return {
      x: mainElement.getAttribute('cx'),
      y: mainElement.getAttribute('cy'),
      r: parseFloat(mainElement.getAttribute('r')) + '%'
    };
  }

}