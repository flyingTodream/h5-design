import { mapState, mapActions } from 'vuex'
import undoRedoHistory from '@/store/plugins/undo-redo/History'

import '../styles/index.scss'
import 'animate.css'

import RenderEditCanvas from './canvas/edit'
import RenderPreviewCanvas from './canvas/preview'
import RenderPropsEditor from './edit-panel/props'
import RenderScriptEditor from './edit-panel/script'
import RenderAnimationEditor from './edit-panel/animation'
import RenderActoionEditor from './edit-panel/action'
import RenderBackgroundEditor from './edit-panel/background'
// import RenderShortcutsPanel from './shortcuts-panel/index'
import RenderPageManager from './page-manager/index'
import PreviewDialog from './modals/preview.vue'
import VxH5Panel from '../panel'
import LogoOfHeader from '../../../components/common/header/logo.js'
import ExternalLinksOfHeader from '../../../components/common/header/links.js'

const fixedTools = [
  {
    i18nTooltip: 'editor.fixedTool.undo',
    'tooltip': '撤消', // TODO 支持快捷键
    'text': '撤消',
    'icon': 'mail-reply',
    'action': () => undoRedoHistory.undo()
  },
  {
    i18nTooltip: 'editor.fixedTool.redo',
    'tooltip': '恢复',
    'text': '恢复',
    'icon': 'mail-forward',
    'action': () => undoRedoHistory.redo()
  },
  {
    i18nTooltip: 'editor.fixedTool.preview',
    'tooltip': '刷新预览',
    'text': '刷新预览',
    'icon': 'eye',
    'action': function () { this.previewVisible = true }
  },
  {
    i18nTooltip: 'editor.fixedTool.copyCurrentPage',
    'tooltip': '复制当前页',
    'text': '复制当前页',
    'icon': 'copy',
    'action': function () { this.pageManager({ type: 'copy' }) }
  },
  {
    i18nTooltip: 'editor.fixedTool.importPSD',
    'tooltip': '导入PSD',
    'text': 'Ps',
    'icon': '',
    'action': '',
    'disabled': true
  },
  {
    i18nTooltip: 'editor.fixedTool.zoomOut',
    'tooltip': '放大画布',
    'text': '放大画布',
    'icon': 'plus',
    'action': function () { this.scaleRate += 0.25 }
  },
  {
    i18nTooltip: 'editor.fixedTool.zoomIn',
    'tooltip': '缩小画布',
    'text': '缩小画布',
    'icon': 'minus',
    'action': function () { this.scaleRate -= 0.25 }
  },
  {
    i18nTooltip: 'editor.fixedTool.issues',
    'tooltip': 'issues',
    'text': '常见问题',
    'icon': 'question',
    'action': function () { window.open('https://github.com/ly525/luban-h5/issues/110') }
  }
]

export default {
  name: 'Editor',
  components: {
    LogoOfHeader,
    ExternalLinksOfHeader,
  },
  data: () => ({
    activeMenuKey: 'pluginList',
    isPreviewMode: false,
    activeTabKey: '属性',
    previewVisible: false,
    scaleRate: 1
  }),
  computed: {
    ...mapState('editor', {
      editingPage: state => state.editingPage,
      editingElement: state => state.editingElement,
      elements: state => state.editingPage.elements,
      pages: state => state.work.pages,
      work: state => state.work
    }),
    ...mapState('loading', [
      'saveWork_loading',
      'previewWork_loading',
      'setWorkAsTemplate_loading',
      'uploadWorkCover_loading'
    ])
  },
  methods: {
    ...mapActions('editor', [
      'elementManager',
      'pageManager',
      'saveWork',
      'createWork',
      'fetchWork',
      'setWorkAsTemplate',
      'setEditingElement',
      'setEditingPage'
    ]),
    ...mapActions('loading', {
      updateLoading: 'update'
    }),
    /**
     * !#zh 点击插件，copy 其基础数据到组件树（中间画布）
     * #!en click the plugin shortcut, create new Element with the plugin's meta data
     * pluginInfo {Object}: 插件列表中的基础数据, {name}=pluginInfo
     */
    clone({ name }) {
      this.elementManager({
        type: 'add',
        value: { name }
      })
    },
    /**
     * #!zh: 设置 背景图tab 作为 active tab
     * #!en: set background(bg) tab as active tab
     */
    setActiveTab(activeTabKey) {
      this.activeTabKey = activeTabKey
    },
    // _renderMenuContent() {
    //   return (
    //     <VxH5Panel />
    //     // <a-tabs
    //     //   style="height: 100%;"
    //     //   tabBarGutter={70}
    //     // >
    //     //   <a-tab-pane key="plugin-list" tab="组件列表">
    //     //     <div class="plugin-usage-tip ">
    //     //       <a-icon type="info-circle" />
    //     //       <span class="ml-1">使用提示: <strong>点击</strong>组件即可</span>
    //     //     </div>
    //     //     <RenderShortcutsPanel pluginsList={this.pluginsList} handleClickShortcut={this.clone} />
    //     //   </a-tab-pane>
    //     //   <a-tab-pane key='page-manager' tab="页面列表">
    //     //     <RenderPageManager
    //     //       pages={this.pages}
    //     //       editingPage={this.editingPage}
    //     //       onSelectMenuItem={(menuKey) => {
    //     //         this.pageManager({ type: menuKey })
    //     //       }}
    //     //       onEditTitle={({ pageIndexForEditingTitle, newTitle }) => {
    //     //         this.pageManager({ type: 'editTitle', value: { pageIndexForEditingTitle, newTitle } })
    //     //         this.saveWork({ isSaveCover: false })
    //     //       }}
    //     //       onSelectPage={(pageIndex) => { this.setEditingPage(pageIndex) }}
    //     //     />
    //     //   </a-tab-pane>
    //     // </a-tabs>
    //   )
    // }
  },
  render() {
    return (
      <a-layout id="luban-editor-layout" style={{ height: '100vh' }}>
        <a-layout-header class="header">
          <LogoOfHeader />
        </a-layout-header>
        <a-layout>
          <a-layout-sider class="vx-h5-sider" style={{ minWidth: 70 }} theme='light'>
            <VxH5Panel />
          </a-layout-sider>
          <a-layout>
            <div class="mode-toggle-wrapper">
              <a-radio-group
                size="small"
                value={this.isPreviewMode}
                onInput={isPreviewMode => {
                  this.isPreviewMode = isPreviewMode
                  if (isPreviewMode) {
                    // 当切换到预览模式的时候，清空当前编辑元素
                    this.setEditingElement() // 相当于  setEditingElement(null)
                  }
                }}
              >
                {/* 编辑模式、预览模式 */}
                <a-radio-button label={false} value={false}>{this.$t('editor.centerPanel.mode.edit')}</a-radio-button>
                <a-radio-button label={true} value={true}>{this.$t('editor.centerPanel.mode.preview')}</a-radio-button>
              </a-radio-group>
            </div>
            <a-layout-content style={{ transform: `scale(${this.scaleRate})`, 'transform-origin': 'center top' }}>
              <div class='canvas-wrapper'>
                {/* { this.isPreviewMode ? this.renderPreview(h, this.elements) : this.renderCanvas(h, this.elements) } */}
                {this.isPreviewMode
                  ? <RenderPreviewCanvas elements={this.elements} />
                  : <RenderEditCanvas
                    class="edit-mode"
                    elements={this.elements}
                  />
                }
              </div>
            </a-layout-content>
          </a-layout>
          <a-layout-sider width="40" theme='light' style={{ background: '#fff', border: '1px solid #eee' }}>
            {/* <div>
              <a-button shape="circle" icon="search" type="link" />
            </div> */}
            <a-button-group style={{ display: 'flex', flexDirection: 'column' }}>
              {
                fixedTools.map(tool => (
                  // <a-tooltip effect="dark" placement="left" title={tool.tooltip}>
                  <a-tooltip effect="dark" placement="left" title={this.$t(tool.i18nTooltip)}>
                    <a-button block class="transparent-bg" type="link" size="small" style={{ height: '40px', color: '#000' }} onClick={() => tool.action && tool.action.call(this)} disabled={!!tool.disabled}>
                      {tool.icon ? <i class={['shortcut-icon', 'fa', `fa-${tool.icon}`]} aria-hidden='true' /> : tool.text}
                    </a-button>
                    {tool.icon === 'minus' && <div style={{ fontSize: '12px', textAlign: 'center' }}>{this.scaleRate * 100}%</div>}
                  </a-tooltip>
                ))
              }
            </a-button-group>
          </a-layout-sider>
          <a-layout-sider width="320" theme='light' style={{ background: '#fff', padding: '0 0 0 12px' }}>
            <a-tabs
              style="height: 100%;"
              tabBarGutter={10}
              defaultActiveKey={this.activeTabKey}
              activeKey={this.activeTabKey}
              onChange={this.setActiveTab}
            >
              {/*
                #!zh tab 标题：
                #!en tab title
                  ElementUI：label
                  Ant Design Vue：tab
              */}
              <a-tab-pane key="属性"><span slot="tab">属性</span><RenderPropsEditor /></a-tab-pane>
              <a-tab-pane label="动画" key='动画' tab='动画'><RenderAnimationEditor /></a-tab-pane>
              <a-tab-pane label="动作" key='动作' tab='动作'>{this.activeTabKey === '动作' && <RenderActoionEditor />}</a-tab-pane>
              <a-tab-pane label="脚本" key='脚本' tab='脚本'><RenderScriptEditor /></a-tab-pane>
              <a-tab-pane label="背景" key='background' tab='背景'>{this.activeTabKey === 'background' && <RenderBackgroundEditor />}</a-tab-pane>
              <a-tab-pane label="页面" key="page" tab="页面">{this.activeTabKey === 'page' && <RenderPageManager
                pages={this.pages}
                editingPage={this.editingPage}
                onSelectMenuItem={(menuKey) => {
                  this.pageManager({ type: menuKey })
                }}
                onEditTitle={({ pageIndexForEditingTitle, newTitle }) => {
                  this.pageManager({ type: 'editTitle', value: { pageIndexForEditingTitle, newTitle } })
                  this.saveWork({ isSaveCover: false })
                }}
                onSelectPage={(pageIndex) => { this.setEditingPage(pageIndex) }}
              />}</a-tab-pane>
            </a-tabs>
          </a-layout-sider>

        </a-layout>
        {
          <PreviewDialog
            work={this.work}
            visible={this.previewVisible}
            handleClose={() => { this.previewVisible = false }}
          />
        }
      </a-layout>
    )
  },
  created() {
    // event bus for editor
    window.getEditorApp = this
    let workId = this.$route.params.workId
    if (workId) {
      this.fetchWork(workId).then(() => this.setActiveTab('background'))
    } else {
      // this.$message.error('no work id!')
    }

    window.getEditorApp.$on('setEditingElement', ({ name }) => {
      this.setActiveTab(name === 'lbp-background' ? 'background' : '属性')
    })
  }
}
