<template>
  <div class="vx-keybord">
    <div class="vx-keybord-title">
      <span>快捷键</span>
      <i @click="closePanelHandler" class="el-icon-close"></i>
    </div>
    <ul>
      <li>
        删除
        <span>Backspace / Delete</span>
      </li>
      <li>
        复制
        <span>Ctrl + C</span>
      </li>
      <li>
        剪切
        <span>Ctrl + X</span>
      </li>
      <li>
        粘贴
        <span>Ctrl + V</span>
      </li>
      <li>
        撤销
        <span>Ctrl + Z</span>
      </li>
      <li>
        重做
        <span>Ctrl + Y</span>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'vx-keybord',
  methods: {
    closePanelHandler() {
      this.$emit('close')
    }
  }
}
</script>