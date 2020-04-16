<template>
  <div class="design-config">
    <div class="config-tips">
      <div class="config-size">画布尺寸</div>
      <div @click="showDialog = true" class="config-edit">编辑</div>
    </div>
    <div class="config-view">
      <div @click="showDialog = true" class="config-width">
        <span class="config-width-value">{{canvasW}}{{unit}}</span>
        <span class="config-width-label">宽</span>
      </div>
      <div @click="showDialog = true" class="config-height">
        <span class="config-heigth-value">{{canvasH}}{{unit}}</span>
        <span class="config-heigth-label">高</span>
      </div>
    </div>
    <transition name="fade">
      <div v-if="showDialog" class="config-dialog">
        <div class="config-dialog-main" ref="preview" id="preview">
          <div class="config-dialog-canvas">
            <vx-canvas-preview
              type="preview"
              v-if="showDialog"
              :w="width"
              :h="height"
              :width="560"
              :height="504"
            />
          </div>
          <div class="config-dialog-aside">
            <div class="config-title">
              <div class="config-dialog-title">调整画布尺寸</div>
              <div class="config-dialog-close">
                <i @click="showDialog = false" class="el-icon-close"></i>
              </div>
            </div>
            <div class="config-dialog-select">
              <ul>
                <li
                  v-for="(item,index) in selectList"
                  :key="index"
                  :class="{'config-dialog-selected':sel==index}"
                  @click="changeSelHandler(index,item)"
                >
                  <div class="config-select-lable">{{item.title}}</div>
                  <div v-if="item.width == originalW && item.height == originalH">原尺寸</div>
                </li>
              </ul>
            </div>
            <div class="config-dialog-action">
              <el-input-number
                :max="9000"
                :min="20"
                :controls="false"
                @change="changeWidthHandler"
                v-model="width"
                placeholder="输入宽度"
              />
              <vx-icon @click.native="lockHandler" :name="lockIcon" />
              <el-input-number
                :controls="false"
                :max="12000"
                :min="20"
                @change="changeHeightHandler"
                v-model="height"
                placeholder="输入高度"
              />
              <el-select v-model="unit" @change="unitChangeHandler" placeholder="请选择">
                <el-option
                  v-for="item in selectOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
            <div class="config-dialog-info">修改尺寸后，设计场景将会对应切换</div>
            <div class="config-dialog-checkout">
              <!-- <el-checkbox v-model="checked">智能调整尺寸适配</el-checkbox> -->
            </div>
            <div class="config-dialog-space"></div>
            <div @click="changeSizeHandler" class="config-dialog-btn">调整尺寸</div>
            <el-button @click="printImageHandler">下载</el-button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import { state, mitation, getter } from 'src/design/store'
import util from 'src/design/utils'
import { VxCanvasPreview } from 'src/design/view/canvas'
export default {
  name: 'vx-canvasSize',
  components: {
    VxCanvasPreview
  },
  data() {
    return {
      showDialog: false, //遮罩层是否显示
      lockIcon: 'Unlocked', //锁定图标显示
      // checked: false, //默认不选中
      sel: 0, //选中列
      width: getter.layout().width,
      height: getter.layout().height,
      originalW: 0, //原始宽度
      originalH: 0, //原始高度
      aspectRatio: null, //长宽比
      unit: 'px', //单位
      zoom: 0,
      selectOptions: [
        {
          value: 'px',
          label: 'px(像素)'
        },
        {
          value: 'cm',
          label: 'cm(厘米)'
        },
        {
          value: 'mm',
          label: 'mm(毫米)'
        }
      ],
      selectList: [
        {
          title: '自定义尺寸',
          label: '',
          width: null,
          height: null
        },
        {
          title: '手机海报 1242px × 2208px ',
          label: '',
          width: 1242,
          height: 2208
        },
        {
          title: '长图海报 800px × 2000px ',
          label: '',
          width: 800,
          height: 2000
        },
        {
          title: '启动页/闪屏 1248px × 2208px ',
          label: '',
          width: 1248,
          height: 2208
        },
        {
          title: '动态海报 1242px × 2208px ',
          label: '',
          width: 1242,
          height: 2208
        },
        {
          title: '方形海报 1242px × 1242px ',
          label: '',
          width: 1242,
          height: 1242
        },
        {
          title: '日签 1242px × 2208px ',
          label: '',
          width: 1242,
          height: 2208
        }
      ]
    }
  },
  computed: {
    //高度
    canvasW() {
      return getter.canvasW()
    },
    canvasH() {
      return getter.canvasH()
    }
  },
  created() {
    this.originalW = getter.canvasW()
    this.originalH = getter.canvasH()
    this.selectList.forEach((element, index) => {
      if (
        this.originalW === element.width &&
        this.originalH === element.height
      ) {
        this.sel = index
      }
    })
  },
  methods: {
    async printImageHandler() {
      const el = document.querySelector('#canvas')
      if (this.$refs.svg) {
        this.$refs.svg.forEach(node => {
          var svg = node.html.trim()
          var canvas = document.createElement('canvas')
          canvas.style.position = node.imageStyles.position
          canvas.style.left = node.data.left + 'px'
          canvas.style.top = node.data.top + 'px'
          canvas.style.width = node.data.width + 'px'
          canvas.style.height = node.data.height + 'px'
          state.layout.elements[node.index]
          canvas.style.zIndex = node.index
          Canvg(canvas, svg)
          el.appendChild(canvas)
        })
      }
      const options = {
        type: 'dataURL',
        logging: false,
        scale: 1,
        allowTaint: false,
        scrollY: 0,
        taintTest: true, //检测每张图片都已经加载完成
        useCORS: true, //使用跨域
        backgroundColor: null
      }
      return await this.$html2canvas(el, options).then(canvas => {
        console.log(canvas)
        return canvas
      })
    },
    //切换锁定长宽比状态
    lockHandler() {
      if (this.lockIcon === 'Unlocked') {
        this.aspectRatio = this.width / this.height
        this.lockIcon = 'lock'
      } else if (this.lockIcon === 'lock') {
        this.lockIcon = 'Unlocked'
      }
    },
    //监听改变单位事件
    unitChangeHandler(value) {
      //转为px
      if (value === 'px') {
        this.width = this.canvasW
        this.height = this.canvasH
        this.unit = 'px'
        state.global.unit = 'px'
      }
      //转为cm
      else if (value === 'cm') {
        this.width = Math.round((this.canvasW * 25.4) / state.global.dpi / 10)
        this.height = Math.round((this.canvasH * 25.4) / state.global.dpi / 10)
        this.unit = 'cm'
        state.global.unit = 'cm'
      }
      //转为mm
      else if (value === 'mm') {
        this.width = Math.round((this.canvasW * 25.4) / state.global.dpi)
        this.height = Math.round((this.canvasH * 25.4) / state.global.dpi)
        this.unit = 'mm'
        state.global.unit = 'mm'
      }
    },
    //改变选中尺寸事件
    changeSelHandler(index, item) {
      this.sel = index
      this.unit = 'px'
      if (index !== 0) {
        this.width = item.width
        this.height = item.height
      }
    },
    //点击调整尺寸
    changeSizeHandler() {
      if (parseInt(this.width) != this.width) {
        this.$message({
          message: '宽度只能输入整数',
          type: 'error',
          duration: 5 * 1000 // 显示时长(ms)
        })
        return
      } else if (parseInt(this.height) != this.height) {
        this.$message({
          message: '高度只能输入整数',
          type: 'error',
          duration: 5 * 1000 // 显示时长(ms)
        })
        return
      }
      if (this.unit === 'px') {
        mitation.setCanvasSize(this.width, this.height)
      } else if (this.unit === 'mm') {
        mitation.setCanvasSize(
          Math.round((this.width * state.global.dpi) / 25.4),
          Math.round((this.height * state.global.dpi) / 25.4)
        )
      } else if (this.unit === 'cm') {
        mitation.setCanvasSize(
          Math.round((this.width * 10 * state.global.dpi) / 25.4),
          Math.round((this.height * 10 * state.global.dpi) / 25.4)
        )
      }
      this.showDialog = false
      this.updateSizeHandler()
    },
    //宽度输入框改变监听
    changeWidthHandler() {
      this.sel = 0
      if (this.lockIcon === 'lock') {
        this.height = parseInt(
          util.floatObj.divide(this.width, this.aspectRatio, 3)
        )
      }
    },
    //高度输入框改变监听
    changeHeightHandler() {
      this.sel = 0
      if (this.lockIcon === 'lock') {
        this.width = parseInt(
          util.floatObj.multiply(this.height, this.aspectRatio, 3)
        )
      }
    },

    // 调整预览缩放比
    updateSizeHandler() {
      let h = state.layout.height,
        w = state.layout.width
      if (h < w) {
        this.zoom = 560 / w
      } else {
        this.zoom = 504 / h
      }
    }
  },
  mounted() {
    this.updateSizeHandler()
  }
}
</script>