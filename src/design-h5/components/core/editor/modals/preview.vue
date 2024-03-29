<script>
import { mapActions } from 'vuex'
import QRCode from 'qrcode'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    handleClose: {
      type: Function,
      default: () => {}
    },
    work: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    releaseUrl() {
      return `${window.location.origin}/design-h5/preview/${this.work.id}`
    }
  },
  data() {
    return {
      confirmLoading: false,
      qrcodeSize: 500
    }
  },
  watch: {
    visible(val) {
      if (!val) return
      this.$nextTick(() => this.drawQRcode())
    }
  },
  methods: {
    ...mapActions('editor', ['saveWork', 'updateWork']),
    handleOk() {
      this.confirmLoading = true
      this.saveWork().then(() => {
        this.handleClose()
        this.confirmLoading = false
      })
    },
    handleCancel() {
      console.log('Clicked cancel button')
      this.handleClose()
    },
    drawQRcode() {
      var canvas = document.getElementById('qrcode-container')
      QRCode.toCanvas(canvas, this.releaseUrl, { scale: 4 }, err => {
        console.log(err)
      })
    },
    postMessage2Iframe(message) {
      let iframeWin = document.getElementById('iframe-for-preview')
        .contentWindow
      iframeWin.postMessage(message, window.location.origin)
    },
    openNewTab(urlType) {
      switch (urlType) {
        case 'previewDebug':
          window.open(this.releaseUrl)
          break
        case 'buildEngineDocs':
          window.open(
            'https://ly525.github.io/luban-h5/zh/getting-started/quick-start.html#_2-%E6%9E%84%E5%BB%BA%E9%A2%84%E8%A7%88%E6%89%80%E9%9C%80%E7%9A%84%E6%B8%B2%E6%9F%93%E5%BC%95%E6%93%8E'
          )
          break
      }
    }
  },
  render() {
    return (
      <a-modal
        visible={this.visible}
        confirmLoading={this.confirmLoading}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        width="70%"
        okText="保存"
      >
        <div class="preview-wrapper">
          <a-row gutter={20}>
            <a-col span={8}>
              <div class="phone-wrapper" style={{ transform: 'scale(0.8)' }}>
                <div class="phone">
                  <div class="float-ctrl-panel">
                    <a
                      class="page-controller"
                      onClick={() => {
                        this.postMessage2Iframe('prev')
                      }}
                    >
                      上一页
                    </a>
                    <a
                      class="page-controller"
                      onClick={() => {
                        this.postMessage2Iframe('next')
                      }}
                    >
                      下一页
                    </a>
                    {/**
                    <a-button icon="up" shape="circle" onClick={() => { this.postMessage2Iframe('prev') }}></a-button>
                    <a-button icon="down" shape="circle" onClick={() => { this.postMessage2Iframe('next') }}></a-button>
                    <a-icon type="up" class="page-controller" onClick={() => { this.postMessage2Iframe('prev') }}/>
                    <a-icon type="down" class="page-controller"  onClick={() => { this.postMessage2Iframe('next') }}/>
                    */}
                  </div>
                  {// 类似 v-if="this.visible" 的目的：关闭预览弹框之后，销毁 iframe，避免继续播放音乐、视频
                  // similar with v-if="this.visible": destory the iframe after close the preview dialog to avoid playing the music and video
                  this.visible && (
                    <iframe
                      id="iframe-for-preview"
                      src={this.releaseUrl}
                      frameborder="0"
                      style="height: 100%;width: 100%;"
                    ></iframe>
                  )}
                  {/** <engine :work="editingWork" :map-config="{}" /> */}
                </div>
              </div>
            </a-col>
            <a-col span={12} offset={4}>
              <div class="setting">
                <div class="info">
                  <h4 class="label">设置作品信息</h4>
                  <a-input
                    class="input"
                    value={this.work.title}
                    onChange={e => this.updateWork({ title: e.target.value })}
                    // onBlur={this.saveTitle}
                    placeholder="请输入标题"
                  ></a-input>
                  <a-input
                    class="input"
                    value={this.work.description}
                    onChange={e =>
                      this.updateWork({ description: e.target.value })
                    }
                    // v-model="description"
                    // onBlur={this.saveDescription}
                    placeholder="请输入描述"
                    type="textarea"
                  ></a-input>
                </div>
                <div class="qrcode my-4">
                  <div class="label">
                    <span>手机扫码分享给好友</span>
                  </div>
                  <div class="code">
                    <canvas style="float: left" id="qrcode-container"></canvas>
                    {/**
                    <a-radio-group class="radios" value={this.qrcodeSize} onChange={e => { this.qrcodeSize = e.target.value }}>
                      <a-radio label={500} value={500}>500x500</a-radio>
                      <a-radio label={1000} value={1000}>1000x1000</a-radio>
                      <a-radio label={2000} value={2000}>2000x2000</a-radio>
                    </a-radio-group>
                    */}
                  </div>
                </div>
                <div style="background: #fafafa;">
                  <a-button
                    type="link"
                    icon="link"
                    onClick={() => this.openNewTab('previewDebug')}
                  >
                    打开预览 URL(For Debug){' '}
                  </a-button>
                  <a-button
                    type="link"
                    icon="link"
                    onClick={() => this.openNewTab('buildEngineDocs')}
                  >
                    如果本地预览显示空白，点此查看文档
                  </a-button>
                </div>
              </div>
            </a-col>
          </a-row>
        </div>
      </a-modal>
    )
  }
}
</script>

<style lang="scss">
.preview-wrapper {
  position: relative;
  min-height: 480px;

  .phone-wrapper {
    position: absolute;
    box-sizing: content-box;
    .phone {
      position: absolute;
      width: 320px;
      height: 568px;

      display: inline-block;
      background: #fff;
      box-sizing: content-box;
      border-top: 10px solid #f6f6f6;
      border-left: 10px solid #f6f6f6;
      border-right: 10px solid #f6f6f6;
      border-bottom: 20px solid #f6f6f6;
      border-radius: 20px;
      -webkit-transform-origin: 100% 0;
      transform-origin: 100% 0;
      -webkit-transform: scale(1);
      transform: scale(1);

      .float-ctrl-panel {
        position: absolute;
        top: 100px;
        right: -40px;

        .page-controller {
          display: block;
          cursor: pointer;
          width: 30px;
          height: 80px;
          border-top-right-radius: 5px;
          border-bottom-right-radius: 5px;
          background: #2096f9;
          font-size: 12px;
          text-align: center;
          border: 1px solid #2096f9;
          color: #fff;
          // position: absolute;
          padding: 14px 8px;
          margin-top: 12px;
          // margin-top: -50px;
        }
      }
    }
  }
  .setting {
    color: #4a4a4a;
    font-size: 14px;
    float: right;
    width: 380px;
    .info {
      .input {
        margin-top: 10px;
      }
    }
    .qrcode {
      margin-top: 20px;

      .label span {
        margin-right: 10px;
      }
    }
    .code {
      // !#zh 防止浮动塌陷
      overflow: hidden;
      .radios {
        width: 80px;
        margin-top: 5px;
        margin-left: 30px;
        label {
          margin-left: 0px;
          margin-top: 10px;
        }
        button {
          margin-top: 15px;
        }
      }
    }
    .link {
      width: 100%;
      display: block;
    }
    .edit {
      text-align: center;
      margin-top: 20px;
    }
  }
}
</style>
