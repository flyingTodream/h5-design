<template>
  <!-- 中间画布 -->
  <div class="main-container">
    <vx-editor-tip-bar />
    <div
      class="design-container"
      id="js-container"
      ref="container"
      @click.right.stop.exact="pointerRightDown($event)"
      @click.self.exact="selectCanvasHandler"
    >
      <div class="design-canvas" :style="canvasStyles">
        <div class="editor-shell" :style="canvasStyles">
          <vx-transform
            :active="active"
            :style="elementStyles"
            @move="moveHandler"
          ></vx-transform>

          <div class="editor-canvas" ref="canvas">
            <!-- 背景和遮罩 -->
            <div class="editor-layout">
              <vx-Editor-bg :zoom="global.zoom" @select="selectBgHandler" />
              <vx-water-mark />
            </div>
            <!-- 选择元素 -->

            <!-- <vx-editzoom
            :style="elementStyles"
            @click.native="selectWidgetHandler(currentIndex)"

            ></vx-editzoom> -->

            <!-- 模板元素-->
            <template v-for="(item, index) in layout.elements">
              <vx-shape
                @move="contextmenuShow = false"
                :key="index"
                :item="item"
                :index="index"
                @click.native="getCurrentItem(index)"
              ></vx-shape>
            </template>
          </div>
          <div
            class="editor-hover"
            :class="[`hover-${type}`, { 'hover-lock': lock }]"
          ></div>
          <!-- 删除该属性 :widget="transformStyle" 解决撤销时选中样式位置错误的bug。2019-10-11 09:22 -->
          <vx-editor-guider />
          <vx-image-cut />
          <vx-toolbar />
        </div>
      </div>
      <vx-selector />
      <vx-contextmenu
        :selectWidget="selectWidget"
        v-model="contextmenuShow"
        :top="contextmenuTop"
        :left="contextmenuleft"
      />
    </div>
  </div>
</template>
<script>
import { getter, mitation } from "src/design/store";
import { mixin } from "src/design/utils";

import VxEditorTipBar from "src/design/components/tipBar";
import VxEditorBg from "./background";
import VxWaterMark from "./watermark";
import VxEditorGuider from "./guider";
import VxImageCut from "./imageCut";
import VxToolbar from "./toolbar";
import vxSelector from "./selector";
import VxContextmenu from "./contentMenu";
import VxShape from "./shape";
import VxTransform from "./transform";
// import VxEditzoom from "./editzoom";
export default {
  name: "vx-canvas",
  mixins: [mixin],
  props: {
    success: {
      type: Boolean
    }
  },
  components: {
    VxShape,
    VxEditorTipBar,
    VxEditorBg,
    VxWaterMark, // 水印
    VxEditorGuider, // 辅助线
    VxImageCut, // 裁剪图片
    VxToolbar, // 工具条
    vxSelector, // 多选
    VxContextmenu, // 上下文菜单
    VxTransform
    // VxEditzoom
  },
  data() {
    return {
      transformStyle: {},
      timer: null,
      editor: -1,
      editorParent: -1,
      type: null,
      over: {},
      lock: false,
      contextmenuTop: 0,
      contextmenuleft: 0,
      container: { y: 99 },
      contextmenuShow: false,
      groupItemSelected: "", // 组元素选中
      bghover: false,
      choosedElement: "",
      currentElement: {},
      currentIndex: "",
      ifShow: false
    };
  },

  computed: {
    // transfrom

    active() {
      return this.selectWidget.id === this.currentIndex;
      // return this.currentIndex
    },
    // 组件初始行内style
    elementStyles() {
      return {
        // overflow: this.currentElement.hidden ? "hidden" : "visible",
        opacity: this.currentElement.opacity,
        width: this.currentElement.width * this.global.zoom + "px",
        height: this.currentElement.height * this.global.zoom + "px",
        top: this.currentElement.top * this.global.zoom + "px",
        left: this.currentElement.left * this.global.zoom + "px",
        "z-index": `${1000}`
      };
    },
    // end
    global() {
      return getter.global();
    },
    layout() {
      return getter.layout();
    },
    selectWidget() {
      return getter.current();
    },

    canvasStyles() {
      return {
        width: `${this.layout.width * this.global.zoom}px`,
        height: `${this.layout.height * this.global.zoom}px`
      };
    },
    cutable() {
      return getter.cutable();
    },
    mulSelected() {
      return getter.mulSelected();
    },
    selectedItem() {
      return getter.selectedItem();
    }
  },
  methods: {
    // transfrom
    againHidden() {
      this.currentElement = {};
      (this.elementStyles.height = ""),
        (this.elementStyles.width = ""),
        (this.elementStyles.opacity = ""),
        (this.elementStyles.left = ""),
        (this.elementStyles.top = "");
    },
    moveHandler() {
      this.$emit("move");
    },
    getCurrentItem(index) {
      this.currentIndex = index;
      let originIndex = JSON.parse(index);
      window.localStorage.setItem("originIndex", JSON.stringify(originIndex));
      let originImage = state.layout.elements[index].url;
      this.choosedElement = originImage;

      if (this.mulSelected) return;
      // this.editorParent = this.item.parent;
      this.contextmenuShow = false;
      // this.over = this.overlap(index);
      mitation.setCutable(false);
      mitation.setCurrent({
        id: this.currentIndex,
        index: this.currentIndex,
        type: "widget"
        // parent: this.item.parent,
        // over: this.over,
      });
      this.transformHandler(index);
      // new add
    },
    // end
    transformHandler(index) {
      this.over = this.overlap(index);
      let data = this.layout.elements[index];
      this.currentElement = data;
      let pos = {
        w: data.width,
        h: data.height,
        l: data.left,
        t: data.top
      };
      let transform = data.transform || {
        a: 1,
        b: 0,
        c: 0,
        d: 1,
        tx: 0,
        ty: 0
      };
      this.$set(this, "transformStyle", {
        transform: transform,
        width: pos.w,
        height: pos.h,
        top: pos.t,
        left: pos.l,
        draggable: data.dragable,
        rotatable: data.rotatable,
        type: data.type,
        display: "block",
        index: index,
        editor: false
      });
    },
    addHoverHandler() {
      this.bghover = true;
    },
    clearHoverHandler() {
      this.bghover = false;
      this.lock = false;
    },
    cleartransformHandler() {
      this.$set(this, "transformStyle", {});
      this.editor = -1;
      this.editorParent = -1;
      this.over = {};
      this.contextmenuShow = false;
      this.groupItemSelected = "";
      mitation.setCutable(false);
    },
    selectCanvasHandler() {
      this.cleartransformHandler();
      mitation.setCurrent({ id: -1, type: "canvas" });
      // mitation.setSelectedItem([]);
    },
    selectBgHandler() {
      this.cleartransformHandler();
      mitation.setCurrent({ id: -1, type: "background" });
    },
    // 获取上下文菜单位置
    pointerRightDown(e) {
      e.preventDefault();
      this.contextmenuShow = true;
      let top = e.pageY - this.container.y;
      let left = e.pageX - this.container.x;
      let _h = this.container.height - top;
      let _w = this.container.width - left;
      if (_h < 200) {
        top = -_h;
      }
      if (_w < 200) {
        left = -_w;
      }
      this.contextmenuTop = top;
      this.contextmenuleft = left;
    },

    getContainerSize() {
      let size = document
        .querySelector("#js-container")
        .getBoundingClientRect();
      this.container = size;
    }
  },
  mounted() {
    window.addEventListener("resize", () => {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        let el = this.$refs.container;
        if (!el) return;
        let h = el.clientHeight,
          w = el.clientWidth;
        if (h > 0 && w > 0) {
          this.updateZoom(h, w);
        }
        this.getContainerSize();
      }, 100);
    });
    setTimeout(() => {
      let el = this.$refs.container;
      if (!el) return;
      let h = el.clientHeight,
        w = el.clientWidth;
      if (h > 0 && w > 0) {
        this.updateZoom(h, w);
      }
      this.getContainerSize();
    }, 100);
  },
  watch: {
    success(val) {
      if (val) {
        setTimeout(() => {
          let el = this.$refs.container;
          if (!el) return;
          let h = el.clientHeight,
            w = el.clientWidth;
          if (h > 0 && w > 0) {
            this.updateZoom(h, w);
          }
          this.getContainerSize();
        }, 1);
      }
    },
    "selectWidget.id": function(val) {
      this.currentIndex = val;
      if (val >= 0) {
        this.transformHandler(val);
        this.contextmenuShow = false;
      } else {
        this.cleartransformHandler();
      }
    }
  }
};
</script>
<style scoped>
.bghover {
  border: 1px solid #06f;
}
</style>
