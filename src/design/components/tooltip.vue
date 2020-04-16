<template>
    <div class="vx-once-tooltip" v-if="!first">
        <p>发现更多精品模板，立即点击试试。</p>
        <el-button @click.stop="remove" type="primary">知道了</el-button>
    </div>
</template>
<script>
export default {
    name: 'vx-once-tooltip',
    data(){
        return{
            first: sessionStorage.getItem('first-login')
        }
    },
    mounted(){
        window.addEventListener('click', this.remove)
    },
    methods:{
        remove(){
            this.first = true;
            sessionStorage.setItem('first-login', true);
            window.removeEventListener('click', this.remove)
        }
    }
}
</script>