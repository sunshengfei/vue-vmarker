<template>
  <div id="app">
    <AiPanel
      ref="aiPanel-editor"
      class="ai-observer"
      v-bind:ratio="ratio"
      v-bind:uniqueKey="'unique_uuid_or_sth'"
      @vmarker:onAnnoContextMenu="onAnnoContextMenu"
      @vmarker:onAnnoSelected="onAnnoSelected"
      @vmarker:onAnnoRemoved="onAnnoRemoved"
      @vmarker:onAnnoAdded="onAnnoAdded"
      @vmarker:onUpdated="onUpdated"
      @vmarker:onReady="onAiPanelReady"
      @vmarker:onImageLoad="onImageLoad"
      @vmarker:onSize="onSize"
      v-bind:readOnly="readOnly"
      v-bind:imgUrl="currentImage"
      v-bind:config="{ closable: true }"
    ></AiPanel>
    <button @click="readOnly = !readOnly">只读/可编辑</button>
    <div>"data:"{{ tagList }}</div>
  </div>
</template>

<script>
import { AIMarker as AiPanel } from "@/lib/index"; //vue-picture-bd-marker
// import { AIMarker as AiPanel } from "vue-picture-bd-marker"; //vue-picture-bd-marker
// import "vue-picture-bd-marker/dist/vue-picture-bd-marker.css";
export default {
  name: "VMarkerApp",
  components: { AiPanel },
  data() {
    return {
      ratio: 0,
      readOnly: false,
      tagList: [],
      currentImage:
        "http://img-arch.pconline.com.cn/images/upload/upc/tx/photoblog/1705/12/c11/46768852_1494588861915.jpg",
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
  mounted() {
    window.thiz = this;
    // setTimeout(() => {
    //   this.currentImage =
    //     "https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1835849131,3531773843&fm=26&gp=0.jpg";
    // }, 5000);
  },
  methods: {
    onAnnoContextMenu() {
      console.log("onAnnoContextMenu 右键菜单");
    },
    onAiPanelReady() {
      let mirror = this.$refs["aiPanel-editor"];
      window.marker = mirror;
      // console.log("看这里", !!mirror.getMarker().selectMarkerByTagId);
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
    onSize({ width, height }) {
      console.log(...arguments);
    },
    onImageLoad(rawData, key) {
      console.log("onImageLoad", rawData, key);
    }, // 松手触发
    onUpdated(data, m) {
      console.log("🦁onUpdated🦁 data=", JSON.stringify(data), m);
      this.tagList = [...data];
    },
    // 单选触发
    onAnnoSelected(value, element, uKey) {
      console.log("🤚selectOne data=", JSON.stringify(value));
    },
    onAnnoRemoved(value, uKey) {
      console.log("onAnnoRemoved data=", value, uKey);
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
