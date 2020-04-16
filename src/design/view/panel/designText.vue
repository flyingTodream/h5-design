<template>
  <vx-template class="design-resource-text">
    <template v-slot:label>
      <h2>文字</h2>
    </template>
    <template>
      <div class="design-resource-text__button">
        <button @click="addTextHandler">
          <span>添加文字</span>
        </button>
      </div>
      <div class="design-resource__scroll__content">
        <ul class="design-resource-text__list">
          <li v-for="(item, index) in templateList" :key="index">
            <div class="design-resource-text__list__item" @click="selectHandler(item.id)">
              <img v-lazy="item.typefacePath" />
            </div>
          </li>
        </ul>
        <VxLoading v-if="loading" />
        <p class="nomore-text" v-if="noMore">已全部加载完</p>
        <div id="text-bottom" class="load-bottom"></div>
      </div>
    </template>
  </vx-template>
</template>
<script>
import { mitation, getter } from 'src/design/store'
import VxTemplate from './template'
import { API, log } from 'src/design/utils'

export default {
  name: 'vx-design-text',
  components: {
    VxTemplate
  },
  data() {
    return {
      templateList: [],
      loading: false,
      pageNum: 1,
      totalPages: 2,
      l: 0,
      t: 0
    }
  },
  computed: {
    len() {
      let arr = getter.layout().elements || []
      return arr.length
    },
    noMore() {
      //当起始页数大于总页数时停止加载
      return this.pageNum > this.totalPages
    },
    // disabled() {
    //   return this.loading || this.noMore;
    // },
    left() {
      return this.l
    },
    top() {
      return this.t
    }
  },
  async mounted() {
    await this.scrollData()
    this.getDataHandler()
  },
  methods: {
    scrollData() {
      var Textio = new IntersectionObserver(entries => {
        let item = entries[0] // 拿第一个就行，反正只有一个
        if (item.isIntersecting) {
          if (!this.noMore) {
            this.getDataHandler()
          }
        }
      })
      Textio.observe(document.getElementById('text-bottom'))
    },
    getDataHandler() {
      this.loading = true
      let params = {
        page: this.pageNum, // 当前页
        limit: 10, // 页大小
        type: 'font_element' // 类别id
      }
      this.$axios
        .get(API.EFFECTS_API, { params: params })
        .then(data => {
          this.totalPages = data.data.pages
          this.loading = false
          this.templateList = this.templateList.concat(data.data.list)
          this.pageNum++
        })
        .catch(err => {
          log.danger(err)
        })
    },
    addHandler() {
      this.$emit('select')
      this.$nextTick(() => {
        this.$emit('add', {
          id: this.len - 1,
          type: 'widget'
        })
      })
    },
    addTextHandler() {
      this.setTextPositionHandler()
      mitation.addText({
        type: 'text',
        category: '',
        opacity: 1,
        padding: [0, 0, 0, 0],
        width: 600,
        height: 118,
        left: this.left,
        top: this.top,
        transform: { a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0 },
        boxShadow: null,
        resize: 5,
        dragable: true,
        rotatable: true,
        editable: true,
        frozen: false,
        hidden: false,
        lock: false,
        borderRadius: 0,
        filter: { hueRotate: 0, saturate: 0, brightness: 0, gaussianBlur: 0 },
        color: '#000000ff',
        backgroundColor: null,
        fontFamily: '',
        fontStyle: 'normal',
        fontWeight: 400,
        fontSize: 112,
        lineHeight: 1.2,
        letterSpacing: 31,
        textDecoration: 'none',
        writingMode: 'horizontal-tb',
        textAlign: 'center',
        verticalAlign: 'top',
        contents: null,
        effectScale: 1,
        textShadow: null,
        autoScale: true,
        textEffects: [],
        aggregatedColors: ['rgb(0, 0, 0)'],
        mainColor: null,
        content: '添加文字',
        version: '5.7.0'
      })
      this.addHandler()
    },
    selectHandler(id) {
      let params = {
        id: id
      }
      this.setTextPositionHandler()
      // this.$axios.get(`${API.TEMPLATE_API}/${id}`, {
      this.$axios
        .get(API.EFFECT_DETAIL_API, {
          params
        })
        .then(data => {
          let widget = JSON.parse(data.data.info.detail)
          widget.model.left = this.left
          widget.model.top = this.top
          mitation.addText(widget.model)
          this.addHandler()
        })
        .catch(err => {
          log.danger(err)
        })
    },
    setTextPositionHandler() {
      if (getter.canvasH() - 80 < this.t) {
        this.l += 40
        this.t = 0
      }
      this.t += 40
      if (getter.canvasW() - 80 < this.l) {
        this.t = 0
        this.l = 0
      }
    }
  }
}
</script>