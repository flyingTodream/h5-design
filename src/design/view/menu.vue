<template>
  <div class="design-menus">
    <div @click="$router.push('/')" class="menu-logo">
      <img class="vx-logoHome-img" src="../../assets/image/logo.png" />
    </div>
    <div class="menu-view">
      <div class="menu-tool">
        <vx-icon
          class="menu-undo"
          :class="{'disable':undoStatus}"
          @click.native="undoHandler"
          title="撤销"
          name="undo"
        />
        <vx-icon
          class="menu-redo"
          :class="{'disable':redoState}"
          @click.native="redoHandler"
          title="重做"
          name="redo"
        />
        <span class="menu-save">
          <vx-icon
            @click.native="showSaveItemHandler"
            aria-disabled
            :title="saveTitle"
            name="save"
          />
        </span>
        <div v-show="isSaveListShow" class="menu-save-item">
          <ul>
            <li @click.stop="saveHandler">
              <VxResult v-if="saveSuccess" :res="saveSuccess" />
              <span>{{saveTitle}}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="meun-zoom">
        <vx-icon class="menu-add" @click.native="zoominHandler" title="放大" name="add" />
        <div class="menu-zoomvalue">
          <div class="menu-zoomnum">{{zoomValue}}%</div>
          <vx-icon
            @click.native="zoomHandler"
            :title="zoomF?'适应屏幕':'实际大小'"
            class="menu-zoomfit"
            :name="`zoom-${zoomF?'fit':'off'}`"
          ></vx-icon>
        </div>
        <vx-icon class="menu-sub" @click.native="zoomoutHandler" title="缩小" name="sub" />
      </div>
      <div class="menu-edit">
        <div @click="showEditHandler" v-if="!isShowEdit" class="menu-nickname">
          <div class="btn-tip" aria-label="修改标题">
            <div class="menu-title">{{title||'请输入标题'}}</div>
            <vx-icon name="edit" />
          </div>
        </div>
        <div v-if="isShowEdit" :class="{'iseditshow': isShowEdit}" class="menu-nickname">
          <input
            ref="inputVal"
            maxlength="20"
            v-model="title"
            @keyup.enter="hideEditHandler"
            @blur="hideEditHandler"
            class="menu-title-edit"
          />
        </div>
      </div>
    </div>

    <div class="menu-operate">
      <div @click="shareHandler" class="menu-share">分享</div>
      <div @click="downloadHandler" class="menu-download">下载</div>
    </div>
    <!--  -->
    <VxShare @close="showShare = false" :id="id" v-if="isLogin && showShare"></VxShare>
    <VxDownload @close="showDownload = false" v-if="isLogin && showDownload" />
    <vx-canvas-download type="print" ref="print" />
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
import { getter, mitation } from 'src/design/store'
import util from 'src/design/utils'
const VxDownload = () => import('./download')
const VxCanvasDownload = () => import('./canvas/canvasPreview')
import API from 'src/design/utils/API'
import { log } from 'src/design/utils'
const VxShare = () => import('./share')
import { userCenterList } from 'src/api/api'
const VxResult = () => import('../../components/vxReslut')
export default {
  name: 'vx-menu',
  mixins: [util.mixin],
  components: {
    VxDownload,
    VxCanvasDownload,
    VxShare,
    VxResult
  },
  data() {
    return {
      isSaveListShow: false, //保存作图记录是否显示，默认不显示
      saveTitle: '保存', //保存按钮title
      isShowEdit: false, //显示编辑框
      // title: '', //标题名称
      zoomF: false,
      showDownload: false,
      zoom: 1,
      showShare: false,
      dialogVisible: false,
      proess: 0,
      //我的作品id
      projectId: null,
      saveSuccess: false
    }
  },
  computed: {
    title: {
      get() {
        return getter.title()
      },
      set(val) {
        mitation.setTitle(val)
      }
    },
    zoomValue() {
      return util.floatObj.multiply(
        util.floatObj.multiply(getter.zoom(), 1, 2),
        100
      )
    },
    id() {
      return getter.id() + ''
    },
    undoStatus() {
      return !getter.undoStatus()
    },
    redoState() {
      return !getter.redoStatus()
    },
    isLogin() {
      return this.$store.getters.getLoginState()
    },
    showLogin() {
      return this.$store.getters.getShowLogin()
    }
  },
  created() {
    setInterval(() => {
      if (this.isLogin) {
        this.saveHandler()
      }
    }, 180 * 1000)
  },

  methods: {
    async shareHandler() {
      if (!this.isLogin) {
        this.$store.commit('updateShowLogin', true)
        this.dialogVisible = false
        return false
      }
      //随便发一个接口，判断是否登录
      userCenterList().then(async res => {
        if (!res) {
          this.dialogVisible = false
          this.proess = 0
        } else {
          this.dialogVisible = true
          this.proess = 0
          let clock = setInterval(() => {
            if (this.proess < 98) {
              this.proess++
            } else {
              clearInterval(clock)
            }
          }, 200)
          await this.saveHandler()
          clearInterval(clock)
          this.dialogVisible = false
          this.showShare = !this.showShare
        }
      })
    },
    // 改变缩放比例，。。适应屏幕/实际大小
    zoomHandler() {
      this.zoomF = !this.zoomF
      if (this.zoomF) {
        this.adaptScreen()
      } else {
        this.acutalSize()
      }
    },
    //控制显示编辑视图
    showEditHandler() {
      this.isShowEdit = true
      setTimeout(() => {
        // 获取焦点
        this.$refs.inputVal.focus()
        mitation.updateCurrentEdit(true)
      }, 0)
    },
    //隐藏输入框
    hideEditHandler() {
      this.isShowEdit = false
      mitation.setTitle(this.title)
    },
    //撤销
    undoHandler() {
      this.$emit('undo')
    },
    //重做
    redoHandler() {
      this.$emit('redo')
    },
    //隐藏保存作图记录
    hideSaveItemHandler() {
      this.isSaveListShow = false
      window.removeEventListener('click', this.hideSaveItemHandler)
    },
    // 显示保存作图记录
    showSaveItemHandler() {
      this.isSaveListShow = !this.isSaveListShow
      if (this.isSaveListShow) {
        setTimeout(() => {
          window.addEventListener('click', this.hideSaveItemHandler)
        }, 0)
      }
    },
    async download(fileType, watermark, compress) {
      mitation.setWaterMask(watermark)
      let img = await this.$refs.print.downLoad(fileType, compress) // 生成的是base64
      let data = this.toImage(img) // 转成对应类型图片的blob对象
      await this.$blobUpload(
        data,
        new Date() + '.' + data.type.replace('image/', '')
      )
      return await data
    },
    //保存
    async saveHandler() {
      this.saveTitle = '正在保存...'
      let img = await this.$refs.print.printImageHandler() // 生成的是base64
      let data = this.toImage(img) // 转成对应类型图片的blob对象
      let url = await this.$blobUpload(
        data,
        new Date() + '.' + data.type.replace('image/', '')
      )

      let params = {
        goodsId: getter.goodsId() || '',
        ...getter.template(),
        picUrl: url.url || ''
      }
      let id = getter.id()
      id && (params['id'] = id)
      await this.$axios
        .post(API.SAVE_API, params)
        .then(res => {
          this.saveTitle = '保存成功'

          this.saveSuccess = true
          this.projectId = res.data.id
          mitation.setId(res.data.id)
          setTimeout(() => {
            this.isSaveListShow = false
            window.removeEventListener('click', this.hideSaveItemHandler)
            this.saveTitle = '保存'
            this.saveSuccess = false
          }, 2 * 1000)
        })
        .catch(err => {
          log.warning(err)
        })
    },
    //保存作图记录
    saveRecordHandler() {
      this.$emit('saveRecord')
    },
    //放大
    zoominHandler() {
      if (getter.zoom() * 100 < 400) {
        mitation.setZoom(util.floatObj.add(getter.zoom(), 0.1))
      }
    },
    //缩小
    zoomoutHandler() {
      if (getter.zoom() * 100 > 15) {
        mitation.setZoom(util.floatObj.subtract(getter.zoom(), 0.1))
      }
    },
    hideLoginHandler() {
      this.$store.commit('updateShowLogin', false)
    },
    downloadHandler() {
      if (!this.isLogin) {
        this.$store.commit('updateShowLogin', true)
      }
      this.showDownload = !this.showDownload
    },

    setTitle(title) {
      mitation.setTitle(title)
    },
    toImage(data, type) {
      let arr = data.split(',')
      let mime = arr[0].match(/:(.*?);/)[1] || type
      // 去掉url的头，并转化为byte
      let bytes = window.atob(arr[1])
      // 处理异常,将ascii码小于0的转换为大于0
      let ab = new ArrayBuffer(bytes.length)
      // 生成视图（直接针对内存）：8位无符号整数，长度1个字节
      let ia = new Uint8Array(ab)
      for (let i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i)
      }
      return new Blob([ab], {
        type: mime
      })
    }
  },
  watch: {
    title(val) {
      this.setTitle(val)
    }
  }
}
</script>