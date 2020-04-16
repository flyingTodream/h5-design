import animationMixin from '../../mixins/animation.js'
import VxH5Image from '@/design-h5/components/core/support/canvas/image'
import VxH5Text from '@/design-h5/components/core/support/canvas/text'
import VxH5Map from '@/design-h5/components/core/support/canvas/map'
import VxH5Call from '@/design-h5/components/core/support/canvas/call'
import VxH5Link from '@/design-h5/components/core/support/canvas/link'
export default {
  mixins: [animationMixin],
  props: ['element'],
  computed: {
    commonStyle() {
      return {
        backgroundColor: `${this.element.commonStyle.backgroundColor}`,
        color: `${this.element.commonStyle.color}`,
        fontSize: `${this.element.commonStyle.fontSize}px`,
        height: `${this.element.commonStyle.height}px`,
        left: `${this.element.commonStyle.left}px`,
        position: `${this.element.commonStyle.position}`,
        textAlign: `${this.element.commonStyle.textAlign}`,
        top: `${this.element.commonStyle.top}px`,
        width: `${this.element.commonStyle.width}px`
      }
    }
  },
  data() {
    return {
      preview: true
    }
  },
  mounted() {
    this.runAnimations()
  },
  render() {
    return (
      <div style={this.commonStyle}>

        {
          this.element.name === 'vx-picture' &&
          <VxH5Image element={this.element} />
        }

        {
          this.element.name === 'vx-text' &&
          <VxH5Text element={this.element} />
        }

        {
          this.element.name === 'vx-map' &&
          <VxH5Map preview={this.preview} element={this.element} />
        }
        {
          this.element.name === 'vx-call' &&
          <VxH5Call element={this.element} />
        }
        {
          this.element.name === 'vx-link' &&
          <VxH5Link preview={this.preview} element={this.element} />
        }
      </div>
    )
  }
}
