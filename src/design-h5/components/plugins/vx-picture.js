import placeholderImg from './vx-picture-placeholder.png' // issue #34
export default {
  name: 'vx-picture',
  render() {
    return <img src={this.imgSrc || placeholderImg} alt="" srcset="" width="100%" />
  },
  props: {
    imgSrc: {
      type: String,
      default: placeholderImg,
      editor: {
        type: 'lbs-image-gallery',
        label: '图片',
        prop: {
          type: 'textarea'
        }
      }
    }
  },
  data: () => ({
    placeholderImg
  })
}
