import { Rect, RectF } from "aha-graphic";
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
} from './config';
export function resizeDot({ tagString }, rRect, boundRect, options) {
  let pRect = new Rect(
    parseFloat(rRect.x),
    parseFloat(rRect.y),
    parseFloat(rRect.width),
    parseFloat(rRect.height)
  )
  let collectionArr = []
  const radius = 4
  let fontSize = 12, operPadding = 4
  //rRect 为百分比单位
  // 先去掉所有的%
  const resizeDotPoints = {
    top: {
      x: pRect.x + pRect.width * 0.5, y: pRect.y
    },
    bottom: {
      x: pRect.x + pRect.width * 0.5, y: pRect.y + pRect.height
    },
    left: {
      x: pRect.x, y: pRect.y + pRect.height * 0.5
    },
    right: {
      x: pRect.x + pRect.width, y: pRect.y + pRect.height * 0.5
    },
    topLeft: {
      x: pRect.x, y: pRect.y
    },
    topRight: {
      x: pRect.x + pRect.width, y: pRect.y
    },
    bottomLeft: {
      x: pRect.x, y: pRect.y + pRect.height
    },
    bottomRight: {
      x: pRect.x + pRect.width, y: pRect.y + pRect.height
    },
    trash: {
      x: pRect.x, y: pRect.y + pRect.height - (fontSize + operPadding) * 100 / boundRect.height
    }
  }

  let i = 0;
  for (let prop in resizeDotClasses) {
    let point = resizeDotPoints[prop]
    if (i === 8) {
      let className = `${options.blurOtherDotsShowTags ? ''
        : `${dotCls[i]} `}${resizeDotClasses[prop]}`;
      let trashclassName = 'g-image-op-del iconfont s-icon icon-trash s-icon-trash';
      let dotTemplate =
        `<g class="${className}" filter="url(#tag_op_bg)" style="stroke-width:0;fill: #000000">
              <svg x="${point.x.toFixed(2)}%" y="${point.y.toFixed(2)}%" width="100%">
              <text class="${trashclassName}" x="${operPadding}" y="${fontSize - operPadding / 2}" font-size="${fontSize}" height="${fontSize}" style="stroke-width:0;">X</text>
              <text x="${operPadding / 2 + fontSize}" y="${fontSize - operPadding / 2}" font-size="${fontSize}" height="${fontSize}" style="stroke-width:0;" class="${imageOpTag}">${tagString}</text>
              </svg>
              </g>`
      collectionArr.push(dotTemplate)
    } else {
      let className = `${resizeDotClasses[prop]} ${dotCls[i]} ${options.editable
        ? ''
        : 'hidden'}`;
      let dotTemplate = `<circle class="${className}" cx="${point.x.toFixed(2)}%" cy="${point.y.toFixed(2)}%" r="${radius}" style="stroke:#006600; fill:#00cc00"/>`
      collectionArr.push(dotTemplate)
    }
    i++;
  }
  return collectionArr;
}