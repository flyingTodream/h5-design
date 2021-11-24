<template>
  <div class="vx-download">
    <div class="vx-download-title">
      <span>下载文件</span>
      <i @click="closeDownloadHandler" class="el-icon-close"></i>
    </div>
    <div class="vx-download-fileType">
      <div class="vx-download-fileType-text">文件类型</div>
      <div>
        <el-select v-model="fileType" placeholder="请选择">
          <el-option class="vx-download-fileType-option" label="PNG" value="PNG">
            <div>PNG</div>
            <div class="vx-download-fileType-type-label">优质无损图片，文件较大，支持透明背景</div>
          </el-option>
          <el-option class="vx-download-fileType-option" label="JPG" value="JPG">
            <div>JPG</div>
            <div class="vx-download-fileType-type-label">文件较小的图片，不支持透明背景</div>
          </el-option>
        </el-select>
      </div>
      <div>
        <el-select v-show="fileType === 'JPG'" v-model="compress" placeholder="请选择">
          <el-option label="100%" :value="1">
            <span style="float: left">100%</span>
            <span style="float: right; color: #8492a6; font-size: 13px">(无压缩)</span>
          </el-option>
          <el-option label="80%" :value="0.8">
            <span style="float: left">80%</span>
            <span style="float: right; color: #8492a6; font-size: 13px"></span>
          </el-option>
          <el-option label="70%" :value="0.7">
            <span style="float: left">70%</span>
            <span style="float: right; color: #8492a6; font-size: 13px"></span>
          </el-option>
          <el-option label="50%" :value="0.5">
            <span style="float: left">50%</span>
            <span style="float: right; color: #8492a6; font-size: 13px">(普通压缩)</span>
          </el-option>
          <el-option label="20%" :value="0.2">
            <span style="float: left">20%</span>
            <span style="float: right; color: #8492a6; font-size: 13px"></span>
          </el-option>
        </el-select>
      </div>
      <div class="vx-download-fileType-text">作品水印</div>
      <div class="vx-download-watermark">
        <el-radio v-model="watermark" :label="true">
          高清无水印
          <span>（限时免费）</span>
        </el-radio>
        <el-radio v-model="watermark" :label="false">有水印</el-radio>
      </div>
      <div class="vx-download-tips">
        <p>限时免费：此设计中包含的字体及图片均可免费使用、分享及发布，并用作商业用途。请放心使用！</p>
        <a>查看使用及版权细则</a>
      </div>
      <div @click="download" class="vx-download-download">确认下载</div>
      <!-- <div class="vx-download-download-phone">下载到手机</div> -->
    </div>
    <el-dialog
      :show-close="false"
      top="30vh"
      :modal="false"
      :visible.sync="dialogVisible"
      width="80%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <p>
        <i class="el-icon-loading"></i>
        <span class="vx-download-loading">正在导出图片，请稍候...</span>
      </p>
      <el-progress :percentage="proess"></el-progress>
    </el-dialog>
  </div>
</template>
<script>
import { log } from 'src/design/utils'
export default {
  name: 'vx-download',
  data() {
    return {
      dialogVisible: false,
      fileType: 'PNG',
      compress: 1,
      watermark: true,
      proess: 0
    }
  },
  methods: {
    closeDownloadHandler() {
      this.$emit('close')
    },
    async download() {
      this.proess = 0
      this.dialogVisible = true

      let clock = setInterval(() => {
        if (this.proess < 98) {
          this.proess += 1
        } else {
          clearInterval(clock)
        }
      }, 200)
      await this.$parent
        .download(this.fileType, this.watermark, this.compress)
        .then(res => {
          clearInterval(clock)
          this.proess = 100
          if (this.myBrowser() == 'IE') {
            window.navigator.msSaveBlob(res, name + '.jpg')
          } else {
            var a = document.createElement('a')
            a.download = name
            a.href = URL.createObjectURL(res)
            a.click()
          }
          this.dialogVisible = false
          this.$emit('close')
        })
        .catch(err => {
          this.proess = 0
          clearInterval(clock)
          this.dialogVisible = false
          log.danger(err)
        })
    },
    myBrowser() {
      var userAgent = navigator.userAgent //取得浏览器的userAgent字符串
      if (userAgent.indexOf('OPR') > -1) {
        return 'Opera'
      } //判断是否Opera浏览器 OPR/43.0.2442.991
      if (userAgent.indexOf('Firefox') > -1) {
        return 'FF'
      } //判断是否Firefox浏览器  Firefox/51.0
      if (userAgent.indexOf('Trident') > -1) {
        return 'IE'
      } //判断是否IE浏览器  Trident/7.0; rv:11.0
      if (userAgent.indexOf('Edge') > -1) {
        return 'Edge'
      } //判断是否Edge浏览器  Edge/14.14393
      if (userAgent.indexOf('Chrome') > -1) {
        return 'Chrome'
      } // Chrome/56.0.2924.87
      if (userAgent.indexOf('Safari') > -1) {
        return 'Safari'
      } //判断是否Safari浏览器 AppleWebKit/534.57.2 Version/5.1.7 Safari/534.57.2
    }
  }
}
</script>