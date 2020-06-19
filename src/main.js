import Vue from 'vue';
import App from './App'
import router from './router'
import store from './store'
import './assets/css/index.scss' //引入样式
import 'src/design/assets/stylus/index.styl'
//开发环境，引入在线图标
import 'src/design/lib/iconfont.js';
import 'src/utils/iconfont'
// permission control
import './permission'
import axios from './design/lib/axios';
import VxHtml2canvas from 'vue-html2canvas';
import {
  Row,
  Col,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Carousel,
  CarouselItem,
  Button,
  Input,
  Switch,
  Slider,
  Container,
  Header,
  Aside,
  Main,
  Menu,
  Submenu,
  MenuItem,
  Table,
  TableColumn,
  Option,
  Select,
  Dialog,
  Breadcrumb,
  BreadcrumbItem,
  InputNumber,
  MessageBox,
  Radio,
  Backtop,
  Icon,
  Progress,
  Image,
  Message,
  Pagination,
  Collapse,
  CollapseItem,
  Avatar
} from 'element-ui'
//h5编辑器使用的ANT UI
// import Antd from 'ant-design-vue'
// // import 'element-ui/lib/theme-chalk/index.css'
// import 'ant-design-vue/dist/antd.css'
// Vue.use(Antd)
// !#zh 请注意，务必使用 font-awesome@4.7.0 版本
import 'font-awesome/css/font-awesome.min.css'
import vClickOutside from 'v-click-outside'

Vue.use(vClickOutside)
Vue.use(CollapseItem);
Vue.use(Collapse);
Vue.use(Pagination);
Vue.use(Row);
Vue.use(Col);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Carousel);
Vue.use(CarouselItem);
Vue.use(Button);
Vue.use(Input);
Vue.use(Switch);
Vue.use(Slider);
Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(InputNumber);
Vue.use(Option);
Vue.use(Select);
Vue.use(Dialog);
Vue.use(Radio);
Vue.use(Backtop);
Vue.use(Icon);
Vue.use(Progress);
Vue.use(Image);
Vue.use(Avatar);
import VxIcon from 'src/design/components/icon';

import VxUpload from 'src/design/components/upload';
import {
  blobUpload
} from 'src/design/components/upload';
import VueClipboard from 'vue-clipboard2'
import VueLazyload from 'vue-lazyload'
//全局加载loadding组件
Vue.component('VxLoading', () => import('src/components/vxLoading'))
Vue.use(VueLazyload);
Vue.use(VueClipboard);
Vue.use(VxHtml2canvas);
Vue.component(VxIcon.name, VxIcon);
Vue.prototype.$message = Message;
Vue.prototype.$axios = axios;
Vue.prototype.$upload = VxUpload;
Vue.prototype.$blobUpload = blobUpload;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.config.productionTip = process.env.NODE_ENV != 'production';
Vue.config.devtools = process.env.NODE_ENV != 'production';
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {
    App
  }, mounted() {
    document.dispatchEvent(new Event('render-event'))
  }
})
