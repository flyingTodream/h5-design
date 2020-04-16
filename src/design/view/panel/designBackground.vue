<template>
  <vx-template class="design-resource-background">
    <template v-slot:label>
      <!-- <vx-icon name="menu" /> -->
      <h2>背景</h2>
      <span class="reset-bg" v-show="isBgChanged" @click="resetBgInfoHandler">恢复原始背景</span>
    </template>
    <template>
      <div class="design-resource__scroll__content">
        <div class="design-resource-bg__category">
          <ul class="design-resource-bg__list">
            <li class="design-resource-bg__item">
              <div
                @click.self="isShow = !isShow"
                class="design-resource-bg__item__color design-resource-bg__item__color--bg"
              >
                <vx-color v-model="isShow" @select="setBgColor" />
              </div>
            </li>
            <li
              class="design-resource-bg__item"
              v-for="(item, index) in bgColorList"
              :key="index"
              :aria-label="item.name"
              :class="{'btn-tip': item.tip}"
            >
              <div
                class="design-resource-bg__item__color"
                :class="{
                                    'design-resource-bg__item__border': item.border,
                                    'design-resource-bg__item__bg-img': item.bg
                                }"
                :style="{backgroundColor: item.color}"
                @click.self="setBgColor(item.color)"
              ></div>
            </li>
          </ul>
        </div>
        <div class="design-resource-bg__category">
          <ul class="design-resource-bg__list">
            <li
              class="design-resource-bg__list__item design-resource-bg__list__item-hover"
              v-for="(item, index) in templateList"
              :key="index"
              @click="setBgImg(item.id)"
            >
              <img v-lazy="item.typefacePath" />
            </li>
          </ul>
        </div>
        <VxLoading v-if="loading" />
        <p class="nomore-text" v-if="noMore">已全部加载完</p>
        <div id="background-bottom" class="load-bottom"></div>
      </div>
      <!-- </vx-loadmore> -->
    </template>
  </vx-template>
</template>

<script>
import { mitation, getter } from 'src/design/store'
import { API, log } from 'src/design/utils'
import VxTemplate from './template'
import VxColor from './color'
export default {
  name: 'vx-design-background',
  components: {
    VxTemplate,
    VxColor
  },
  data() {
    return {
      templateList: [],
      loading: true,
      // noMore: false,
      pageNum: 1,
      totalPages: 2,
      l: 0,
      t: 0,

      isShow: false,
      bgColorList: [
        {
          color: '#000',
          name: '黑色'
        },
        {
          color: '#999',
          name: '灰色'
        },
        {
          color: '#ccc',
          name: '浅灰色'
        },
        {
          color: '#fff',
          name: '白色',
          border: true
        },
        {
          color: '#00000000',
          name: '透明色',
          border: true,
          bg: true,
          tip: true
        },
        {
          color: '#e65353',
          name: '红色'
        },
        {
          color: '#ffd835',
          name: '黄色'
        },
        {
          color: '#70bc59',
          name: '绿色'
        },
        {
          color: '#50E3C2',
          name: '青色'
        },
        {
          color: '#607af4',
          name: '蓝色'
        },
        {
          color: '#976bee',
          name: '紫色'
        }
      ]
    }
  },
  computed: {
    noMore() {
      //当起始页数大于总页数时停止加载
      return this.pageNum > this.totalPages
    },
    isBgChanged() {
      return getter.bgIsInit()
    }
  },
  async mounted() {
    await this.scrollData()
    this.getDataHandler()
  },
  methods: {
    scrollData() {
      var io = new IntersectionObserver(entries => {
        let item = entries[0] // 拿第一个就行，反正只有一个
        if (item.isIntersecting) {
          if (!this.noMore) {
            this.getDataHandler()
          }
        }
      })
      io.observe(document.getElementById('background-bottom'))
    },
    getDataHandler() {
      this.loading = true
      let params = {
        page: this.pageNum, // 当前页
        limit: 25, // 页大小
        type: 'bg'
      }
      this.$axios
        .get(API.EFFECTS_API, { params })
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
    // 重置背景信息
    resetBgInfoHandler() {
      mitation.resetBgInfo()
    },
    // 设置背景颜色
    setBgColor(color) {
      mitation.setBgColor(color)
    },
    setBgImg(id) {
      let params = {
        id: id
      }
      this.$axios
        .get(API.EFFECT_DETAIL_API, { params })
        .then(data => {
          mitation.setBgImg(data.data.info.detail)
          this.$emit('select')
        })
        .catch(err => {
          log.danger(err)
        })
    }
  }
}
</script>