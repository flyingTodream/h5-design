<template>
  <!-- 我的收藏组件 -->
  <div
    class="vx-myWorks-warp-makePro"
    :index="index"
    :style="{'width':isCollapse ? '250px':'280px'}"
  >
    <div class="vx-myWorks-warp-makePro-modelPro">
      <div class="vx-myWorks-warp-makePro-modelPro-img">
        <el-image
          ref="lazyImg"
          lazy
          class="vx-lazyLoad"
          :src="item.picUrl"
          :fit="fit"
          :preview-src-list="[item.picUrl]"
        >
          <div slot="placeholder" class="image-slot"></div>
          <div slot="error" class="image-slot">
            <i class="el-icon-picture-outline"></i>
          </div>
        </el-image>
        <!-- </div> -->
      </div>
      <div class="vx-myWorks-warp-makePro-modelPro-message">
        <div :title="item.name" class="vx-myWorks-warp-makePro-modelPro-message-mess">
          <div class="vx-myWorks-warp-makePro-modelPro-title vx-vx-myWorks-tit">
            <span class="titletitle">标题</span>
            <span class="spanName">：{{item.name}}</span>
          </div>
          <div
            :title="item.brief"
            class="vx-myWorks-warp-makePro-modelPro-introduce vx-vx-myWorks-tit"
          >
            <!-- 描述: -->
            <span class="titletitle">介绍</span>
            <span class="spanName">：{{item.brief}}</span>
          </div>
          <div class="vx-myWorks-warp-makePro-modelPro-time vx-vx-myWorks-tit">
            <!-- 时间: -->
            <span class="titletitle">模板价格</span>
            <span class="spanName">：￥{{item.retailPrice}}</span>
          </div>
        </div>
      </div>
    </div>
    <ul class="vx-myWorks-warp-makePro-card-actions">
      <li class="vx-myWorks-warp-makePro-card-actions-li">
        <i @click="design(item.valueId)" class="el-icon-edit"></i>
      </li>
      <li @click="$refs.lazyImg.clickHandler()" class="vx-myWorks-warp-makePro-card-actions-li">
        <i class="el-icon-view"></i>
      </li>
      <li>
        <i class="el-icon-delete" @click="vxDeleteModel(item.type,item.valueId)"></i>
      </li>
    </ul>
  </div>
</template>
<script>
import state from 'src/store'
import { collectDelete } from 'src/api/api'
export default {
  name: 'vx-userollect',
  data() {
    return {
      fit: 'contain'
    }
  },
  computed: {
    isCollapse() {
      return state.state.isCollapse
    }
  },
  methods: {
    design(id) {
      const { href } = this.$router.resolve({
        path: '/design/' + id
      })
      window.open(href, '_blank')
    },
    // 模板的是否收藏
    vxDeleteModel(type, valueId) {
      this.$confirm('此操作将取消收藏该作品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let param = {
            type: type,
            valueId: valueId
          }
          collectDelete(param).then(res => {
            if (res.errno == 0) {
              this.$message({
                message: '取消收藏成功',
                type: 'success',
                duration: 3 * 1000
              })
              this.$emit('delete', this.index)
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  },
  props: {
    item: {
      type: Object
    },
    index: {
      type: Number
    }
  }
}
</script>

