<template>
    <div class="aipanel" v-loading="loading" :class="rootClass">
        <div class="g-image" style="position: relative; overflow: hidden;">
      <img class="ai-raw-image" :src="currentBaseImage" @load="onImageLoad"
        style="display: block; position: absolute; user-select: none; ">
      <div class="annotate ai-raw-image-mask" style="user-select: none; position: absolute; cursor: crosshair; left: 0px; top: 0;">
        <div class="draft" style="position: absolute;user-select: none;display: none;background-color: rgba(1,0,0,0.5);"></div>
      </div>
    </div>
    </div>
</template>
<script>
import MiaozhenMarker from "./js/marker";
import "ui-picture-bd-marker/styles/bdmarker.scss";
const empImg = require("../../../assets/white.png");
export default {
  name: "vue-aimarker",
  props: {
    readOnly: Boolean,
    imgUrl: String,
    uniqueKey: [String, Number],
    width: [String, Number]
  },
  watch: {
    imgUrl: function(n, o) {
      this.currentBaseImage = this.imgUrl;
    },
    width: function(n, o) {
      this.__updateFrame();
    }
  },
  data() {
    return {
      emptyImg: empImg,
      options: void 0,
      currentBaseImage: void 0,
      rootClass: "",
      key: "",
      loading: true
    };
  },
  beforeMount() {
    this.key = this.uniqueKey;
    this.rootClass = this.uniqueKey ? `pannel-${this.uniqueKey}` : void 0;
  },
  mounted() {
    this.__updateFrame()
  },
  created() {
    let self = this;
    this.options = {
      options: {
        blurOtherDots: true,
        blurOtherDotsShowTags: true,
        editable: this.readOnly ? false : true,
        trashPositionStart: 1
      },
      onDataRendered: self.onDataRendered,
      onUpdated: self.onUpdated,
      onDrawOne: self.onDrawOne,
      onSelect: self.onSelect
    };
    if (this.imgUrl) {
      this.currentBaseImage = this.imgUrl;
    } else {
      this.currentBaseImage = this.emptyImg;
    }
    this.$nextTick(function() {
      self.__initMarker();
      self.$emit("onReady", self.key);
    });
  },
  activated() {
    this.rootClass = `pannel-${this.key}`;
    this.$emit("onReady", this.key);
  },
  methods: {
    __updateFrame() {
      if (this.width) {
        const width = this.width;
        let root = document.querySelector(
          `.aipanel${this.rootClass ? "." + this.rootClass : ""}`
        );
        root.style.width = parseInt(width) + "px";
        root.style.height = parseInt(width) * 9 / 16 + 20 + "px";
        root
          .querySelectorAll(".g-image,.ai-raw-image,.ai-raw-image-mask")
          .forEach(function(element) {
            element.style.width = parseInt(width) + "px";
            element.style.height = parseInt(width) * 9 / 16 + "px";
          });
      }
    },
    __initMarker() {
      let self = this;
      self.marker = new MiaozhenMarker(
        document.querySelector(
          `.aipanel${this.rootClass ? "." + this.rootClass : ""} .annotate`
        ), //box
        document.querySelector(
          `.aipanel${this.rootClass ? "." + this.rootClass : ""} .draft `
        ), //draft
        self.options
      );
    },
    onImageLoad(e) {
      let rawData = {
        rawW: e.target.naturalWidth,
        rawH: e.target.naturalHeight,
        currentW: e.target.offsetWidth,
        currentH: e.target.offsetHeight
      };
      if (!this.currentBaseImage.startsWith("data")) {
        this.$emit("onImageLoad", rawData, this.key);
      }
      this.loading = false;
    },
    //marker
    onDataRendered() {
      this.$emit("onDataRendered",this.key);
    },
    onUpdated(data) {
      this.$emit("onUpdated", data, this.key);
    },
    onDrawOne(data, currentMovement) {
      this.$emit("onDrawOne", data, this.key);
    },
    onSelect(data) {
      this.$emit("onSelect", data, this.key);
    },
    dispatchEvent(event, data) {
      if (this.marker) {
        return this.marker[event](data);
      }
    },
    renderData(data, wh) {
      if (this.marker) {
        this.marker.renderData(data, wh);
      }
    },
    renderer(imageUrl) {
      this.currentBaseImage = this.imgUrl = imageUrl;
    }
  }
};
</script>
<style lang="scss" scoped>
$opImageWidth: 600px;
.aipanel {
  background: #3e3e3e;
  width: $opImageWidth;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: round($opImageWidth * 9 / 16) + 20;
  .g-image,
  .ai-raw-image,
  .ai-raw-image-mask {
    width: $opImageWidth;
    height: round($opImageWidth * 9 / 16);
  }
}
</style>

