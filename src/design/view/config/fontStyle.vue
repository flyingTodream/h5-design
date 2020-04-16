<template>
  <div class="design-config">
    <!-- <VxToolBar :index="index"></VxToolBar> -->
    <div :class="{'image-disable': locked}">
      <div class="font-panel">
        <div v-show="!isGroup" @click="getFontStyle" class="font-dropdown-effect-preview">
          <span :style="fontStyles">样式</span>
          <span class="font-panel-icon"></span>
        </div>
        <div v-show="popupShow&&!isGroup" class="font-popup">
          <ul>
            <li :class="{'font-popup-selected':sel==null}" @click="changeStyleHandler(null,null)">
              无样式
              <!-- <img :src="item.preview.url" /> -->
            </li>
            <li
              v-for="(item,index) in effectList"
              :key="index"
              :class="{'font-popup-selected':sel==index}"
              @click="changeStyleHandler(item.id,index)"
              :style="{'background-image':`url(${item.typefacePath})`}"
            >
              <!-- <img :src="item.preview.url" /> -->
            </li>
          </ul>
        </div>
        <div class="font-panel-image">
          <div class="font-panel-label">
            <div>颜色</div>
            <vx-icon name="fill-color"></vx-icon>
          </div>

          <VxColorPicker v-model="fontColor" class="font-color-picker"></VxColorPicker>
        </div>
      </div>
      <div class="font-text">
        <div class="font-text-lable">文字</div>
        <div @click="showFontFamilyHandler" class="font-text-family">
          <div class="font-text-family-lable">{{fontFamily}}</div>
          <div class="font-text-family-icon"></div>
        </div>
        <div v-show="fontFamilyShow" class="font-family-lists">
          <div class="font-family-tabs">
            <div class="font-family-tab">
              <div @click.stop="selFontFamily = 'cn'" :class="{'active':selFontFamily == 'cn'}">中文</div>
              <div @click.stop="selFontFamily = 'en'" :class="{'active':selFontFamily == 'en'}">英文</div>
            </div>
          </div>
          <div class="font-family-label">
            <span>当前模板字体</span>
          </div>
          <ul>
            <li
              v-for="(item,index) in fontFamilyList"
              :key="index"
              @click="fontFamilyHandler(item.id)"
              class="font-family-item"
              :style="{'background-image':`url(${item.typefacePath})`}"
            ></li>
            <!--  typefacePath-->
          </ul>
        </div>
        <div class="font-text-family">
          <vx-icon
            title="加粗"
            @click.native="isBold = !isBold"
            :class="{'active':isBold}"
            name="blod"
          ></vx-icon>
          <vx-icon
            title="斜体"
            @click.native="isItalic = !isItalic"
            :class="{'active':isItalic}"
            name="italic"
          ></vx-icon>
          <vx-icon
            @click.native="isUnderline = !isUnderline"
            title="下划线"
            :class="{'active':isUnderline}"
            name="underline"
          ></vx-icon>
          <vx-icon
            @click.native="isDeleteline = !isDeleteline"
            title="删除线"
            :class="{'active':isDeleteline}"
            name="deleteline"
          ></vx-icon>
        </div>

        <div class="font-text-family">
          <vx-icon class="font-text-alignicon" :name="textAlignValue"></vx-icon>
          <div class="font-text-align">
            <ul>
              <li @click="textAlignHandler(item)" v-for="(item,index) in textAlign" :key="index">
                <vx-icon :name="item.icon"></vx-icon>
                {{
                item.lable
                }}
              </li>
            </ul>
          </div>
          <vx-icon title="文字方向" @click.native="textDirectionHandler" name="text-direction"></vx-icon>
          <vx-icon class="font-wordSpace" name="word-space"></vx-icon>
          <div class="font-word-space">
            <div class="lable">字间距</div>
            <div class="slider">
              <el-slider :min="-50" :max="120" v-model="wordSpace"></el-slider>
            </div>
            <div class="value">{{wordSpace}}</div>
          </div>
          <vx-icon class="font-lineSpace" name="line-space"></vx-icon>
          <div class="font-word-space">
            <div class="lable">行间距</div>
            <div class="slider">
              <el-slider v-model="lineSpace" :min="1" :max="50"></el-slider>
            </div>
            <div class="value">{{lineSpace}}</div>
          </div>
        </div>
        <vx-select @edit="editAbleHandler" :minValue="12" :maxValue="500" v-model="fontSize">
          <template v-slot:label>
            <p>{{fontSize}}px</p>
          </template>
          <vx-option
            v-for="item in fontsizeList"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </vx-select>
        <div class="font-text-range">
          <div class="font-range-input">
            <div class="font-range-lable">不透明</div>
            <div class="font-range">
              <el-slider :min="0" :max="10" v-model="fontRange"></el-slider>
            </div>
            <div class="font-range-value">{{fontRange}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { state, mitation } from 'src/design/store'
import { API } from 'src/design/utils'
import { VxSelect, VxOption } from 'src/design/components/select'
import VxColorPicker from 'src/design/components/colorPicker'
export default {
  name: 'vx-fontStyle',
  components: {
    VxColorPicker,
    VxSelect,
    VxOption
  },
  props: {
    index: {
      type: Number
    },
    elementIndex: {
      type: Number
    },
    isGroup: {
      type: Boolean
    }
  },
  data() {
    return {
      sizeShow: false,
      popupShow: false, //样式层是否显示
      fontStyles: {},
      sel: 0, //当前选中的样式
      effectTab: 0, //当前选中的字体样式
      fontStyle: '无样式', //默认无样式
      selFontFamily: 'cn', //字体语言类型
      fontFamilyShow: false, //字体列表是否显示
      textAlignValue: 'text-left', //居中方式
      effectList: [], //样式列表
      effectTabs: [{ name: '平面样式' }, { name: '3D样式' }],
      textAlign: [
        {
          icon: 'text-left',
          lable: '左对齐',
          value: 'left'
        },
        {
          icon: 'text-center',
          lable: '居中',
          value: 'center'
        },
        {
          icon: 'text-right',
          lable: '右对齐',
          value: 'right'
        }
      ],
      fontsizeList: [
        {
          value: 12,
          label: '12px'
        },
        {
          value: 14,
          label: '14px'
        },
        {
          value: 16,
          label: '16px'
        },
        {
          value: 18,
          label: '18px'
        },
        {
          value: 22,
          label: '22px'
        },
        {
          value: 24,
          label: '24px'
        },
        {
          value: 32,
          label: '32px'
        },
        {
          value: 42,
          label: '42px'
        },
        {
          value: 48,
          label: '48px'
        },
        {
          value: 64,
          label: '64px'
        },
        {
          value: 72,
          label: '72px'
        },
        {
          value: 88,
          label: '88px'
        },
        {
          value: 128,
          label: '128px'
        }
      ],
      fontFamilyList: []
    }
  },
  computed: {
    fontFamily: {
      get() {
        if (this.isGroup) {
          let value = this.fontFamilyList.find(
            element =>
              element.name ==
              state.layout.elements[this.index].elements[this.elementIndex]
                .fontFamily
          )
          if (value) {
            return value.name
          } else {
            return state.layout.elements[this.index].elements[this.elementIndex]
              .fontFamily
          }
        } else {
          let value = this.fontFamilyList.find(
            element =>
              element.name == state.layout.elements[this.index].fontFamily
          )
          if (value) {
            return value.name
          } else {
            return state.layout.elements[this.index].fontFamily
          }
        }
      },
      set(newValue) {
        if (this.isGroup) {
          state.layout.elements[this.index].elements[
            this.elementIndex
          ].fontFamily = newValue
          state.layout.elements[this.index].elements[
            this.elementIndex
          ].lineHeight = 1
        } else {
          state.layout.elements[this.index].fontFamily = newValue
          state.layout.elements[this.index].lineHeight = 1
        }
      }
    },
    locked() {
      return state.layout.elements[this.index].lock
    },
    fontSize: {
      get() {
        if (this.isGroup) {
          return Math.round(
            state.layout.elements[this.index].elements[this.elementIndex]
              .fontSize
          )
        } else {
          return Math.round(state.layout.elements[this.index].fontSize)
        }
      },
      set(newValue) {
        if (this.isGroup) {
          state.layout.elements[this.index].elements[
            this.elementIndex
          ].fontSize = newValue
        } else {
          state.layout.elements[this.index].fontSize = newValue
        }
      }
    },
    fontColor: {
      get() {
        if (this.isGroup) {
          return state.layout.elements[this.index].elements[this.elementIndex]
            .color
        } else {
          return state.layout.elements[this.index].color
        }
      },
      set(newValue) {
        if (this.isGroup) {
          state.layout.elements[this.index].elements[
            this.elementIndex
          ].color = newValue
        } else {
          state.layout.elements[this.index].color = newValue
        }
      }
    },
    isBold: {
      get() {
        if (this.isGroup) {
          return (
            state.layout.elements[this.index].elements[this.elementIndex]
              .fontWeight !== 400
          )
        } else {
          return state.layout.elements[this.index].fontWeight !== 400
        }
      },
      set(newValue) {
        if (this.isGroup) {
          if (newValue) {
            state.layout.elements[this.index].elements[
              this.elementIndex
            ].fontWeight = 800
          } else {
            state.layout.elements[this.index].elements[
              this.elementIndex
            ].fontWeight = 400
          }
        } else {
          if (newValue) {
            state.layout.elements[this.index].fontWeight = 800
          } else {
            state.layout.elements[this.index].fontWeight = 400
          }
        }
      }
    },
    isUnderline: {
      get() {
        if (this.isGroup) {
          return (
            state.layout.elements[this.index].elements[this.elementIndex]
              .textDecoration === 'underline'
          )
        } else {
          return (
            state.layout.elements[this.index].textDecoration === 'underline'
          )
        }
      },
      set(newValue) {
        if (this.isGroup) {
          if (newValue) {
            state.layout.elements[this.index].elements[
              this.elementIndex
            ].textDecoration = 'underline'
          } else {
            state.layout.elements[this.index].elements[
              this.elementIndex
            ].textDecoration = 'none'
          }
        } else {
          if (newValue) {
            state.layout.elements[this.index].textDecoration = 'underline'
          } else {
            state.layout.elements[this.index].textDecoration = 'none'
          }
        }
      }
    }, //fontStyle
    isItalic: {
      get() {
        if (this.isGroup) {
          return (
            state.layout.elements[this.index].elements[this.elementIndex]
              .fontStyle == 'italic'
          )
        } else {
          return state.layout.elements[this.index].fontStyle == 'italic'
        }
      },
      set(newValue) {
        if (this.isGroup) {
          if (newValue) {
            state.layout.elements[this.index].elements[
              this.elementIndex
            ].fontStyle = 'italic'
          } else {
            state.layout.elements[this.index].elements[
              this.elementIndex
            ].fontStyle = 'normal'
          }
        } else {
          if (newValue) {
            state.layout.elements[this.index].fontStyle = 'italic'
          } else {
            state.layout.elements[this.index].fontStyle = 'normal'
          }
        }
      }
    },
    isDeleteline: {
      get() {
        if (this.isGroup) {
          return (
            state.layout.elements[this.index].elements[this.elementIndex]
              .textDecoration === 'line-through'
          )
        } else {
          return (
            state.layout.elements[this.index].textDecoration === 'line-through'
          )
        }
      },
      set(newValue) {
        if (this.isGroup) {
          if (newValue) {
            state.layout.elements[this.index].elements[
              this.elementIndex
            ].textDecoration = 'line-through'
          } else {
            state.layout.elements[this.index].elements[
              this.elementIndex
            ].textDecoration = 'none'
          }
        } else {
          if (newValue) {
            state.layout.elements[this.index].textDecoration = 'line-through'
          } else {
            state.layout.elements[this.index].textDecoration = 'none'
          }
        }
      }
    },
    fontRange: {
      get() {
        if (this.isGroup) {
          return Math.round(
            state.layout.elements[this.index].elements[this.elementIndex]
              .opacity * 10
          )
        } else {
          return Math.round(state.layout.elements[this.index].opacity * 10)
        }
      },
      set(newValue) {
        if (this.isGroup) {
          state.layout.elements[this.index].elements[
            this.elementIndex
          ].opacity = newValue / 10
        } else {
          state.layout.elements[this.index].opacity = newValue / 10
        }
      }
    },
    lineSpace: {
      get() {
        if (this.isGroup) {
          return Math.round(
            state.layout.elements[this.index].elements[this.elementIndex]
              .lineHeight * 10
          )
        } else {
          return Math.round(state.layout.elements[this.index].lineHeight * 10)
        }
      },
      set(newValue) {
        if (this.isGroup) {
          state.layout.elements[this.index].elements[
            this.elementIndex
          ].lineHeight = newValue / 10
        } else {
          state.layout.elements[this.index].lineHeight = newValue / 10
        }
      }
    },
    wordSpace: {
      get() {
        if (this.isGroup) {
          return Math.round(
            state.layout.elements[this.index].elements[this.elementIndex]
              .letterSpacing
          )
        } else {
          return Math.round(state.layout.elements[this.index].letterSpacing)
        }
      },
      set(newValue) {
        if (this.isGroup) {
          state.layout.elements[this.index].elements[
            this.elementIndex
          ].letterSpacing = newValue
        } else {
          state.layout.elements[this.index].letterSpacing = newValue
        }
      }
    }
  },
  created() {
    this.getFontFamily()
  },
  methods: {
    editAbleHandler() {
      mitation.updateCurrentEdit(true)
    },
    getFontStyle() {
      if (!this.popupShow) {
        let params = {
          page: 1,
          limit: 100,
          type: 'font_effect'
        }
        this.$axios.get(API.EFFECTS_API, { params }).then(res => {
          this.effectList = [...res.data.list]
        })
      }
      this.popupShow = !this.popupShow
    },
    getFontFamily() {
      let params = {
        page: 1,
        limit: 100,
        type: 'font'
      }
      this.$axios.get(API.EFFECTS_API, { params }).then(res => {
        this.fontFamilyList = [...res.data.list]
      })
    },
    //更改样式
    changeStyleHandler(id, index) {
      if (id) {
        let params = {
          id: id
        }
        this.$axios.get(API.EFFECT_DETAIL_API, { params }).then(res => {
          const detail = JSON.parse(res.data.info.detail)
          if (detail.model.textEffects) {
            state.layout.elements[this.index].textEffects = [
              ...detail.model.textEffects
            ]
          }
        })
      } else {
        state.layout.elements[this.index].textEffects = [...[]]
      }

      this.sel = index
      // this.fontStyle = item.name
      this.popupShow = false
      // this.fontStyles = item.styles
    },
    //更改字体样式
    changeEffectTabHandler(item, index) {
      this.effectTab = index
    },
    //文字对齐
    textAlignHandler(item) {
      this.textAlignValue = item.icon
      state.layout.elements[this.index].textAlign = item.value
    },
    //字体
    fontFamilyHandler(id) {
      let params = {
        id: id
      }
      this.$axios(API.EFFECT_DETAIL_API, { params }).then(res => {
        this.fontFamily = res.data.info.name
        this.setFontStyle(res.data.info)
        this.fontFamilyShow = false
      })
    },
    //设置引入字体文件
    setFontStyle(data) {
      let style = document.createElement('style')
      style.type = 'text/css'
      style.innerText = `@font-face {font-family:${data.name};src:url(${data.detail})}`
      document.getElementsByTagName('head')[0].appendChild(style)
    },
    showFontFamilyHandler() {
      this.fontFamilyShow = !this.fontFamilyShow
      if (this.fontFamilyShow) {
        setTimeout(() => {
          window.addEventListener('click', this.hideFontFamilyHandler)
        }, 0)
      }
    },
    hideFontFamilyHandler() {
      this.fontFamilyShow = false
      window.removeEventListener('click', this.hideFontFamilyHandler)
    },
    textDirectionHandler() {
      if (state.layout.elements[this.index].writingMode == 'horizontal-tb') {
        state.layout.elements[this.index].writingMode = 'vertical-rl'
      } else if (
        state.layout.elements[this.index].writingMode == 'vertical-rl'
      ) {
        state.layout.elements[this.index].writingMode = 'horizontal-tb'
      }
    }
  }
}
</script>