<template>
  <vx-template class="design-resource-template">
    <template v-slot:label>
      <vx-icon name="menu" />
      <h2>模板</h2>
    </template>
    <template>
      <el-input
        size="large"
        class="design-resource-templet__input__search"
        placeholder="搜索模板"
        prefix-icon="el-icon-search"
        v-model="query"
        @focus="focusHandler"
        @keyup.enter.native="searchHandler"
        @change="inputHandler"
        @blur="searchHandler"
      />
      <div class="design-resource__scroll__content">
        <div class="design-resource__scroll__waterfall">
          <ul class="design-resource-templet__list">
            <li
              class="design-resource-templet__list__item"
              v-for="(item, index) in templateList[1]"
              :key="index"
              :style="{'height':width*getQueryVariable('height',item.picUrl)/getQueryVariable('width',item.picUrl)+'px',
              }"
              @click="selectHandler(item.id)"
            >
              <div
                :style="{'backgroundColor':getQueryVariable('color',item.picUrl),
              'width':'100%','height':'100%','borderRadius':'4px'}"
              >
                <img v-lazy="item.picUrl" />
              </div>
            </li>
          </ul>
          <ul ref="list" class="design-resource-templet__list">
            <li
              class="design-resource-templet__list__item"
              v-for="(item, index) in templateList[0]"
              :key="index"
              :style="{'height':width*getQueryVariable('height',item.picUrl)/getQueryVariable('width',item.picUrl)+'px',
             }"
              @click="selectHandler(item.id)"
            >
              <div
                :style="{'backgroundColor':getQueryVariable('color',item.picUrl),
              'width':'100%','height':'100%','borderRadius':'4px'}"
              >
                <img v-lazy="item.picUrl" />
              </div>
            </li>
          </ul>
        </div>
        <VxLoading v-if="loading" />
        <p class="nomore-text" v-if="noMore">已全部加载完</p>
        <div id="template-bottom" class="load-bottom"></div>
      </div>
    </template>
  </vx-template>
</template>
<script>
import { mitation } from 'src/design/store'
import VxTemplate from './template'
import { API, log, mixin } from 'src/design/utils'

export default {
  name: 'vx-design-template',
  mixins: [mixin],
  components: {
    VxTemplate
  },
  data() {
    return {
      query: '',
      templateList: [[], []],
      loading: true,
      pageNum: 1,
      totalPages: 2,
      search: false,
      width: 150,
      h1: 0,
      h2: 0
    }
  },
  computed: {
    noMore() {
      //当起始页数大于总页数时停止加载
      return this.pageNum > this.totalPages
    }
  },
  async mounted() {
    await this.scrollData()
    this.getDataHandler()
  },
  methods: {
    getQueryVariable(variable, url) {
      let num = url.lastIndexOf('?')
      var query = url.substring(num + 1, url.length)
      var vars = query.split('&')
      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=')
        if (pair[0] == variable) {
          return pair[1]
        }
      }
      return false
    },
    focusHandler() {
      mitation.updateCurrentEdit(true)
    },
    scrollData() {
      var io = new IntersectionObserver(entries => {
        let item = entries[0] // 拿第一个就行，反正只有一个
        if (item.isIntersecting) {
          if (!this.noMore) {
            this.getDataHandler()
          }
        }
      })
      io.observe(document.getElementById('template-bottom'))
    },
    inputHandler() {
      this.search = true
    },
    searchHandler() {
      mitation.updateCurrentEdit(false)
      if (this.search) {
        this.pageNum = 1
        this.templateList = [[], []]
        this.h1 = this.h2 = 0
        this.getDataHandler()
        this.search = false
      }
    },
    getDataHandler() {
      this.loading = true
      let params = {
        page: this.pageNum, // 当前页
        limit: 20, // 页大小
        category_id: 0, // 类别id
        keyword: this.query, // 搜索
        sort: '' // 排序
      }
      this.$axios
        .get(API.SEARCH_API, { params })
        .then(data => {
          this.totalPages = data.data.pages
          this.loading = false
          data.data.list.map(element => {
            let h =
              (this.width * this.getQueryVariable('height', element.picUrl)) /
              this.getQueryVariable('width', element.picUrl)
            if (this.h1 >= this.h2) {
              this.h2 = this.h2 + h
              this.templateList[1].push(element)
            } else {
              this.h1 = this.h1 + h
              this.templateList[0].push(element)
            }
          })

          // this.templateList[0] = this.templateList[0].concat(data.data.list)
          this.pageNum++
        })
        .catch(err => {
          log.danger(err)
        })
    },
    selectHandler(id) {
      this.$axios
        .get(API.TEMPLATE_API, {
          params: {
            id: id,
            type: 'template'
          }
        })
        .then(data => {
          mitation.setTemplate(JSON.parse(data.data.info.detail), id)
          mitation.setTitle(data.data.info.name)
          this.$emit('select')
          this.adaptScreen()
        })
        .catch(err => {
          log.danger(err)
        })
    }
  }
}
</script>