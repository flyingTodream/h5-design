<template>
  <div class="vx-upload">
    <div @click="uploadHandler" class="vx-upload-button">上传图片</div>
  </div>
</template>
<script>
import { log } from 'src/design/utils'
import { mitation } from 'src/design/store'
export default {
  name: 'vx-upload',
  methods: {
    uploadHandler() {
      this.$upload()
        .then(data => {
          let image = this.initImage()
          image.url = data.url
          image.imageUrl = data.url
          mitation.addImage(image)
        })
        .catch(err => {
          log.danger(err)
        })
    },
    initImage() {
      return {
        type: 'image',
        category: '',
        opacity: 1,
        padding: [0, 0, 0, 0],
        width: 500,
        height: 500,
        left: 10,
        top: 10,
        transform: {
          a: 1,
          b: 0,
          c: 0,
          d: 1,
          tx: 0,
          ty: 0
        },
        boxShadow: null,
        resize: 1,
        dragable: false,
        rotatable: false,
        editable: true,
        frozen: false,
        hidden: false,
        lock: false,
        borderRadius: 0,
        filter: {
          hueRotate: 0,
          saturate: 0,
          brightness: 0,
          gaussianBlur: 0
        },
        image: null,
        clip: {
          bottom: 0,
          right: 0,
          left: 0,
          top: 0
        },
        url: '',
        mask: '',
        imageUrl: '',
        imageTransform: {
          a: 1,
          b: 0,
          c: 0,
          d: 1,
          tx: -162.7930174563591,
          ty: -165.18703241895264
        },
        imageWidth: 558.4039900249377,
        imageHeight: 563.1920199501247,
        originWidth: 0,
        originHeight: 0,
        effectedImage: '',
        effectedImageWidth: 233.41645885286783,
        effectedImageHeight: 233.41645885286783,
        effectedImageOffsetLeft: 0,
        effectedImageOffsetTop: 0,
        aggregatedColors: [],
        mainColor: null,
        effectScale: 1,
        imageEffects: [],
        version: '5.7.0',
        filterInfo: {
          id: -1,
          zipUrl: '',
          prunedZipUrl: '',
          strong: 0.8
        }
      }
    }
  }
}
</script>