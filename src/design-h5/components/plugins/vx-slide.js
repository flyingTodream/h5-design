/*
 * @Author: ly525
 * @Date: 2019-11-23 12:35:21
 * @LastEditors: ly525
 * @LastEditTime: 2019-11-23 19:53:14
 * @FilePath: /luban-h5/front-end/h5/src/components/plugins/vx-slide.js
 * @Github: https://github.com/ly525/luban-h5
 * @Description: #!zh: 轮播图组件 #!en slide component
 * @Copyright 2018 - 2019 luban-h5. All Rights Reserved
 */

// import { Swipe, SwipeItem } from 'vant'
// import 'vant/lib/swipe/style'
// import 'vant/lib/swipe-item/style'

function getDefaultItems() {
  const defaultItems = [
    {
      image: 'https://img.yzcdn.cn/vant/apple-1.jpg'
    },
    {
      image: 'https://img.yzcdn.cn/vant/apple-2.jpg'
    }
  ]

  return defaultItems
}

export default {
  name: 'vx-slide',
  props: {
    interval: {
      type: Boolean,
      default: false
    },
    editorMode: {
      type: String,
      default: 'preview'
    },
    activeIndex: {
      type: Number,
      default: 0,
      editor: {
        custom: true
      }
    },
    items: {
      type: Array,
      default: () => getDefaultItems(),
      editor: {
        custom: true
      }
    }
  },
  componentsForPropsEditor: {
  },
  mounted() {
  },
  methods: {

  },
  render() {
    const { items, activeIndex } = this
    return (
      this.editorMode === 'edit'
        ? items.length && <img src={items[activeIndex].image} />
        : <a-carousel class="vx-slide" autoplay={this.interval}>
          {
            items.map(item => (
              <img src={item.image} height="150px" width="100%" />
            ))
          }
        </a-carousel>
    )
  }
}