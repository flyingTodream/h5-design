<template>
  <div class="design-config">
    <!-- <VxToolBar :index="index"></VxToolBar> -->
    <div class="image-changeimg" :class="{'image-disable': locked}">
      <div @click="upload" class="image-upload">
        替换图片
        <!-- <input class type="file" /> -->
      </div>
    </div>
    <div v-show="!isGroup" :class="{'image-disable': locked}" class="image-panel">
      <div @click="showPopHandler" class="image-panel-hover">
        <div
          :style="{'background-image':`url(${this.previewBackground})`}"
          class="image-preview"
        >{{styleLable}}</div>
        <span class="image-panel-icon"></span>
      </div>
      <div v-show="popupShow" class="image-popup">
        <ul>
          <li :class="{'image-popup-selected':sel==null}" @click="changeStyleHandler(null,null)">无样式</li>
          <li
            v-for="(item,index) in effectList"
            :key="index"
            :class="{'image-popup-selected':sel==index}"
            @click="changeStyleHandler(item.id,index)"
            :style="{'background-image':`url(${item.typefacePath})`}"
          >{{item.name}}</li>
        </ul>
      </div>
    </div>
    <div :class="{'image-disable': locked}" class="image-group">
      <!-- <div aria-label="抠图后效果更好哦" class="image-row-1 btn-tip">
        <vx-icon name="img-cut"></vx-icon>智能抠图
      </div>-->
      <div class="image-row-2">
        <div @click="setCutableHandler">
          <vx-icon name="cut"></vx-icon>剪裁图片
        </div>
      </div>
      <div class="image-row-3">
        <span @click="rotateYHandler" class="image-row-3-span">水平翻转</span>
        <span @click="rotateXHandler">垂直翻转</span>
      </div>
    </div>
    <div :class="{'image-disable': locked}" class="image-range-picker">
      <div class="image-range-input">
        <div class="image-range-lable">不透明</div>
        <div class="image-range">
          <!-- <el-slider :min="0" :max="10" v-model="range"></el-slider> -->
        </div>
        <!-- <div class="image-range-value">{{range}}</div> -->
      </div>
    </div>
  </div>
</template>
<script>
import { log } from 'src/design/utils'
import { state, mitation } from 'src/design/store'
import { API } from 'src/design/utils'
// import VxToolBar from '@/components/toolBar'
// import { createImg } from 'src/utils/imgUtils'
export default {
  name: 'vx-props-picture',
  components: {
    // VxToolBar
  },
  data() {
    return {
      popupShow: false, //样式列表是否显示
      sel: null, //选中的样式
      styleLable: '无样式', //默认选中的样式
      effectList: [], //样式列表,
      previewBackground: ''
    }
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
  computed: {
    locked() {
      return state.layout.elements[this.index]
      // return state.layout.elements[this.index].lock
    },
    // range: {
    //   get() {
    //     if (this.isGroup) {
    //       return (
    //         state.layout.elements[this.index].elements[this.elementIndex]
    //           .opacity * 10
    //       )
    //     } else {
    //       return state.layout.elements[this.index].opacity * 10
    //     }
    //   },
    //   set(newValue) {
    //     if (this.isGroup) {
    //       state.layout.elements[this.index].elements[
    //         this.elementIndex
    //       ].opacity = newValue / 10
    //     } else {
    //       state.layout.elements[this.index].opacity = newValue / 10
    //     }
    //   }
    // }
  },
  created() {
    this.getImageStyleHandler()
  },
  methods: {
    showPopHandler() {
      this.popupShow = !this.popupShow
      this.sel = null
    },
    getImageStyleHandler() {
      let params = {
        page: 1,
        limit: 100,
        type: 'img_masking'
      }

      this.$axios(API.EFFECTS_API, { params }).then(res => {
        this.effectList = [...res.data.list]
      })
    },
    changeStyleHandler() {
 // changeStyleHandler(id, index) {
      // if (this.sel != index) {
      //   this.sel = index
      //   if (id != null) {
      //     let params = {
      //       id: id
      //     }

      //     this.$axios(API.EFFECT_DETAIL_API, { params }).then(res => {
      //       this.styleLable = ''
      //       this.previewBackground = res.data.info.typefacePath
      //       const data = JSON.parse(res.data.info.detail)
      //       data.model.imageEffects.forEach(element => {
      //         createImg(
      //           state.layout.elements[this.index].imageUrl,
      //           element.mask.image,
      //           state.layout.elements[this.index].width,
      //           state.layout.elements[this.index].height,
      //           res => {
      //             mitation.changeImgUrl(res, this.index)
      //           }
      //         )
      //         this.popupShow = false
      //       })
      //     })
      //   } else {
      //     this.previewBackground = ''
      //     this.styleLable = '无样式'

      //     mitation.changeImgUrl(
      //       state.layout.elements[this.index].imageUrl,
      //       this.index
      //     )
      //     this.popupShow = false
      //   }
      // }
    },
    rotateYHandler() {
      if (this.isGroup) {
      //   state.layout.elements[this.index].elements[
      //     this.elementIndex
      //   ].transform.a = -state.layout.elements[this.index].elements[
      //     this.elementIndex
      //   ].transform.a
      //   state.layout.elements[this.index].elements[
      //     this.elementIndex
      //   ].transform.b = -state.layout.elements[this.index].elements[
      //     this.elementIndex
      //   ].transform.b
      } else {
      //   state.layout.elements[this.index].transform.a = -state.layout.elements[
      //     this.index
      //   ].transform.a
      //   state.layout.elements[this.index].transform.b = -state.layout.elements[
      //     this.index
      //   ].transform.b
      }
    },
    rotateXHandler() {
      if (this.isGroup) {
//         state.layout.elements[this.index].elements[
//           this.elementIndex
//         ].transform.c = -state.layout.elements[this.index].elements[
//           this.elementIndex
//         ].transform.c
//         state.layout.elements[this.index].elements[
//           this.elementIndex
//         ].transform.d = -state.layout.elements[this.index].elements[
//           this.elementIndex
//         ].transform.d
      } else {
//         state.layout.elements[this.index].transform.c = -state.layout.elements[
//           this.index
//         ].transform.c
//         state.layout.elements[this.index].transform.d = -state.layout.elements[
//           this.index
//         ].transform.d
      }
    },
    upload() {
      let parent = -1
      if (this.isGroup) {
        parent = this.index
      }
      this.$upload()
        .then(data => {
          mitation.updateImg(parent, this.elementIndex, data.url)
        })
        .catch(err => {
          log.danger(err)
        })
    },
    setCutableHandler() {
      mitation.setCutable(true)
    }
  }
}
</script>