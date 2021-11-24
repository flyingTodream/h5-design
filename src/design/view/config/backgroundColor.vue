<template>
  <div class="design-config">
    <div class="background-tips">
      <div class="background-font">背景</div>
      <div @click="resetBgInfoHandler" v-show="isBgChanged" class="background-back">恢复原始背景</div>
    </div>
    <div v-if="isBackgroundColor" class="background-color-pick">
      <div class="background-color-panel">
        <div class="background-color-panel-lable">背景色</div>
        <VxColorPicker v-model="backgroundColor"></VxColorPicker>
      </div>
    </div>
    <div v-if="!isBackgroundColor" class="background-color-image">
      <div class="background-color-image-src">
        <div :style="style">
          <img :style="'opacity:'+backgroundImageInfo.opacity" :src="backgroundImage" />
        </div>
      </div>
    </div>
    <div v-if="!isBackgroundColor" class="background-color-image">
      <div class="background-color-image-tool">
        <div @click.stop="backgroundCut">裁剪</div>
        <div @click.stop="isShow = !isShow">调色</div>
      </div>
      <div @click.stop v-if="isShow" class="background-color-image-color">
        <div class="background-color-image-color-panel">
          <div @click.stop="isShowColor = true" :class="{'active':isShowColor}">预选颜色</div>
          <div @click.stop="isShowColor = false" :class="{'active':!isShowColor}">调色板</div>
        </div>
        <div v-if="isShowColor" class="design-resource-bg__category">
          <ul class="design-resource-bg__list">
            <li @click.stop="setOrginBackgroundHandler" class="design-resource-bg__item">
              <div class="design-resource-bg__item__color">原图</div>
            </li>
            <li
              class="design-resource-bg__item"
              v-for="(item, index) in bgColorList"
              :key="index"
              :aria-label="item.name"
              :class="{'btn-tip': item.tip}"
            >
              <div
                class="design-resource-bg__item__color"
                :class="{
                                    'design-resource-bg__item__border': item.border,
                                    'design-resource-bg__item__bg-img': item.bg
                                }"
                :style="{backgroundColor: item.color}"
                @click.stop="setBgColor(item.color)"
              ></div>
            </li>
            <!-- <li class="design-resource-bg__item">
                                <div class="design-resource-bg__item__color design-resource-bg__item__panel">
                                    <vx-icon class="bg-color-add" name="add" :size="20" />
                                </div>
            </li>-->
          </ul>
          <div class="background-clor-image-pickerColor">
            <div class="background-clor-image-pickerColor-label">调色强度</div>

            <el-slider
              :show-tooltip="false"
              input-size="mini"
              :min="0"
              :max="100"
              v-model="opacity"
            ></el-slider>
            <div class="background-clor-image-pickerColor-value">{{opacity}}%</div>
          </div>
        </div>
        <div v-if="!isShowColor" class="design-resource-bg__category">
          <Sketch v-model="color"></Sketch>
        </div>
      </div>

      <div class="background-color-image-tool">
        <div @click.stop="showRow = !showRow">翻转</div>
        <div @click="deleteBackgroundHandler">删除</div>
      </div>
      <div v-if="showRow" class="background-color-image-row">
        <div @click.stop="rotateYHandler">水平翻转</div>
        <div @click.stop="rotateXHandler">垂直翻转</div>
      </div>
    </div>
    <div class="background-upload-image">
      <div @click="upload" class="background-upload">
        上传背景图
        <!-- <input @input="upload" class type="file" /> -->
      </div>
    </div>
  </div>
</template>
<script>
import { state, mitation, getter } from 'src/design/store'
import VxColorPicker from 'src/design/components/colorPicker'
import { Sketch } from 'vue-color'

import { log } from 'src/design/utils'
export default {
  name: 'vx-background',
  components: {
    VxColorPicker,
    Sketch
  },
  data() {
    return {
      showMatching: false,
      isShow: false,
      isShowColor: true,
      isShowColorPicker: true,
      color: {},
      showRow: false, //翻转是否显示
      bgColorList: [
        {
          color: '#000',
          name: '黑色'
        },
        {
          color: '#999',
          name: '灰色'
        },
        {
          color: '#ccc',
          name: '浅灰色'
        },
        {
          color: '#fff',
          name: '白色',
          border: true
        },
        {
          color: '#00000000',
          name: '透明色',
          border: true,
          bg: true,
          tip: true
        },
        {
          color: '#e65353',
          name: '红色'
        },
        {
          color: '#ffd835',
          name: '黄色'
        },
        {
          color: '#70bc59',
          name: '绿色'
        },
        {
          color: '#50E3C2',
          name: '青色'
        },
        {
          color: '#607af4',
          name: '蓝色'
        },
        {
          color: '#976bee',
          name: '紫色'
        }
      ]
    }
  },
  props: {
    index: {
      type: Number
    }
  },
  watch: {
    'color.hex8': function(val) {
      state.layout.backgroundColor = val
    }
  },
  mounted() {
    window.addEventListener('click', () => {
      this.showRow = false
      this.isShow = false
    })
  },
  computed: {
    bgImgInfo() {
      return state.layout.backgroundImageInfo
    },
    style() {
      let transform = this.bgImgInfo
        ? this.bgImgInfo.transform || { a: 0, b: 0, c: 0, tx: 0, ty: 0 }
        : { a: 0, b: 0, c: 0, tx: 0, ty: 0 }
      return {
        transform: `matrix(${transform.a},${transform.b},${transform.c},${transform.d},${transform.tx},${transform.ty})`,
        'background-color': state.layout.backgroundColor,
        width: '100%',
        height: '100%',
        display: 'flex',
        'justify-content': 'center',
        'align-items': 'center'
      }
    },
    // layout() {
    //   return state.layout
    // },
    opacity: {
      get() {
        return Math.round((1 - state.layout.backgroundImageInfo.opacity) * 100)
      },
      set(newValue) {
        state.layout.backgroundImageInfo.opacity = 1 - newValue / 100
      }
    },
    backgroundColor: {
      get() {
        return state.layout.backgroundColor
      },
      set(newValue) {
        state.layout.backgroundColor = newValue
      }
    },
    isBackgroundColor() {
      return state.layout.backgroundImage == null
    },
    backgroundImage() {
      return state.layout.backgroundImage
    },
    isBgChanged() {
      return getter.bgIsInit()
    },
    backgroundImageInfo() {
      return state.layout.backgroundImageInfo
    }
  },
  methods: {
    colorHandler(val) {
      state.layout.backgroundColor = val
    },
    //上传图片
    upload() {
      this.$upload()
        .then(data => {
          mitation.setbackgroundImage(data.url)
        })
        .catch(err => {
          log.danger(err)
        })
    },
    resetBgInfoHandler() {
      mitation.resetBgInfo()
    },
    deleteBackgroundHandler() {
      state.layout.backgroundImage = null
    },
    setBgColor(color) {
      mitation.setBgColor(color)
    },
    setOrginBackgroundHandler() {
      state.layout.backgroundColor = ''
    }, 
    //水平翻转
    rotateYHandler() {
      mitation.rotateBgY()
    },
    //垂直翻转
    rotateXHandler() {
      mitation.rotateBgX()
    },
    backgroundCut() {
      mitation.setCutBackgroundAble(true)
    },
    stopHandler() {
      return
    }
  }
}
</script>