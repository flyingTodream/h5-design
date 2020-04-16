<template>
  <div class="vx-share">
    <div class="vx-share-title">
      <span>分享</span>
      <i @click="closeHandler" class="el-icon-close"></i>
    </div>
    <div class="vx-share-qrcode">
      <div ref="qrcode" id="qrcode" class="code"></div>
    </div>
    <div class="vx-share-link">
      <div class="vx-share-link-text">{{link}}</div>
      <div
        class="vx-share-link-btn"
        :style="{backgroundColor:bgColor}"
        v-clipboard:copy="link"
        v-clipboard:success="onCopy"
        v-clipboard:error="onError"
      >{{text}}</div>
    </div>
  </div>
</template>
<script>
import QRCode from 'easyqrcodejs'
export default {
  name: 'vx-share',
  data() {
    return {
      link: 'http://' + window.location.host + '/' + 'share/' + this.id,
      bgColor: '',
      text: '复制链接'
    }
  },
  props: {
    id: {
      type: String,
      default: '0'
    }
  },
  methods: {
    getQrcode() {
      var options = {
        text: this.link,
        logo: require('../assets/img/logo.png'),
        colorDark: '#409eff',
        colorLight: '#FFF',
        width: 150,
        height: 150
        // autoColor: true
      }
      // Create new QRCode Object
      new QRCode(this.$refs.qrcode, options)
    },
    closeHandler() {
      this.$emit('close')
    },
    onCopy() {
      this.bgColor = '#00b866'
      this.text = '复制成功'
    },
    onError() {
      this.bgColor = '#f56c6c'
      this.text = '复制失败'
    }
  },
  mounted() {
    this.getQrcode()
  }
}
</script>