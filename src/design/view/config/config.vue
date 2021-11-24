<template>
  <div class="design-config">
    <!-- 图层工具 -->
    <VxToolBar
      @opDelete="deleteHandler"
      @moveUp="moveUpHandler"
      @moveDown="moveDownHandler"
      @moveTop="moveTopHandler"
      @moveBottom="moveBottomHandler"
      :index="data.id"
      :over="data.over"
      v-if="isShowToolBar"
    ></VxToolBar>
    <!-- 画布尺寸调整 -->
    <vx-canvasSize
      v-if="data.type === 'canvas' && !isGroupable"
    ></vx-canvasSize>
    <!-- 拆分组 -->
    <VxGroup
      :index="data.index"
      :isGroup="type === 'group'"
      :elementIndex="data.index"
    />
    <!-- 字体样式 -->
    <vx-fontStyle
      :isGroup="type === 'group'"
      :index="data.id"
      :elementIndex="data.index"
      v-if="isFont"
    ></vx-fontStyle>
    <!-- 图片样式 -->
    <vx-imagePanel
      :isGroup="type === 'group'"
      :index="data.id"
      :elementIndex="data.index"
      v-if="isImg"
    ></vx-imagePanel>
    <!-- 背景样式 -->
    <vx-backgroundColor
      v-if="data.type === 'background' && !isGroupable"
    ></vx-backgroundColor>
    <!-- 图形样式 -->
    <VxSvgIcon
      :isGroup="type === 'group'"
      :index="data.id"
      :elementIndex="data.index"
      v-if="isSvg"
    />
  </div>
</template>
<script>
import { getter } from "src/design/store";
const VxBackgroundColor = () => import("./backgroundColor");
const VxCanvasSize = () => import("./canvasSize");
const VxFontStyle = () => import("./fontStyle");
const VxImagePanel = () => import("./imagePanel");
const VxToolBar = () => import("src/design/components/toolBar");
const VxSvgIcon = () => import("./svgIcon");
const VxGroup = () => import("./group");
export default {
  components: {
    VxCanvasSize,
    VxFontStyle,
    VxImagePanel,
    VxBackgroundColor,
    VxToolBar,
    VxSvgIcon,
    VxGroup,
  },
  props: {
    data: {
      type: Object,
    },
  },
  computed: {
    type() {
      if (this.data && this.data.type == "widget") {
        return getter.layout().elements[this.data.id].type;
      } else {
        return null;
      }
    },
    isGroupable() {
      return getter.isGroupable();
    },
    isSplitable() {
      return getter.isSplitable();
    },
    parent() {
      return this.data.parent;
    },
    isFont() {
      if (
        this.type === "group" &&
        this.data.parent != null &&
        this.data.parent != -1 &&
        this.data.index != -1
      ) {
        return (
          getter.layout().elements[this.data.parent].elements[this.data.index]
            .type === "text"
        );
      } else {
        return this.data.type === "widget" && this.type === "text";
      }
    },
    isImg() {
      if (
        this.type === "group" &&
        this.data.parent != -1 &&
        this.data.parent != null &&
        this.data.index != -1
      ) {
        return (
          getter.layout().elements[this.data.parent].elements[this.data.index]
            .type === "image" ||
          getter.layout().elements[this.data.parent].elements[this.data.index]
            .type === "mask"
        );
      } else {
        return this.type === "image" || this.type === "mask";
      }
    },
    isShowToolBar() {
      return (
        (this.data.type === "widget" && this.type === "text") ||
        this.type === "image" ||
        this.type === "mask" ||
        this.type === "group" ||
        this.isSvg
      );
    },
    isSvg() {
      if (
        this.type === "group" &&
        this.data.parent != -1 &&
        this.data.parent != null &&
        this.data.index != -1
      ) {
        return (
          getter.layout().elements[this.data.parent].elements[this.data.index]
            .type === "svg"
        );
      } else {
        return this.type === "svg";
      }
    },
  },
  methods: {
    deleteHandler() {
      this.$emit("opDelete");
    },
    moveUpHandler() {
      this.$emit("moveUp");
    },
    moveDownHandler() {
      this.$emit("moveDown");
    },
    moveTopHandler() {
      this.$emit("moveTop");
    },
    moveBottomHandler() {
      this.$emit("moveBottom");
    },
  },
};
</script>