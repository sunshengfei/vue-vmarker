<template>
  <div id="app">
    <AiPanel
      ref="aiPanel-editor"
      class="ai-observer"
      :ratio="ratio"
      v-bind:uniqueKey="1"
      @vmarker:onAnnoSelected="onAnnoSelected"
      @vmarker:onAnnoAdded="onAnnoAdded"
      @vmarker:onUpdated="onUpdated"
      @vmarker:onReady="onAiPanelReady"
      @vmarker:onImageLoad="onImageLoad"
      v-bind:readOnly="false"
      v-bind:imgUrl="currentImage"
    ></AiPanel>

    <div>"data:"{{tagList}}</div>
  </div>
</template>

<script>
import { AIMarker as AiPanel } from "./lib/index";//vue-picture-bd-marker
export default {
  name: "app",
  data() {
    return {
      ratio: 1,
      tagList: [],
      currentImage:
        "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1139702265,431383255&fm=26&gp=0.jpg",
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
    setTimeout(() => {
      this.currentImage =
        "https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1835849131,3531773843&fm=26&gp=0.jpg";
    }, 5000);
  },
  methods: {
    onAiPanelReady() {
      let mirror = this.$refs["aiPanel-editor"];
      // mirror.getMarker().updateConfig(
      //   );
      // setTimeout(() => {
      //   let data = [];
      //   for (let index = 0; index < 100; index++) {
      //     let rx = 1 * (Math.random() * 80).toFixed(2);
      //     let rx1 = rx + 1 * (Math.random() * 20).toFixed(2);
      //     let ry = 1 * (Math.random() * 80).toFixed(2);
      //     let ry1 = rx + 1 * (Math.random() * 20).toFixed(2);
      //     data.push({
      //       tag: "id" + index,
      //       tagName: "蜜蜂 " + index,
      //       position: {
      //         x: rx + "%",
      //         x1: rx1 + "%",
      //         y: ry + "%",
      //         y1: ry1 + "%"
      //       },
      //       uuid: "5559A20B25712D9" + index
      //     });
      //   }
      //   window.mirror = mirror;
      //   window.dd = data;
      //   mirror.renderData(data);
      // }, 5000);
    },
    onImageLoad(rawData, key) {
      console.log("onImageLoad", rawData, key);
    }, // 松手触发
    onUpdated(data, m) {
      console.log("🦁onUpdated🦁 data=", data);
      this.tagList = data;
    },
    // 单选触发
    onAnnoSelected(value, element, uKey) {
      // console.log("🤚selectOne data=", data);
    },
    // 单个标签方法
    onAnnoAdded(insertItem, uKey) {},
    _deleteAll() {
      let mirror = this.$refs["aiPanel-editor"];
      mirror.getMarker().clearData();
    },
    // 打标签
    _doTag(tagStr) {
      let mirror = this.$refs["aiPanel-editor"];
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
