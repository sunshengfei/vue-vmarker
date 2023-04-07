"use strict";

export const MOUSE_EVENT = [
  "mousedown",
  "mousemove",
  "mouseend",
  "mouseout",
  "mouseup",
  "mouseleave",
  "contextmenu"
];

export const TOUCH_EVENT = [
  "touchstart",
  "touchmove",
  "touchend",
  "touchcancel",
  "touchup",
  "touchleave"
];

export const defaultPositions = {
  bottom: 0x01,
  out_bottom: 0x02
};

export const defaultConfig = {
  options: {
    deviceType: "both", //both | mouse | touch
    blurOtherDots: false,
    blurOtherDotsShowTags: false,
    editable: true,
    readOnlyCanSelected: true,
    readOnlyAcceptEvent: ["mousedown", "mouseup", "touchstart", "touchup"],
    draggingNoTag: false,
    showTags: true,
    closable: true,
    supportDelKey: false,
    tagLocation: defaultPositions.bottom,
    trashPositionStart: 0,
    boundReachPercent: 0.01,
    textComponent: () => undefined,
    annotationClass: "annotation"
  },
  onAnnoContextMenu: function(annoData, element, annoContext) {},
  onAnnoRemoved: function(annoData, element) {
    return true;
  },
  onAnnoAdded: function(insertItem, element) {},
  onAnnoChanged: function(newValue, oldValue) {},
  onAnnoDataFullLoaded: function() {},
  onAnnoSelected: function(value, element) {},
  onUpdated: function(data, movement) {}
};
export const opContainer = "g-image-op"
export const opTagDel = "g-image-op-del"
export const imageOpTag = "g-image-op-name";
export const imageOpContent = "g-image-op-content";

export const PREFIX_RESIZE_DOT = "resize-dot";

export const dotCls = [
  `${PREFIX_RESIZE_DOT}-n`,
  `${PREFIX_RESIZE_DOT}-s`,
  `${PREFIX_RESIZE_DOT}-w`,
  `${PREFIX_RESIZE_DOT}-e`,
  `${PREFIX_RESIZE_DOT}-nw`,
  `${PREFIX_RESIZE_DOT}-ne`,
  `${PREFIX_RESIZE_DOT}-sw`,
  `${PREFIX_RESIZE_DOT}-se`,
  `${PREFIX_RESIZE_DOT}-tag-trash`
];

const UUID = (len, radix) => {
  let chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(
    ""
  );
  let uuid = [],
    i;
  radix = radix || chars.length;
  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)];
  } else {
    // rfc4122, version 4 form
    let r;
    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
    uuid[14] = "4";

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16);
        uuid[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r];
      }
    }
  }
  return uuid.join("");
};

const percentToSize = (percent, baseDistance = 0) => {
  return Math.round((parseFloat(percent).toFixed(3) * baseDistance) / 100);
};

const positionP2S = (
  position = { x: "0%", y: "0%", x1: "0%", y1: "0%" },
  baseWith = 100,
  baseHeight = 100
) => {
  for (let o in position) {
    if (o.startsWith("x")) {
      position[o] = percentToSize(position[o], baseWith);
    } else {
      position[o] = percentToSize(position[o], baseHeight);
    }
  }
  return position;
};

const transformDataArray = (data = [], baseWith = 0) => {
  for (let i = 0; i < data.length; i++) {
    let o = data[i];
    o.position = positionP2S(o.position, baseWith);
  }
  return data;
};

export { UUID, percentToSize, positionP2S, transformDataArray };
