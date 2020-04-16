<template>
  <!-- 首页  内容 -->
  <div>
    <VxHead />
    <div class="vx-homePage">
      <!--第一部分 首页 头部 轮播图 -->
      <div class="vx-homePage-swiperFirst">
        <el-carousel :interval="5000" arrow="always">
          <el-carousel-item v-for="(item,index) in imgUrlList" :key="index">
            <img height="100%" class="mallSwiperImg" :src="item.url" alt="轮播图" />
          </el-carousel-item>
        </el-carousel>
      </div>
      <!--第二部分 首页 精选海报模板 -->
      <div class="vx-homePage-modelInfoSecond">
        <!-- 爱友圈编辑器模板图片 -->
        <div class="vx-homePage-modelInfoSecond-left">
          <img
            class="vx-homePage-modelInfoSecond-left-editModelPic"
            src="../../static/images/demo.png"
            alt="爱友圈编辑器模板图片"
          />
        </div>
        <div class="vx-homePage-modelInfoSecond-right">
          <!-- 一分钟快速作图 -->
          <div class="vx-homePage-modelInfoSecond-rightTop">
            <ul>
              <li class="vx-homePage-modelInfoSecond-rightTop-bigsize">一分钟快速作图</li>
              <li class="vx-homePage-modelInfoSecond-rightTop-smallsize">极简在线编辑器，丰富模板，多终端协作</li>
              <li class="vx-homePage-modelInfoSecond-rightTop-bigsize">45,000,000+</li>
              <li class="vx-homePage-modelInfoSecond-rightTop-smallsize">用户选择</li>
              <li class="vx-homePage-modelInfoSecond-rightTop-bigsize">16,280,000+</li>
              <li class="vx-homePage-modelInfoSecond-rightTop-smallsize">作品下载</li>
              <li class="vx-homePage-modelInfoSecond-rightTop-bigsize">3,300+</li>
              <li class="vx-homePage-modelInfoSecond-rightTop-smallsize">每周更新</li>
            </ul>
          </div>
          <!-- 开始制作 操作演示 -->
          <div class="vx-homePage-modelInfoSecond-rightBot">
            <el-button type="primary" @click="jumpPageEdit('/design')">开始制作</el-button>
            <el-button type="primary" @click="jumpPageEditH5('/design-h5')">开始制作动图</el-button>
            <!-- <el-button>操作演示</el-button> -->
          </div>
        </div>
      </div>
      <!--第三部分 首页 一分钟快速作图 -->
      <div id="part" class="vx-homePage-posterTemplateThird">
        <div class="vx-homePage-posterTemplateThird-top">
          <p class="vx-selectedPostersTop">精选海报模板</p>
          <p class="vx-selectedPostersBot">专业设计、海量作品、总有一款属于您</p>
        </div>
        <!-- 第三部分 中间四个模板 -->
        <div class="vx-homePage-posterTemplateThird-center">
          <!-- 四个模板 -->
          <div class="posterTemplate">
            <!-- 模板 -->
            <div
              class="posterTemplateDiv"
              v-for="(item,index) in getHomePageModelList"
              :key="index"
            >
              <div class="posterTemplateDiv-imgModelDiv" @click="goEditHandler(item.id)">
                <img class="posterTemplateDiv-imgModel" :src="item.picUrl" alt="模板图片" />
                <!-- 模板遮罩层  -->
                <div class="posterTemplateMask">
                  <div class="posterTemplateMaskInfo">
                    <div
                      @click.stop="jumpPage('/mall/preview',item.id)"
                      class="vxMaskPreviewCollectDiv"
                    >
                      <div class="vxMaskPreview">
                        <i class="el-icon-view"></i>
                      </div>
                    </div>
                    <div class="vxMaskEdit" @click.stop="goEditHandler(item.id)">
                      <i class="el-icon-edit"></i>点击在线编辑
                    </div>
                  </div>
                </div>
              </div>
              <div class="posterTemplateDiv-nameModelDiv">
                <span class="posterTemplateDiv-nameModel">{{item.name}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="vx-homePage-posterTemplateThird-bot">
          <router-link to="/mall/modelCenter">
            <el-button type="primary">查看更多</el-button>
          </router-link>
        </div>
      </div>
      <!--第四部分 首页 被他们信任-->
      <div id="part" class="vx-homePage-characterIntroductionFourth">
        <div class="vx-homePage-characterIntroductionFourth-top">
          <p class="vx-selectedPostersTop">被他们信任</p>
          <p class="vx-selectedPostersBot">听听他们怎么讲</p>
        </div>
        <div class="vx-homePage-characterIntroductionFourth-bot">
          <!-- 每一个模板 -->
          <div v-for="i in 4" :key="i" class="peopleModel">
            <div class="peopleModelContent">
              <div class="peopleImage">
                <img src="../assets/tx01.png" alt />
              </div>
              <div class="peopleName">可咳咳</div>
              <div class="peoplePosition">
                <div class="peoplePositionDiv">
                  <span>产品经理</span>
                </div>
              </div>
              <div class="vx-home-text-icon"></div>
              <div class="peopleComment">
                我觉得爱友圈是ps
                小白通向美工的一座桥梁，公众号首图、文章配图、
                宣传海报都可以轻松做好。
                真的帮了很大的忙，总是忍不住推荐
                给身边的朋友呢!
              </div>
              <div class="vx-home-text-icon vx-home-text-icon-bottom"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <VxButtom class="vxButtom" />
  </div>
</template>
<script>
import { getHomePageModel, getImageList } from '../api/api'
const VxButtom = () => import('./buttom')
const VxHead = () => import('./head')
export default {
  name: 'vx-homePage',
  data() {
    return {
      imgUrlList: [],
      getHomePageModelList: []
    }
  },
  components: {
    VxButtom,
    VxHead
  },
  methods: {
    // 跳转页面 模板中心 点击查看更多
    jumpPage(page, id) {
      if (id) {
        this.$router.push({
          path: page + '/' + id,
          query: {
            // false 从首页进入预览页 不显示面包屑模板中心
            whereFrom: false
          }
        })
      } else {
        this.$router.push({
          path: page,
          query: {
            id: id
          }
        })
      }
    },
    jumpPageEdit(page) {
      const { href } = this.$router.resolve({
        path: page + '/new'
      })
      window.open(href, '_blank')
    },
    jumpPageEditH5(page) {
      const { href } = this.$router.resolve({
        path: page
      })
      window.open(href, '_blank')
    },
    // 模板 进入编辑器
    goEditHandler(id) {
      const { href } = this.$router.resolve({
        path: '/design/' + id
      })
      window.open(href, '_blank')
    }
  },
  created() {
    // 请求模板数据
    let par = {
      page: 1,
      limit: 4
    }
    getHomePageModel(par).then(res => {
      this.getHomePageModelList = res.data.list
    })

     getImageList().then(res => {
       this.imgUrlList = res.data.banner;
     })
  }
}
</script>
 
