<template>
  <!-- 我的作品模板 -->

  <div
    :index="index"
    class="vx-myWorks-warp-makePro"
    :style="{'width':isCollapse ? '250px':'280px'}"
  >
    <div class="vx-myWorks-warp-makePro-modelPro">
      <div class="vx-myWorks-warp-makePro-modelPro-img">
        <el-image
          fit="contain"
          ref="lazyImg"
          lazy
          class="vx-lazyLoad"
          :src="item.picUrl"
          :preview-src-list="[item.picUrl]"
        >
          <div slot="placeholder" class="image-slot"></div>
          <div slot="error" class="image-slot">
            <i class="el-icon-picture-outline"></i>
          </div>
        </el-image>
      </div>
      <div class="vx-myWorks-warp-makePro-modelPro-message">
        <div class="vx-myWorks-warp-makePro-modelPro-message-mess">
          <div class="vx-myWorks-warp-makePro-modelPro-title vx-vx-myWorks-tit">
            <span class="titletitle">标题</span>
            <span>：{{item.name}}</span>
          </div>
          <div class="vx-myWorks-warp-makePro-modelPro-introduce vx-vx-myWorks-tit">
            <!-- 添加时间: -->
            <span class="titletitle">添加时间</span>
            <span>：{{item.addTime}}</span>
          </div>
          <div class="vx-myWorks-warp-makePro-modelPro-time vx-vx-myWorks-tit">
            <!-- 时间: -->
            <span class="titletitle">修改时间</span>
            <span>：{{item.updateTime}}</span>
          </div>
        </div>
      </div>
    </div>
    <ul class="vx-myWorks-warp-makePro-card-actions">
      <li class="vx-myWorks-warp-makePro-card-actions-li">
        <!-- 从我的作品 跳转到 编辑器 传入的是 id -->
        <i @click="design(item.id)" class="el-icon-edit"></i>
      </li>
      <li @click="$refs.lazyImg.clickHandler()" class="vx-myWorks-warp-makePro-card-actions-li">
        <i class="el-icon-view"></i>
      </li>
      <li>
        <i class="el-icon-delete" @click="vxDeleteModel(item.id)"></i>
      </li>
    </ul>
  </div>
</template>

<script>
import state from 'src/store'
import { userCenterListDelete } from 'src/api/api'
export default {
  name: 'vx-myWorks',
  computed: {
    isCollapse() {
      return state.state.isCollapse
    }
  },
  methods: {
    design(id) {
      const { href } = this.$router.resolve({
        path: '/design/' + id,
        query: {
          designModel: 'user'
        }
      })
      window.open(href, '_blank')
    },
    vxDeleteModel(id) {
      this.$confirm('此操作将永久删除该作品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        userCenterListDelete(id).then(res => {
          if (res.errno == 0) {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 3 * 1000
            })
            this.$emit('delete', this.index)
          }
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
