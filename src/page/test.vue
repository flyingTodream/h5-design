<template>
  <div id="list-complete-demo" class="demo">
    <button v-on:click="shuffle">Shuffle</button>
    <button v-on:click="add">Add</button>
    <button v-on:click="remove">Remove</button>
    <transition-group name="list-complete" tag="p">
      <div
        @click="del(index)"
        v-for="(item,index) in items"
        v-bind:key="item"
        class="list-complete-item"
      >
        {{ item }}
        <el-icon class="el-icon-delete"></el-icon>
      </div>
    </transition-group>
  </div>
</template>
<script>
export default {
  data() {
    return {
      items: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      nextNum: 10
    }
  },
  methods: {
    del(index) {
      this.items.splice(index, 1)
    },
    randomIndex: function() {
      return Math.floor(Math.random() * this.items.length)
    },
    add: function() {
      this.items.splice(this.randomIndex(), 0, this.nextNum++)
    },
    remove: function() {
      this.items.splice(this.randomIndex(), 1)
    },
    shuffle: function() {
      this.items.splice(this.randomIndex(), 1)
    }
  }
}
</script>
<style lang="scss" scoped>
.list-complete-item {
  transition: all 1s;
  display: inline-block;
  margin-right: 10px;
  padding: 10px 30px;
  margin-top: 30px;
  background-color: bisque;
}
.list-complete-enter, .list-complete-leave-to
/* .list-complete-leave-active for below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
.list-complete-leave-active {
  position: absolute;
}
p {
  text-align: center;
}
</style>