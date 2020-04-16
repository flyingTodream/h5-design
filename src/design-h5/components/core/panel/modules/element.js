import {
    Map,
    Call,
    Font,
    Image,
    Link
} from './props'

class Element {
    constructor(ele) {
        this.name = ele.name
        this.uuid = ele.uuid || + new Date()
        console.log(ele.url)
        switch (ele.name) {
            case 'vx-map':
                this.pluginProps = Map.DefaultPluginProps
                this.commonStyle = Map.DefaultStyle
                break
            case 'vx-call':
                this.pluginProps = Call.DefaultPluginProps
                this.commonStyle = Call.DefaultStyle
                break
            case 'vx-text':
                this.pluginProps = Font.DefaultPluginProps
                this.commonStyle = Font.DefaultStyle
                break
            case 'vx-picture':
                this.pluginProps = Image.DefaultPluginProps
                this.commonStyle = Image.DefaultStyle
                this.pluginProps = {
                    ...this.pluginProps,
                    imgSrc: ele.url
                }
                break
            case 'vx-link':
                this.pluginProps = Link.DefaultPluginProps
                this.commonStyle = Link.DefaultStyle
                break
            case 'vx-form':
                this.pluginProps = Link.DefaultPluginProps
                this.commonStyle = Link.DefaultStyle
                break
        }

        this.events = []
        this.animations = ele.animations || []
    }
}
export default Element