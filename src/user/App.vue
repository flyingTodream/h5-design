<template  >
  <el-container style="overflow-x:hidden;height:100%;">
    <el-aside ref="aside" style="width:auto;overflow: hidden;">
      <VxAside />
    </el-aside>
    <el-container>
      <div class="vx-user-main">
        <VxUserHeader></VxUserHeader>
        <el-main>
          <router-view />
        </el-main>
      </div>
    </el-container>
  </el-container>
</template>
<script>
const VxAside = () => import('./layout/aside')
const VxUserHeader = () => import('./layout/header')
export default {
  components: {
    VxAside,
    VxUserHeader
  }
}
</script>