<template>
    <li class="vx-option" @click="selectHandler" :class="{active:active}">
        <template v-if="$slots.default">
            <slot/>
        </template>
        <span v-else>{{label}}</span>
    </li>
</template>
<script>
export default {
    name: "vx-option",
    props: {
        value: {},
        label: [String, Number]
    },
    computed:{
        active(){
            return this.$parent.selected === this.value;
        }
    },
    mounted(){
        this.$parent.type = typeof(this.value);
    },
    methods:{
        selectHandler(){
            this.$parent.selectHandler(this.value);
        }
    }
}
</script>