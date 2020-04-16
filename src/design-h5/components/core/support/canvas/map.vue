<template>
  <div @dblclick="dbclickHandler">
    <img :src="url" />
    <a-modal :width="700" centered :footer="null" title="编辑地址" v-model="visible">
      <div aria-label="滚动鼠标滚轮放大缩小" class="vx-h5-map btn-tip">
        <img id="map" :src="editUrl" />
      </div>
      <div style="padding:10px;">
        <span>缩放级别：{{zoom}}</span>
      </div>
      <div class="vx-h5-map-input">
        <el-select
          v-model="value"
          :multiple="false"
          filterable
          clearable
          remote
          style="width:500px"
          reserve-keyword
          placeholder="请输入关键词"
          :remote-method="remoteMethod"
          :loading="loading"
          @change="changeHandler"
        >
          <el-option
            v-for="item in addressList"
            :key="item.value"
            :label="item.district+item.name"
            :value="item.location"
          ></el-option>
        </el-select>
        <a-button type="primary" @click="visible = false">保存</a-button>
      </div>
    </a-modal>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'vx-h5-map',
  props: {
    element: {
      type: Object,
      default: () => {}
    },
    preview: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      visible: false,
      value: '',
      addressList: [],
      loading: false,
      zoom: 12
    }
  },
  watch: {
    zoom(val) {
      this.element.pluginProps = {
        ...this.element.pluginProps,
        zoom: val
      }
    }
  },
  computed: {
    url() {
      return process.env.VUE_APP_AMAP_API + 'v3/staticmap?' + this.parameters
    },
    editUrl() {
      return process.env.VUE_APP_AMAP_API + 'v3/staticmap?' + this.editparam
    },
    commonStyle() {
      return {
        width: Math.round(this.element.commonStyle.width / 2),
        height: Math.round(this.element.commonStyle.height / 2)
      }
    },
    editparam() {
      return (
        'key=' +
        process.env.VUE_APP_AMAP_KEY +
        '&zoom=' +
        this.zoom +
        '&scale=2&markers=small,0xFF0000,0:' +
        this.element.pluginProps.location +
        '&location=' +
        this.element.pluginProps.location +
        '&size=600*300'
      )
    },
    parameters() {
      return (
        'key=' +
        process.env.VUE_APP_AMAP_KEY +
        '&zoom=' +
        this.element.pluginProps.zoom +
        '&scale=2&markers=small,0xFF0000,0:' +
        this.element.pluginProps.location +
        '&location=' +
        this.element.pluginProps.location +
        '&size=' +
        this.commonStyle.width +
        '*' +
        this.commonStyle.height
      )
    }
  },
  methods: {
    dbclickHandler() {
      if (!this.preview) {
        this.visible = true
        this.$nextTick(() => {
          var map = document.getElementById('map')
          if (map.addEventListener) {
            // IE9, Chrome, Safari, Opera
            map.addEventListener('mousewheel', this.MouseWheelHandler, false)
            // Firefox
            map.addEventListener(
              'DOMMouseScroll',
              this.MouseWheelHandler,
              false
            )
          }
          // IE 6/7/8
          else map.attachEvent('onmousewheel', this.MouseWheelHandler)
        })
      }
    },
    remoteMethod(query) {
      this.loading = true
      let url =
        process.env.VUE_APP_AMAP_API +
        '/v3/assistant/inputtips?keywords=' +
        query +
        '&datatype=all&key=' +
        process.env.VUE_APP_AMAP_KEY
      axios.get(url).then(res => {
        this.addressList = [...res.data.tips]
        this.loading = false
      })
    },
    changeHandler(value) {
      this.element.pluginProps.location = value
    },
    MouseWheelHandler(e) {
      // cross-browser wheel delta
      let event = window.event || e // old IE support

      var delta = Math.max(-1, Math.min(1, event.wheelDelta || -evente.detail))
      if (delta >= 0) {
        if (this.zoom < 17) {
          this.zoom++
        }
      } else {
        if (this.zoom > 2) {
          this.zoom--
        }
      }
    }
  },
  mounted() {}
}
</script>