# 开发手册

## 开发规范【请按照规范开发和写文档】

1. 组件命名

    * 组件文件名命名使用小驼峰命名
    * 组件`name`属性命名采用`vx-`+文件名的规则 eg.：`vx-xx-xx`
    * 组件导出采用大驼峰命名规则 eg.: `import VxComponentId from '@/comonnents/componentId;`

2. 方法命名规则

    * 采用小驼峰命名规则
    * 以`Handler`结尾
    * eg.:`addTextHandler`

2. 样式`class`命名

    * 采用`xx-xx`命名

3. 变量命名

    * 采用驼峰命名

4. 常量命名

    *采用`CONST_XX`命名

## 画布功能开发

> 画布添加新元素或修改已有元素

1. 修改已有元素

    * 在`./src/canvas/`目录下找到对应的组件
    * 修改组件中对应处理逻辑
    * 修改样式时，在`./src/assets/stylus/canvas.styl`中查找对应样式
    * 数据监听和修改`./src/store/index.js`中定义对应的方法

2. 添加新元素

    * 在`./src/canvas/`目录新建对应元素的组件
    * 定义组件中对应处理逻辑
    * 在`./src/assets/stylus/canvas.styl`中添加对应样式
    * 数据监听和修改`./src/store/index.js`中定义对应的方法
    * 新元素需要实现以下方法
        ```JavaScript
        export default {
            name: "vx-editor-image",
            props:{
                data:{}, // 组件数据
                zoom:{ // 缩放比
                    type: Number,
                    default:0
                },
                index: Number, // 当前组件的位置
                parent: {// 父级组件的位置（当是组合组件中的子元素时有效，其他情况均为-1）
                    type: Number,
                    default: -1
                },
            },
            computed:{
                elementStyles(){
                    let transform = this.data.transform || {a:0,b:0,c:0,tx:0,ty:0}
                    return {}
                },
                mainStyles(){
                    return {}
                },
            },
            methods:{
                hoverHandler(){ // 触发hover
                    this.$emit('event', {
                        index: this.index,
                        type: 'hover',
                        editable: false,
                        parent: this.parent
                    })
                },
                transfromHandler(){// 触发变换
                    this.$emit('event', {
                        index: this.index,
                        type: 'transfrom',
                        editable: false,
                        parent: this.parent
                    })
                },
            }
        }
        ```

## 可能出现的问题

1. 部分事件失灵及事件触发出错
    > 阻止当前组件的事件冒泡