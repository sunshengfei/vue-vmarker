<template>
  <div id="app">
    <AiPanel
      ref="aiPanel-editor"
      class="ai-observer"
      :ratio="ratio"
      v-bind:uniqueKey="1"
      @vmarker:onSelect="selectOne"
      @vmarker:onUpdated="onUpdated"
      @vmarker:onDrawOne="_drawOne"
      @vmarker:onReady="onAiPanelReady"
      @vmarker:onImageLoad="onImageLoad"
      v-bind:readOnly="false"
      v-bind:imgUrl="currentImage()"
    ></AiPanel>

    <div>"data:"{{tagList}}</div>
  </div>
</template>

<script>
import { AIMarker as AiPanel } from "./lib/index.js";
export default {
  name: "app",
  data() {
    return {
      ratio: 1,
      tagList: [],
      photoWH: {
        sourceWH: {
          souW: 0,
          souH: 0
        },
        newWH: {
          newW: 0,
          newH: 0
        }
      }
    };
  },
  components: { AiPanel },
  mounted() {
    window.thiz = this;
  },
  methods: {
    currentImage() {
      return "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1139702265,431383255&fm=26&gp=0.jpg";
    },
    onAiPanelReady() {},
    onImageLoad() {}, // 松手触发
    onUpdated(data, m) {
      // console.log("🦁onUpdated🦁 data=", data);
      this.tagList = data;
    },
    // 单选触发
    selectOne(data, uKey) {
      // console.log("🤚selectOne data=", data);
    },
    // 单个标签方法
    _drawOne(data) {},
    _deleteAll() {
      let mirror = this.$refs["aiPanel-editor"];
      // mirror.dispatchEvent("setTag", tagStr);
      mirror.getMarker().clearData();
    },
    // 打标签
    _doTag(tagStr) {
      let mirror = this.$refs["aiPanel-editor"];
      // mirror.dispatchEvent("setTag", tagStr);
      mirror.getMarker().setTag({
        tagName: "小蜜蜂",
        tag: "0x0001"
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
