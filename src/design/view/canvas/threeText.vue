<template>
    <div class="editor-element editor-element-three-text"
    :class="{
        'editor-element-editing':editor
    }"
    @mouseup.left="transfromHandler" 
    @mouseover.left="hoverHandler"
    :style="elementStyles"
    >
        <div class="element-main">
            <div class="three-text" @mousemove.stop :style="mainStyles">
                <div v-if="editor" ref="edit" :style="textStyles" :contenteditable="editor"></div>
                <canvas v-else :style="textStyles"></canvas>
            </div>
        </div>
        <i class="border-before"></i>
    </div>
</template>
<script>
export default {
    name: 'vx-editor-three-text',
    props:{
        data:{},
        value: String,
        zoom:{
            type: Number,
            default:0
        },
        index: Number,
        editor: Boolean,
        parent: {
            type: Number,
            default: -1
        },
    },
    computed:{
        elementStyles(){
            let transform = this.data.transform || {a:0,b:0,c:0,tx:0,ty:0}
            return {
                overflow: this.data.hidden?'hidden':'visible',
                transform: `matrix(${transform.a},${transform.b},${transform.c},${transform.d},${transform.tx},${transform.ty})`,
                width: (this.data.width*this.zoom)+'px',
                height: (this.data.height*this.zoom) + 'px',
                top: (this.data.top*this.zoom)+'px',
                left:(this.data.left*this.zoom)+'px',
                opacity: this.data.opacity
            }
        },
        mainStyles(){
            let style = {
                color: this.data.color,
                fontFamily: this.data.fontFamily,
                fontSize: this.data.fontSize+'px',
                letterSpacing: this.data.letterSpacing+'px',
                verticalAlign: this.data.verticalAlign,
                width: '100%',
                height: 'auto',
                minHeight: (this.data.height*this.zoom)+'px'
            }
            if(this.data.textEffects && this.data.textEffects.length > 0){
                let effects = this.data.textEffects;
                let shadow = null, 
                    stroke = null, 
                    filling = null,
                    bgImage = null,
                    bgSize= null,
                    bgRepeat = null,
                    bgClip = null;
                effects.forEach(item => {
                    if(item.filling.enable){
                        if(item.filling.type === 0) filling = `${item.filling.color}`;
                        if(item.filling.type === 1) {
                            let imgInfo = item.filling.imageContent;
                            filling = 'transparent';
                            bgImage = `url(${imgInfo.image})`;
                            bgSize = `${imgInfo.width * imgInfo.scaleX}px ${imgInfo.height * imgInfo.scaleY}px`;
                            bgRepeat = imgInfo.repeat === 1? 'repeat' : null;
                            bgClip = 'text';
                        }
                        if(item.filling.type === 2) {
                            let gradient = item.filling.gradient;
                            filling = 'transparent';
                            let list = [`${gradient.angle+90}deg`];
                            gradient.forEach(item => {
                                list.push(`${item.color} ${item.offset*100}%`);
                            });
                            bgImage = `linear-gradient(${list.join(',')})`;
                        }
                    }else{
                        filling = null;
                        bgImage = null;
                        bgSize = null;
                        bgRepeat = null;
                        bgClip = null;
                    }
                    if(item.shadow.enable){
                        shadow = `${item.shadow.color} ${item.shadow.offsetX}px ${item.shadow.offsetY}px ${item.shadow.blur}px`;
                    }else{
                        shadow = null;
                    }
                    if(item.stroke.enable){
                        stroke = `${item.stroke.width}px ${item.stroke.color}`;
                    }else{
                        stroke = null;
                    }
                });
                if(shadow) style['textShadow'] = shadow;
                if(stroke) style['-webkit-text-stroke'] = stroke;
                if(filling) style['-webkit-text-fill-color'] = filling;
                if(bgSize) style['backgroundSize'] = bgSize;
                if(bgImage) style['backgroundImage'] = bgImage;
                if(bgRepeat) style['backgroundRepeat'] = bgRepeat;
                if(bgClip) style['backgroundClip'] = bgClip;
            }
            return style;
        },
        textStyles(){
            return {
                color: this.data.color,
                fontFamily: this.data.fontFamily,
                fontSize: this.data.fontSize+'px',
                fontStyle: this.data.fontStyle,
                fontWeight: this.data.fontWeight,
                textDecoration: this.data.textDecoration
            }
        }
    },
    methods:{
        hoverHandler(){
            this.$emit('event', {
                index: this.index,
                type: 'hover',
                parent: this.parent
            })
        },
        transfromHandler(){
            this.$emit('event', {
                index: this.index,
                type: 'transfrom',
                parent: this.parent
            })
        },
    },
    watch:{
        editor(val){
            if(!val){
                let el = this.$refs.edit
                this.$emit('input', el.innerText);
            }
        }
    }
}
</script>