<template>
    <div class="editor-guider">
        <div class="editor-guider-line editor-guider-t" 
        :style="tStyles"
        ></div>
        <div class="editor-guider-line editor-guider-l" 
        :style="lStyles"
        ></div>
        <div class="editor-guider-line editor-guider-b" 
        :style="bStyles"
        ></div>
        <div class="editor-guider-line editor-guider-r" 
        :style="rStyles"
        ></div>
        <div class="editor-guider-line editor-guider-cx" 
        :style="cxStyles"
        ></div>
        <div class="editor-guider-line editor-guider-cy" 
        :style="cyStyles"
        ></div>
    </div>
</template>
<script>
import {getter,
    mitation
} from 'src/design/store';
export default {
    name: 'vx-editor-guider',
    computed:{
        zoom(){
            return getter.zoom();
        },
        guider(){
            return getter.guider();
        },
        // 辅助线top
        tStyles(){
            if(!this.guider.hasOwnProperty('T')) return {}
            let top = this.guider.T;
            return {
                top: top.t&&top.t>0?`${top.t*this.zoom}px`:'0',
                left: top.l&&top.l>0?`${top.l*this.zoom}px`:'0',
                right: top.r&&top.r>0?`${top.r*this.zoom}px`:'0',
                display: 'block'
            }
        },
        // 辅助线left
        lStyles(){
            if(!this.guider.hasOwnProperty('L')) return {}
            let left = this.guider.L;
            return {
                top: left.t&&left.t>0?`${left.t*this.zoom}px`:'0',
                left: left.l&&left.l>0?`${left.l*this.zoom}px`:'0',
                bottom: left.b&&left.b>0?`${left.b*this.zoom}px`:'0',
                display: 'block'
            }
        },
        // 辅助线bottom
        bStyles(){
            if(!this.guider.hasOwnProperty('B')) return {}
            let bottom = this.guider.B;
            return {
                bottom: bottom.b&&bottom.b>0?`${bottom.b*this.zoom}px`:'0',
                left: bottom.l&&bottom.l>0?`${bottom.l*this.zoom}px`:'0',
                right: bottom.r&&bottom.r>0?`${bottom.r*this.zoom}px`:'0',
                display: 'block'
            }
        },
        // 辅助线right
        rStyles(){
            if(!this.guider.hasOwnProperty('R')) return {}
            let right = this.guider.R;
            return {
                right: right.r&&right.r>0?`${right.r*this.zoom}px`:'0',
                top: right.t&&right.t>0?`${right.t*this.zoom}px`:'0',
                bottom: right.b&&right.b>0?`${right.b*this.zoom}px`:'0',
                display: 'block'
            }
        },
        // 辅助线cx
        cxStyles(){
            if(!this.guider.hasOwnProperty('cx')) return {}
            let cx = this.guider.cx;
            return {
                right: 0,
                top: cx.t&&cx.t>0?`${cx.t*this.zoom}px`:'0',
                left: 0,
                display: 'block'
            }
        },
        // 辅助线cy
        cyStyles(){
            if(!this.guider.hasOwnProperty('cy')) return {}
            let cy = this.guider.cy;
            return {
                top: 0,
                left: cy.l&&cy.l>0?`${cy.l*this.zoom}px`:'0',
                bottom: 0,
                display: 'block'
            }
        }
    },
    mounted(){
        window.addEventListener('mouseup', ()=>{
            mitation.setGuider({})
        })
    }
}
</script>