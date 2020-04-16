// import { quillEditor } from 'vue-quill-editor'
import { mapState } from 'vuex'
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import './styles/text-overwrite-quil-snow-theme.scss'
// https://github.com/luban-h5-components/plugin-common-props
import commonProps from '@luban-h5/plugin-common-props'

export default {
  render() {
    const style = {
      position: 'relative',
      color: `${this.color} !important`,
      textDecoration: 'none',
      backgroundColor: this.backgroundColor || 'rgba(255, 255, 255, 0.2)',
      lineHeight: `${this.lineHeight}em`,
      border: `${this.borderWidth}px solid ${this.borderColor}`,
      borderRadius: `${this.borderRadius}px`
    }

    // const pureText = <div domPropsInnerHTML={this.text} class="ql-editor ql-container"></div>
    return (
      <div
        onDblclick={e => {
          this.canEdit = true
          e.stopPropagation()
        }}
        onMousedown={e => {
          if (this.canEdit) { e.stopPropagation() }
        }}
        v-click-outside={() => {
          this.canEdit = false
        }}
        style={style}
      >
        {/* {
          this.canEdit
            ? <quillEditor
              content={this.text}
              options={{
                modules: {
                  // toolbar: '#toolbar-wrapper'
                  toolbar: [
                    ['bold', 'italic', 'underline', 'strike'], // 切换按钮
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    [{ 'color': [] }, { 'background': [] }], // 主题默认下拉，使用主题提供的值
                    [{ 'align': [] }],
                    ['clean'], // 清除格式
                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }]
                    // https://github.com/quilljs/quill/issues/1208
                  ]
                },
                theme: 'snow'
              }}
              onChange={({ html }) => {
                this.$emit('input', {
                  value: html,
                  pluginName: 'vx-text'
                })
              }}>
            </quillEditor>
            : pureText
        } */}
      </div>
    )
  },
  name: 'vx-text',
  data() {
    return {
      canEdit: false,
      innerText: this.text || '双击修改文字'
    }
  },
  props: {
    backgroundColor: commonProps.backgroundColor,
    borderWidth: commonProps.borderWidth,
    borderRadius: commonProps.borderRadius,
    borderColor: commonProps.borderColor,
    text: {
      type: String,
      default: '双击修改文字'
    }
  },
  computed: {
    ...mapState('editor', {
      stateEditingElement: state => state.editingElement
    }),
    editingElement() {
      return this.stateEditingElement
    }
  },
  editorConfig: {
  }
}
