<template>
  <div
    class="editor-element editor-element-text"
    :class="{
      'editor-element-editing': editor,
    }"
    @mousedown.left="transfromHandler"
    :style="elementStyles"
  >
    <div class="element-inner" :style="innerStyle">
      <div class="element-inner-content" :style="contentStyle">
        <div
          class="element-main"
          ref="edit"
          @mousemove.stop
          :contenteditable="editor"
          @input="changeHandler"
          @blur="leaveInput"
          :style="mainStyles"
          id="content"
          v-html="data.content"
          
        >
          <!-- <pre
            id="content"
            v-show="!editor"
            :style="textStyles"
            v-html="data.content"
          ></pre> -->
        </div>
      </div>
    </div>
    <!-- <i class="border-before"></i> -->
  </div>
</template>
<script>
import { mitation } from "src/design/store";
export default {
  name: "vx-editor-text",
  props: {
    data: {},
    value: String,
    zoom: {
      type: Number,
      default: 0,
    },
    index: Number,
    editor: Boolean,
    parent: {
      type: Number,
      default: -1,
    },
  },
  computed: {
    layoutZoom() {
      return getter.zoom();
    },
    elementStyles() {
      let transform = this.data.transform || { a: 0, b: 0, c: 0, tx: 0, ty: 0 };
      return {
        overflow: this.data.hidden ? "visible" : "visible",
        transform: `matrix(${transform.a},${transform.b},${transform.c},${transform.d},${transform.tx},${transform.ty})`,
        width: this.data.width * this.zoom + "px",
        height: this.data.height * this.zoom + "px",
        fontSize: this.data.fontSize * this.zoom + "px",
        top: this.data.top * this.zoom + "px",
        left: this.data.left * this.zoom + "px",
        opacity: this.data.opacity,

      };
    },
    innerStyle() {
      return {
        textAlign: this.data.textAlign,
        lineHeight: this.data.lineHeight,
        width: this.data.width + "px",
        height: this.data.height + "px",
        transform: `scale(${this.zoom})`,
      };
    },
    contentStyle() {
      return {
        writingMode: this.data.writingMode,
        height: this.data.height + "px",
      };
    },
    mainStyles() {
      let style = {
        color: this.data.color,
        fontFamily: this.data.fontFamily,
        fontSize: this.data.fontSize + "px",
        lineHeight: this.data.lineHeight,
        letterSpacing: this.data.letterSpacing + "px",
        verticalAlign: this.data.verticalAlign,
        maxWidth: "100%",
        height: "auto",
        fontStyle: this.data.fontStyle,
        fontWeight: this.data.fontWeight,
        textDecoration: this.data.textDecoration,
        display: "inline-block",
				wordWrap: "break-word",
				wordBreak: "break-all",
      };

      if (this.data.textEffects && this.data.textEffects.length > 0) {
        let effects = this.data.textEffects;
        let shadow = null,
          stroke = null,
          filling = null,
          bgImage = null,
          bgSize = null,
          bgRepeat = null,
          bgClip = null,
          bgOrigin = null;
        effects.forEach((item) => {
          item = effects[0];
          if (item.filling.enable) {
            if (item.filling.type === 0) {
              // let strcolor = item.filling.color
              // strcolor = strcolor.substring(0,7)
              // console.log(strcolor)
              // filling = `${strcolor}`

              stroke = `${item.stroke.width}px ${item.stroke.color.substring(
                0,
                7
              )}`;
            }
            if (item.filling.type === 1) {
              let imgInfo = item.filling.imageContent;
              filling = "transparent";
              bgImage = `url(${imgInfo.image})`;
              bgSize = `${imgInfo.width * imgInfo.scaleX}px ${
                imgInfo.height * imgInfo.scaleY
              }px`;
              bgRepeat = imgInfo.repeat === 1 ? "repeat" : null;
              bgClip = "text";
              bgOrigin = "border-box";
            }
            if (item.filling.type === 2) {
              let gradient = item.filling.gradient;
              let imgInfo = item.filling.imageContent;
              filling = "transparent";
              let list = [`${gradient.angle + 90}deg`];
              gradient.stops.forEach((item) => {
                list.push(`${item.color} ${item.offset * 100}%`);
              });
              bgImage = `linear-gradient(${list.join(",")})`;

              bgRepeat = imgInfo.repeat === 1 ? "repeat" : null;
              bgClip = "text";
            }
          } else {
            filling = null;
            bgImage = null;
            bgSize = null;
            bgRepeat = null;
            bgClip = null;
            bgOrigin = null;
            stroke = null;
          }
          if (item.shadow.enable) {
            // shadow.push(`${item.shadow.color} ${item.shadow.offsetX}px ${item.shadow.offsetY}px ${item.shadow.blur}px`);
            shadow = `${item.shadow.color} ${item.shadow.offsetX}px ${item.shadow.offsetY}px ${item.shadow.blur}px`;
          } else {
            shadow = null;
          }

          // if (item.stroke) {
          //   stroke = `${item.stroke.width}px ${item.stroke.color.substring(0,7)}`
          // } else {
          //   stroke = null
          // }
        });
        if (shadow) style["textShadow"] = shadow;
        if (stroke) style["-webkit-text-stroke"] = stroke;
        if (filling) style["-webkit-text-fill-color"] = filling;
        if (bgSize) style["backgroundSize"] = bgSize;
        if (bgImage) style["backgroundImage"] = bgImage;
        if (bgRepeat) style["backgroundRepeat"] = bgRepeat;
        if (bgClip) style["-webkit-background-clip"] = bgClip;
        if (bgOrigin) style["backgroundOrigin"] = bgOrigin;
      }
      return style;
    },

    textStyles() {
      let filling = null;

      if (filling) style["-webkit-text-fill-color"] = filling;

      return {
        color: this.data.color,
        fontFamily: this.data.fontFamily,
        fontSize: this.data.fontSize + "px",
        minHeight: this.data.height + "px",
        height: this.data.height + "px",
        fontStyle: this.data.fontStyle,   
        fontWeight: this.data.fontWeight,
        textDecoration: this.data.textDecoration,
        filling: this.data.color,
      };
    },
  },
  methods: {
    leaveInput() {
      console.log(this.elementStyles.top)
      this.elementStyles.top = this.data.top * this.zoom + "px"
      // this.data.top = this.data.top * this.zoom + "px",
    },
    changeHandler() {
      let el = this.$refs.edit;
      mitation.updateCurrentEdit(true);
      // 更新盒子大小
      mitation.changeSize(this.index, el.offsetWidth, el.offsetHeight);
    },
    hoverHandler() {
      this.$emit("event", {
        index: this.index,
        type: "hover",
        parent: this.parent,
      });
    },
    transfromHandler() {
      this.$emit("event", {
        index: this.index,
        type: "transfrom",
        parent: this.parent,
        edit: this.editor,
      });
      mitation.updateCurrentEdit(this.editor);
    },
  },

  watch: {
    editor(val) {
      if (!val) {
        let el = this.$refs.edit;
        this.data.content = el.innerText;
        this.$emit("input", el.innerText);
      } else {
        mitation.updateCurrentEdit(true);
        let el = this.$refs.edit;

        this.$nextTick(() => {
          if (window.getSelection) {
            el.focus();
            let range = window.getSelection();
            range.selectAllChildren(el);
            range.collapseToEnd();
            // window.getSelection().addRange(range)
          } else if (document.selection) {
            let range = document.selection.createRange();
            range.moveToElementText(el);
            range.collapse(false);
            range.select();
          }
        });

        el.innerText = this.data.content;
      }
    },
  },
};
</script>
<style scoped>
#content {
  word-break: break-word;
  white-space: pre-wrap;
}
</style>