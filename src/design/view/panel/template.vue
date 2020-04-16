<template>
    <div class="design-resource">
        <div class="design-resource__label" v-if="$slots.label"><slot name="label"/></div>
        <div class="design-resource__content"><slot/></div>
    </div>
</template>
<script>
export default {
    name: 'vx-resource'
}
</script>