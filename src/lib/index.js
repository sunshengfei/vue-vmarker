import AIMarker from './components/marker/index.js'
import PictureMarker from "./components/marker/js/marker";

const components = [
  AIMarker
];

const install = (Vue, opts = {}) => {
  components.forEach(component => {
    Vue.component(component.name, component);
  });
}

/* 支持使用标签的方式引入 */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export {
  install,
  AIMarker,
  PictureMarker
}