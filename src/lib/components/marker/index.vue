<template>
  <div class="vmr-ai-panel" :loading="loading" :class="rootClass">
    <div class="vmr-g-image" style="position: relative; overflow: hidden;">
      <img
        class="vmr-ai-raw-image"
        :src="currentBaseImage"
        @load="onImageLoad"
        style="display: block; position: absolute; user-select: none; "
      />
      <svg
        id="svg_main"
        class="annotate vmr-ai-raw-image-mask"
        style="width:100%;height:100%;user-select: none; position: absolute; cursor: crosshair; left: 0px; top: 0;"
        @click.stop="()=>{}"
      />
    </div>
  </div>
</template>
<script>
import PictureMarker from "./js/marker";
import "ui-picture-bd-marker/styles/bdmarker.scss";
const empImg = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==`;
export default {
  name: "vue-ai-marker",
  props: {
    readOnly: Boolean,
    imgUrl: String,
    uniqueKey: [String, Number],
    width: [String, Number],
    ratio: {
      default: 16 / 9,
      type: Number
    }
  },
  watch: {
    imgUrl: function(n, o) {
      this.currentBaseImage = n;
    },
    width: function(n, o) {
      this.__updateFrame();
    },
    readOnly: function(n, o) {
      this.options.options = {
        ...this.options.options,
        editable: !n
      };
      if (this.marker) {
        this.marker.updateConfig(this.options);
      }
    },
    ratio: function(n, o) {
      if (n) {
        this.wratioh = n;
        this.__updateFrame();
      }
    }
  },
  data() {
    return {
      emptyImg: empImg,
      options: void 0,
      currentBaseImage: void 0,
      rootClass: "",
      key: "",
      wratioh: this.ratio,
      loading: true
    };
  },
  beforeMount() {
    this.key = this.uniqueKey;
    this.rootClass = this.uniqueKey ? `pannel-${this.uniqueKey}` : void 0;
  },
  mounted() {
    this.__updateFrame();
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
      onAnnoContextMenu: function(annoData, element, annoContext) {
        // console.log("🦁onAnnoContextMenu🦁 data=", annoData);
        self.$emit("vmarker:onAnnoContextMenu", annoData, element, self.key);
      },
      onAnnoRemoved: function(annoData) {
        // console.log("🦁onAnnoRemoved🦁 data=", annoData);
        self.$emit("vmarker:onAnnoRemoved", annoData, self.key);
        return true;
      },
      onAnnoAdded: function(insertItem, element) {
        // console.log("🦁onAnnoAdded🦁 data=", insertItem);
        self.$emit("vmarker:onAnnoAdded", insertItem, self.key);
      },
      onAnnoChanged: function(newValue, oldValue) {
        // console.log("🦁onAnnoChanged🦁 ", newValue, oldValue);
        self.$emit("vmarker:onAnnoChanged", newValue, oldValue, self.key);
      },
      onAnnoDataFullLoaded: function() {
        // console.log("🦁onAnnoDataFullLoaded🦁 data=", self.key);
        self.$emit("vmarker:onAnnoDataFullLoaded", self.key);
      },
      onAnnoSelected: function(value, element) {
        // console.log("🦁onAnnoSelected🦁 data=", value);
        self.$emit("vmarker:onAnnoSelected", value, element, self.key);
      },
      onUpdated: function(data) {
        self.$emit("vmarker:onUpdated", data, this.key);
      }
    };
    if (/^.+$/.test(this.imgUrl)) {
      this.currentBaseImage = this.imgUrl;
    } else {
      this.currentBaseImage = this.emptyImg;
    }
    this.$nextTick(function() {
      self.__initMarker();
      self.$emit("vmarker:onReady", self.key);
    });
  },
  activated() {
    this.rootClass = `pannel-${this.key}`;
    this.$emit("vmarker:onReady", this.key);
  },
  methods: {
    getMarker() {
      return this.marker;
    },
    __updateFrame() {
      let root = this.$el;
      if (!root) {
        return;
      }
      root.addEventListener(
        "touchmove",
        function(e) {
          e.preventDefault();
        },
        { passive: false }
      );
      let width = this.width;
      if (!this.width) {
        width = "100%";
      }
      root.style.width = width.endsWith("%") ? width : parseInt(width) + "px";
      root.style.height = root.clientWidth / this.wratioh + "px";
      root
        .querySelectorAll(
          ".vmr-g-image,.vmr-ai-raw-image,.vmr-ai-raw-image-mask"
        )
        .forEach(element => {
          element.style.width = root.style.width;
          element.style.height =
            parseInt(root.clientWidth) / this.wratioh + "px";
        });
    },
    __initMarker() {
      let self = this;
      let root = this.$el;
      if (!root) {
        return;
      }
      self.marker = new PictureMarker(
        root.querySelector(`.annotate`), //box
        null, //draft
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
        this.$emit("vmarker:onImageLoad", rawData, this.key);
      }
      this.loading = false;
    },
    //marker
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
    clearData() {
      if (this.marker) {
        this.marker.clearData();
      }
    },
    setTag(tag) {
      if (this.marker) {
        this.marker.setTag(tag);
      }
    },
    renderer(imageUrl) {
      this.currentBaseImage = this.imgUrl = imageUrl;
    }
  }
};
</script>
<style lang="scss" >
$opImageWidth: 600px;
$gulp: 10px;
.vmr-ai-panel {
  background: #3e3e3e;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: auto; // $gulp * 2;
  .vmr-g-image,
  .vmr-ai-raw-image,
  .vmr-ai-raw-image-mask {
    // width: $opImageWidth;
    // height: round($opImageWidth * 9 / 16);
    width: 100%;
    height: 100%;
  }
  .g-image-op {
    border: 1px solid red;
    padding: 4px;
    font-size: 12px;
  }
}
</style>