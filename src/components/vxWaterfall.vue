<!-- —————————————↓HTML————————分界线———————————————————————— -->
<template lang="pug">
.vue-waterfall-easy-container(:style="{width: width&&!isMobile ? width+'px' : '', height: bottomTop==0 ? '180px' : bottomTop+buttomHeight+'px'   }")
  .loading.ball-beat(v-show="isloading||(isPreloading_c&&!over)", :style="{top:bottomTop+'px'}" :class="{first:isFirstLoad}")
    slot(name="loading", :isFirstLoad="isFirstLoad")
    .dot(v-if="!hasLoadingSlot", v-for="n in loadingDotCount",:style="loadingDotStyle")
  //- 为了防止loading 跟随滚动
  .vue-waterfall-easy-scroll(ref="scrollEl")
    slot(name="waterfall-head")
    .vue-waterfall-easy(:style="isMobile? '' :{width: colWidth*cols+'px',left:'50%', marginLeft: -1*colWidth*cols/2 +'px'}")
      .img-box(
        v-for="(v,i) in imgsArr_c",
        :class="[cardAnimationClass, {__err__: v._error}]"
        :style="{padding: (isMobile ? mobileGap : gap)/2+'px', width: isMobile ? '' : colWidth+'px'}"
      )
        component.img-inner-box(
          :is="isRouterLink  && linkRange=='card' ? 'router-link' : 'alink'",
          :data-index="i",
          :id="v.id"
          :to="linkRange=='card' ? v[hrefKey] : false")
          component.img-wraper(
            v-if="v[srcKey]",
            :id="v.id"
            is="alink"
            :style="{cursor: 'pointer',width:imgWidth_c + 'px',height:v._height ? v._height+'px':false,backgroundColor:getQueryVariable('color',v.picUrl)}")
            component( 
              is="img"
              v-lazy="v[srcKey]")
          slot(:index="i",:value="v")
          div.vx-model-info
            slot {{v.name}} 
      component.buttom(
        is="VxButtom"
        ref="buttom"
        :style="{top:bottomTop+30+'px'}"
      )
      .over(v-if="over",ref="over" ,:style="{top:bottomTop-10+'px'}")
        slot(name="waterfall-over") 被你看光了
</template>

<!-- ——————————————↓JS—————————分界线———————————————————————— -->
<script>
import VxButtom from '../page/buttom'
import alink from './alink.vue'

export default {
  name: 'vx-waterfall',
  components: {
    alink,
    VxButtom
  },
  props: {
    width: {
      // 容器宽度
      type: Number
    },
    height: {
      // 容器高度
      type: [Number, String]
    },
    reachBottomDistance: {
      // 滚动触底距离，触发加载新图片
      type: Number, // selector
      default: 20 // 默认在最低那一列到底时触发
    },
    loadingDotCount: {
      // loading 点数
      type: Number,
      default: 3
    },
    loadingDotStyle: {
      type: Object
    },
    gap: {
      // .img-box 间距
      type: Number,
      default: 20
    },
    mobileGap: {
      type: Number,
      default: 8
    },
    maxCols: {
      type: Number,
      default: 5
    },
    imgsArr: {
      type: Array,
      required: true
    },
    srcKey: {
      type: String,
      default: 'src'
    },
    hrefKey: {
      type: String,
      default: 'href'
    },
    imgWidth: {
      type: Number,
      default: 240
    },
    isRouterLink: {
      type: Boolean,
      default: false
    },
    linkRange: {
      // card | img | custom 自定义通过slot自定义链接范围
      type: String,
      default: 'card'
    },
    loadingTimeOut: {
      // 预加载事件小于500毫秒就不显示加载动画，增加用户体验
      type: Number,
      default: 500
    },
    cardAnimationClass: {
      type: [String],
      default: 'default-card-animation'
    },
    enablePullDownEvent: {
      type: Boolean,
      default: false
    },
    over: {
      type: Boolean,
      default: true
    },
    isloading: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      bottomTop: 0,
      msg: 'this is from vue-waterfall-easy.vue',
      isMobile: !!navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i), // 初始化移动端
      isPreloading: true, // 正在预加载中，显示加载动画
      isPreloading_c: true,
      imgsArr_c: [], // 待图片预加载imgsArr完成，插入新的字段height之后,才会生成imgsArr_c，这时才开始渲染
      loadedCount: 0,
      cols: NaN, // 需要根据窗口宽度初始化
      imgBoxEls: null, // 所有的.img-box元素
      beginIndex: 0, // 开始要排列的图片索引,首次为第二列的第一张图片，后续加载则为已经排列图片的下一个索引
      colsHeightArr: [],
      // 自定义loading
      LoadingTimer: null,
      isFirstLoad: true // 首次加载
      // over: false // 结束waterfall加载
    }
  },
  computed: {
    colWidth() {
      // 每一列的宽度
      return this.imgWidth + this.gap
    },
    imgWidth_c() {
      // 对于移动端重新计算图片宽度`
      return this.isMobile
        ? window.innerWidth / 2 - this.mobileGap
        : this.imgWidth
    },
    hasLoadingSlot() {
      return !!this.$scopedSlots.loading
    },
    buttomHeight() {
      return document.querySelector('#buttom').offsetHeight + 60
    }
  },
  mounted() {
    this.bindClickEvent()
    this.loadingMiddle()

    this.preload()
    this.cols = this.calcuCols()
    this.$on('preloaded', () => {
      this.isFirstLoad = false

      this.imgsArr_c = this.imgsArr.concat([]) // 预加载完成，这时才开始渲染
      this.$nextTick(() => {
        this.isPreloading = false
        this.imgBoxEls = this.$el.getElementsByClassName('img-box')
        this.waterfall()
      })
    })
    if (!this.isMobile && !this.width)
      window.addEventListener('resize', this.response)
    // this.scroll()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.response)
  },
  watch: {
    isPreloading(newV) {
      if (newV) {
        setTimeout(() => {
          if (!this.isPreloading) return // 500毫秒内预加载完图片则不显示加载动画
          this.isPreloading_c = true
        }, this.loadingTimeOut)
      } else {
        this.isPreloading_c = false
      }
    },
    imgsArr(newV) {
      if (
        this.imgsArr_c.length > newV.length ||
        (this.imgsArr_c.length > 0 && newV[0] && !newV[0]._height)
      ) {
        this.reset()
      }
      this.preload()
    }
  },
  methods: {
    //获取URL的参数
    getQueryVariable(variable, url) {
      let num = url.lastIndexOf('?')
      var query = url.substring(num + 1, url.length)
      var vars = query.split('&')
      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=')
        if (pair[0] == variable) {
          return pair[1]
        }
      }
      return false
    },

    // ==1== 预加载
    preload() {
      this.isPreloading_c = true
      this.imgsArr.forEach((imgItem, imgIndex) => {
        if (imgIndex < this.loadedCount) return // 只对新加载图片进行预加载

        let width = this.getQueryVariable(
          'width',
          this.imgsArr[imgIndex].picUrl
        )
        let height = this.getQueryVariable(
          'height',
          this.imgsArr[imgIndex].picUrl
        )
        this.imgsArr[imgIndex]._height = Math.round(
          this.imgWidth_c / (width / height)
        )
        this.loadedCount++

        if (this.loadedCount == this.imgsArr.length) {
          this.$emit('preloaded')
        }
      })
    },
    // ==2== 计算cols
    calcuCols() {
      // 列数初始化
      var waterfallWidth = this.width ? this.width : window.innerWidth
      var cols = parseInt(waterfallWidth / this.colWidth)
      cols = cols === 0 ? 1 : cols
      return this.isMobile ? 2 : cols > this.maxCols ? this.maxCols : cols
    },
    // ==3== waterfall布局
    waterfall() {
      if (!this.imgBoxEls) return

      var top,
        left,
        height,
        colWidth = this.isMobile ? this.imgBoxEls[0].offsetWidth : this.colWidth
      if (this.beginIndex == 0) this.colsHeightArr = []
      for (var i = this.beginIndex; i < this.imgsArr.length; i++) {
        if (!this.imgBoxEls[i]) return
        height = this.imgBoxEls[i].offsetHeight
        if (i < this.cols) {
          this.colsHeightArr.push(height)
          top = 0
          left = i * colWidth
        } else {
          var minHeight = Math.min.apply(null, this.colsHeightArr) // 最低高低
          var minIndex = this.colsHeightArr.indexOf(minHeight) // 最低高度的索引
          top = minHeight
          left = minIndex * colWidth
          // 设置元素定位的位置
          // 更新colsHeightArr
          this.colsHeightArr[minIndex] = minHeight + height
        }

        this.imgBoxEls[i].style.left = left + 'px'
        this.imgBoxEls[i].style.top = top + 'px'
        this.bottomTop = Math.max.apply(null, this.colsHeightArr)
      }

      this.beginIndex = this.imgsArr.length // 排列完之后，新增图片从这个索引开始预加载图片和排列
    },

    // ==4== resize 响应式
    response() {
      var old = this.cols
      this.cols = this.calcuCols()
      if (old === this.cols) return // 列数不变直接退出
      this.beginIndex = 0 // 开始排列的元素索引
      this.waterfall()
      // if (this.over) this.setOverTipPos()
    },
    // ==6== 点击事件绑定
    bindClickEvent() {
      this.$el
        .querySelector('.vue-waterfall-easy')
        .addEventListener('click', e => {
          var targetEl = e.target
          if (e.target.className.indexOf('over') !== -1) return
          if (targetEl.className.indexOf('img-box') != -1) return
          while (targetEl.className.indexOf('img-inner-box') == -1) {
            targetEl = targetEl.parentNode
          }
          var index = targetEl.getAttribute('data-index')
          this.$emit('click', e, {
            index,
            value: this.imgsArr_c[index]
          })
        })
    },

    // other
    loadingMiddle() {
      // 对滚动条宽度造成的不居中进行校正
      var scrollEl = this.$el.querySelector('.vue-waterfall-easy-scroll')
      var scrollbarWidth = scrollEl.offsetWidth - scrollEl.clientWidth
      this.$el.querySelector('.loading').style.marginLeft =
        -scrollbarWidth / 2 + 'px'
    },
    reset() {
      this.imgsArr_c = []
      this.beginIndex = 0
      this.loadedCount = 0
      this.isFirstLoad = true
      this.isPreloading = true
    }
  }
}
</script>
