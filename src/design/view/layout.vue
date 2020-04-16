<template>
  <div id="design-app">
    <vx-menu @redo="redoHandler" @undo="undoHandler"></vx-menu>
    <div class="design-main">
      <vx-aside @add="addHandler" />
      <vx-canvas v-show="!loading" />
      <VxLoading msg="正在加载模板，请稍后" v-show="loading" />
      <vx-config
        @opDelete="deleteHandler"
        @moveUp="moveUpHandler"
        @moveDown="moveDownHandler"
        @moveTop="moveTopHandler"
        @moveBottom="moveBottomHandler"
        :data="selectWidget"
      ></vx-config>
    </div>
  </div>
</template>
<script>
import { mitation, getter, state } from 'src/design/store'
import { mixin } from 'src/design/utils'
const VxMenu = () => import('./menu')
const VxAside = () => import('src/design/components/aside')
import { VxCanvas } from './canvas'
import { API, log } from 'src/design/utils'
const VxConfig = () => import('./config')
import { getProduct } from 'src/api/api'
import { GET_FONTFAMILY_BYNAME } from 'src/api/design'
export default {
  name: 'vx-design-layout',
  mixins: [mixin],
  components: {
    VxAside,
    VxMenu,
    VxCanvas,
    VxConfig
  },
  data() {
    return {
      panelShow: -1,
      id: this.$route.params.id,
      loading: false,
      designModel: this.$route.query.designModel
    }
  },
  computed: {
    isShow() {
      return this.panelShow !== -1
    },
    selectWidget() {
      return getter.current()
    },
    elements() {
      return getter.layout().elements
    }
  },
  created() {
    document.addEventListener('keydown', this.handleEvent)
  },
  async mounted() {
    if (this.id != 'new') {
      this.loading = true
      if (this.designModel == 'user') {
        //设置id
        mitation.setId(this.id)
        await getProduct(this.id)
          .then(async data => {
            data.data.detail = JSON.parse(data.data.detail)
            data.data.detail.global.showWatermark = true
            await mitation.setTemplate(data.data.detail, this.id)
            await this.loadFontHandler(data.data.detail.layout)
            mitation.setTitle(data.data.name)
            this.loading = false
          })
          .catch(err => {
            log.danger(err)
          })
      } else {
        await this.$axios
          .get(API.TEMPLATE_API, {
            params: {
              id: this.id,
              type: 'template'
            }
          })
          .then(async data => {
            data.data.info.detail = JSON.parse(data.data.info.detail)
            data.data.info.detail.global.showWatermark = true
            await mitation.setTemplate(data.data.info.detail, this.id)
            await this.loadFontHandler(data.data.info.detail.layouts[0])
            mitation.setTitle(data.data.info.name)
            this.loading = false
          })
          .catch(err => {
            log.danger(err)
          })
      }

      this.adaptScreen()
    } else if (this.id == 'new') {
      mitation.resetLayout()
      this.loading = false
    }
    if (getter.layout().elements.length == 0) {
      mitation.resetCurrent()
    }
  },
  methods: {
    //加载字体文件
    loadFontHandler(layout) {
      if (layout.elements && layout.elements.length > 0) {
        layout.elements.forEach(element => {
          if (element.type === 'text') {
            GET_FONTFAMILY_BYNAME(element.fontFamily).then(res => {
              if (res.data && res.data.info) {
                this.setFontStyle(res.data.info)
              }
            })
          }
        })
      }
    },
    //设置引入字体文件
    setFontStyle(data) {
      let style = document.createElement('style')
      style.type = 'text/css'
      style.innerText = `@font-face {font-family:${data.name};src:url(${data.detail})}`
      document.getElementsByTagName('head')[0].appendChild(style)
    },
    handleEvent(event) {
      //del || backspace    -----删除键
      if (event.keyCode === 46 || event.keyCode === 8) {
        if (this.selectWidget.id != -1 && !this.selectWidget.edit) {
          state.layout.elements.splice(this.selectWidget.index, 1)
          this.deleteHandler()
          event.preventDefault()
          event.returnValue = false
        }

        return false
      } //ctrl + C ----复制
      else if (event.keyCode === 67 && event.ctrlKey) {
        //复制操作
        mitation.copyEvent()
        event.preventDefault()
        event.returnValue = false
        return false
      }
      //ctrl + V ----粘贴
      else if (event.keyCode === 86 && event.ctrlKey) {
        //粘贴
        mitation.pasteEvent()
        event.preventDefault()
        event.returnValue = false
        return false
      }
      //ctrl + X ----剪切
      else if (event.keyCode === 88 && event.ctrlKey) {
        mitation.cutEvent()
        this.deleteHandler()
        //剪切
        event.preventDefault()
        event.returnValue = false
        return false
      }
      //ctrl+Z----撤销
      else if (event.keyCode === 90 && event.ctrlKey) {
        mitation.setUndo()
        this.deleteHandler()
        //剪切
        event.preventDefault()
        event.returnValue = false
        return false
      } //ctrl+Y   --- 重做
      else if (event.keyCode === 89 && event.ctrlKey) {
        this.redoHandler()
        this.deleteHandler()
        //剪切
        event.preventDefault()
        event.returnValue = false
        return false
      }
    },
    hidePanelHandler() {
      this.togglePanelHandler(-1)
    },
    // 切换侧边栏菜单
    togglePanelHandler(panel) {
      if (panel === this.panelShow) {
        this.panelShow = -1
      } else {
        this.panelShow = panel
      }
    },
    undoHandler() {
      mitation.setUndo()
    },
    redoHandler() {
      mitation.setRedo()
    },
    deleteHandler() {
      let selectOrg = {
        type: 'canvas',
        id: -1
      }
      mitation.setCurrent(selectOrg)
      //   this.selectWidget = Object.assign({}, selectOrg)
    },
    //向上一层
    moveUpHandler() {
      let up = this.selectWidget.over.up
      if (up.length > 0) {
        let id = up.shift()
        mitation.moveUp(this.selectWidget.id, id)
      }
    },
    //向下一层
    moveDownHandler() {
      let down = this.selectWidget.over.down
      if (down.length > 0) {
        let id = down.pop()
        mitation.moveDown(this.selectWidget.id, id)
      }
    },
    moveTopHandler() {
      mitation.moveTop(this.selectWidget.id)
      //   this.selectWidget.id = getter.layout().elements.length - 1;
      // mitation.setCurrent({
      //     id: getter.layout().elements.length - 1,
      //     type: this.selectWidget.type
      // })
    },
    moveBottomHandler() {
      mitation.moveBottom(this.selectWidget.id)
      //   this.selectWidget.id = 0;
      // mitation.setCurrent({
      //     id: 0,
      //     type: this.selectWidget.type
      // })
    },
    addHandler(data) {
      mitation.setCurrent({
        id: data.id,
        type: data.type
      })
    }
  }
}
</script>
