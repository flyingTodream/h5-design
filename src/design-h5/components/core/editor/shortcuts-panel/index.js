import ShortcutButton from './shortcut-button.vue'
import LoadNpmPlugins from './load-npm-plugins.vue'
// import langMixin from '../../../../mixins/i18n'
export default {
  // mixins: [langMixin],
  props: {
    pluginsList: {
      required: false,
      type: Array,
      default: () => []
    },
    handleClickShortcut: {
      type: Function
    }
  },
  data: () => ({
    npmPackages: []
  }),
  methods: {
    onClickShortcut(item) {
      if (this.handleClickShortcut) {
        this.handleClickShortcut(item)
      }
    }
  },
  render() {
    return (
      <a-row gutter={20}>
        {
          [].concat(this.pluginsList, this.npmPackages).filter(plugin => plugin.visible).map(plugin => (
            <a-col span={12} style={{ marginTop: '10px' }}>
              <ShortcutButton
                clickFn={this.onClickShortcut.bind(this, plugin)}
                item={plugin}
              />
            </a-col>
          ))
        }
        <LoadNpmPlugins onLoadComplete={npmPackages => {
          this.npmPackages = npmPackages
        }} />
      </a-row>
    )
  }
}
