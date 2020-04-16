<template>
    <i :aria-label="title" :class="{
            'btn-tip':title
        }">
        <svg class="vx" aria-hidden="true" :style="styles">
            <use :xlink:href="href"></use>
        </svg>
    </i>
</template>
<script>
export default {
    name: 'vx-icon',
    props:{
        name: String,
        title: String,
        size: Number
    },
    computed:{
        href(){
            return `#vx-${this.name}`
        },
        styles(){
            return {
                width: `${this.size}px`,
                height: `${this.size}px`
            }
        },
    }
}
</script>