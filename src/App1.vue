<template>
  <div id="app">
    <svg id="svg_main" style="width:100%;height:100%;background:#eee" @click.stop="()=>{}" />
  </div>
</template>

<script>
import { toElement, attrtoSvg, attrstringify } from "./lib/svg";
const MOUSE_EVENT = [
  "mousedown",
  "mousemove",
  "mouseend",
  "mouseout",
  "mouseup",
  "mouseleave",
  "contextmenu"
];
const TOUCH_EVENT = [
  "touchstart",
  "touchmove",
  "touchend",
  "touchcancel",
  "touchup",
  "touchleave"
];
export default {
  name: "app",
  data() {
    return {
      currentShape: void 0,
      actionDown: false,
      anchorX: 0,
      anchorY: 0
    };
  },
  mounted() {
    let self = this;
    let svgDom = document.querySelector("#svg_main");
    MOUSE_EVENT.forEach((currentValue, index, arr) => {
      svgDom.addEventListener(
        currentValue,
        e => {
          self.mouseEventHandler(e);
        },
        true
      );
    });
  },
  methods: {
    boundRect() {
      let svgDom = document.querySelector("#svg_main");
      return svgDom.getBoundingClientRect();
    },
    mouseEventHandler(e) {
      let svgDom = document.querySelector("#svg_main");
      let boundRect = this.boundRect();
      let eventType = e.type;
      let x = e.clientX,
        y = e.clientY;
      this.moveX = x - boundRect.x;
      this.moveY = y - boundRect.y;
      if (eventType === MOUSE_EVENT[0] || eventType === TOUCH_EVENT[0]) {
        //build a base El
        this.anchorX = this.moveX;
        this.anchorY = this.moveY;
        const slotString = attrstringify({
          x: this.moveX,
          y: this.moveY,
          height: 0,
          width: 0,
          style: "stroke: #f1f1f1;background:rgba(0,0,0,0.2)"
        });
        this.currentShape = toElement(`<rect ${slotString}/>`);
        svgDom.appendChild(this.currentShape);
        this.actionDown = true;
      } else if (eventType === MOUSE_EVENT[1] || eventType === TOUCH_EVENT[1]) {
        console.log(eventType);
        if (this.actionDown) {
          // console.log("🐟 x,y ", x, y);
          this.dragTo(this.moveX, this.moveY);
        }
      } else if (
        eventType === MOUSE_EVENT[4] ||
        eventType === TOUCH_EVENT[2] ||
        eventType === TOUCH_EVENT[4]
      ) {
        if (actionDown) {
          this.drawAnnotation(this.draftRect);
          this.resetDraft();
        }
        this.actionDown = false;
      } else {
        // if (this.actionDown && this.filterOutOfBounds(this.moveX, this.moveY)) {
        //   // // console.log(`eventType=${eventType}`);
        //   // // console.log(this.draftRect);
        //   // if (this.resizeAnnotation) {
        //   //   this.resizeAnnotation.drawAnnotation(this.draftRect);
        //   //   this.resetDraft();
        //   // }
        //   this.actionDown = false;
        // }
      }
    },
    dragTo(x, y) {
      let widthRatio = (
        (100 * Math.abs(x - this.anchorX)) /
        this.boundRect().width
      ).toFixed(3);
      let heightRatio = (
        (100 * Math.abs(y - this.anchorY)) /
        this.boundRect().height
      ).toFixed(3);
      attrtoSvg(this.currentShape, {
        width: widthRatio + "%",
        height: heightRatio + "%"
      });
    }
  }
};
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>