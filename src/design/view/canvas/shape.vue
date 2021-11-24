<template>
  <div>
    <!-- <vx-transform
      :active="active"
      @group-select="groupSelectHandler"
      :selectedItem="selectedItem"
      @editor="editorHandler"
      @click.native="selectWidgetHandler(index)"
      :style="elementStyles"
      @move="moveHandler"
    /> -->
    <vx-editor-text
      :class="{ 'editor-element-selected': selectedItem.includes(index) }"
      v-model="item.content"
      :index="index"
      :zoom="global.zoom"
      :editor="editorParent === -1 && editor === index"
      v-if="item.type === 'text'"
      :data.sync="item"
      :key="item.id"
    />
    <vx-editor-three-text
      :class="{ 'editor-element-selected': selectedItem.includes(index) }"
      v-model="item.content"
      :index="index"
      :zoom="global.zoom"
      :editor="editorParent === -1 && editor === index"
      v-if="item.type === 'threeText'"
      :data.sync="item"
      :key="item.id"
    />
    <vx-editor-image
      :class="{ 'editor-element-selected': selectedItem.includes(index) }"
      :zoom="global.zoom"
      :index="index"
      :cutable="cutable && selectWidget.id === index"
      v-if="['image', 'mask'].includes(item.type)"
      :data.sync="item"
      :key="item.id"
      
    />
    <vx-editor-svg
      :class="{ 'editor-element-selected': selectedItem.includes(index) }"
      :zoom="global.zoom"
      :index="index"
      v-if="['svg'].includes(item.type)"
      :data.sync="item"
      :key="item.id"
    />
    <vx-editor-group
      :class="{ 'editor-element-selected': selectedItem.includes(index) }"
      :zoom="global.zoom"
      :index="index"
      :editor="`${editorParent}-${editor}`"
      :selected="transformStyle"
      :cutable="cutable"
      v-if="item.type === 'group'"
      :data.sync="item"
      :key="item.id"
    />
  </div>
</template>
<script>
import VxEditorText from "./text";
import VxEditorThreeText from "./threeText";
import VxEditorImage from "./image";
import VxEditorGroup from "./group";
import VxEditorSvg from "./svg";
// import VxTransform from "./transform";
import { getter, mitation } from "src/design/store";
import { mixin, log } from "src/design/utils";
export default {
  name: "vx-shape",
  mixins: [mixin],
  props: {
    item: {
      type: Object,
    },
    index: {
      type: Number,
    },
  },
  components: {
    VxEditorText, // 文本
    VxEditorThreeText, // 3D文字
    VxEditorImage, // 图片
    // VxEditorMask, // mask
    VxEditorGroup, // 组
    VxEditorSvg, // svg
    // VxTransform, // 拖拽、缩放、旋转
  },
  computed: {
    selectedItem() {
      return getter.selectedItem();
    },
    active() {
      return this.selectWidget.id === this.index;
    },
    // 组件初始行内style
    elementStyles() {
      let data = this.item;
      return {
        overflow: data.hidden ? "hidden" : "visible",
        width: data.width * this.global.zoom + "px",
        height: data.height * this.global.zoom + "px",
        top: data.top * this.global.zoom + "px",
        left: data.left * this.global.zoom + "px",
        opacity: data.opacity,
        "z-index": `${1000}`,
      };
    },
    selectWidget() {
      return getter.current();
    },
    global() {
      return getter.global();
    },
    cutable() {
      return getter.cutable();
    },
    layout() {
      return getter.layout();
    },
    mulSelected() {
      return getter.mulSelected();
    },
  },
  data() {
    return {
      editor: -1,
      editorParent: -1,
      over: {},
      transformStyle: {},
      hoverStyle: {},
      choosedElement: ''
    };
  },
  methods: {
    moveHandler() {
      this.$emit("move");
    },
    groupSelectHandler() {
      // this.groupItemSelected = `${this.selectWidget.id}-${this.selectWidget.index}`;
    },
    editorHandler(type, index, parent = -1) {
      
      if (type === "edit") {
        this.editor = index;
        this.editorParent = parent;
      } else {
        // 图片上传
        this.$upload()
          .then((data) => {
            mitation.updateImg(parent, index, data.data.url);
          })
          .catch((err) => {
            log.danger(err);
          });
      }
    },
    // 点击选中模板中的元素时
    selectWidgetHandler(index) {
      // 存储页面元素索引
      let originIndex = JSON.parse(index);
      window.localStorage.setItem(
        "originIndex",
        JSON.stringify(originIndex)
      );
      let originImage = state.layout.elements[index].url
      this.choosedElement = originImage

      if (this.mulSelected) return;
      this.editorParent = this.item.parent;
      this.contextmenuShow = false;
      this.over = this.overlap(index);
      mitation.setCutable(false);
      mitation.setCurrent({
        id: index,
        index: index,
        type: "widget",
        parent: this.item.parent,
        over: this.over,
      });
      this.transformHandler(index);
      
    },
    hoverHandler(index) {
      
      let data = this.layout.elements[index];
      //   this.type = data.type
      let transform = data.transform || { a: 0, b: 0, c: 0, tx: 0, ty: 0 };
      this.$set(this, "hoverStyle", {
        transform: `matrix(${transform.a},${transform.b},${transform.c},${transform.d},${transform.tx},${transform.ty})`,
        width: data.width * getter.zoom() + "px",
        height: data.height * getter.zoom() + "px",
        top: data.top * getter.zoom() + "px",
        left: data.left * getter.zoom() + "px",
        display: "block",
      });
      // }

      this.lock = data.lock;
    },
    transformHandler(index) {
      
      this.over = this.overlap(index);
      let data = this.layout.elements[index];
      let pos = {
        w: data.width,
        h: data.height,
        l: data.left,
        t: data.top,
      };
      let transform = data.transform || {
        a: 1,
        b: 0,
        c: 0,
        d: 1,
        tx: 0,
        ty: 0,
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
        editor: false,
      });
    },
  },
};
</script>