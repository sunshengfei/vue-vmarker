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
  let rectF = new RectF(
    parseFloat(rRect.cx),
    parseFloat(rRect.cy),
    parseFloat(rRect.cx) + parseFloat(rRect.r),
    parseFloat(rRect.cy) + parseFloat(rRect.r),
  )
  let collectionArr = []
  const radius = 4
  let fontSize = 12, operPadding = 4
  //rRect 为百分比单位
  // 先去掉所有的%
  let prop = "right"
  let point = {
    x: rectF.right,
    y: rectF.top
  }
  let className = `${resizeDotClasses[prop]} ${dotCls[3]} ${options.editable ? '' : 'hidden'}`;
  let dotTemplate = `<circle class="${className}" cx="${point.x.toFixed(2)}%" cy="${point.y.toFixed(2)}%" r="${radius}" style="stroke:#006600; fill:#00cc00"/>`
  collectionArr.push(dotTemplate)
  let classNameT = `${options.blurOtherDotsShowTags ? ''
    : `${dotCls[8]} `}${resizeDotClasses['trash']}`;
  let trashclassName = 'g-image-op-del iconfont s-icon icon-trash s-icon-trash';
  let dotTemplateT =
    `<g class="${classNameT}" filter="url(#tag_op_bg)" style="stroke-width:0;fill: #000000">
              <svg x="${(rectF.left - rectF.width()).toFixed(2)}%" y="${rectF.bottom.toFixed(2)}%" width="100%">
              <text class="${trashclassName}" x="${operPadding}" y="${fontSize - operPadding / 2}" font-size="${fontSize}" height="${fontSize}" style="stroke-width:0;">X</text>
              <text x="${operPadding / 2 + fontSize}" y="${fontSize - operPadding / 2}" font-size="${fontSize}" height="${fontSize}" style="stroke-width:0;" class="${imageOpTag}">${tagString}</text>
              </svg>
              </g>`
  collectionArr.push(dotTemplateT)
  return collectionArr;
}