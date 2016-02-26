import alt from './../lib/alt'
import AppActions from './../actions/app_actions'


class AppStore {
  constructor() {
    this.bindListeners({
      handleShowPreview: AppActions.SHOW_PREVIEW,
      handleHidePreview: AppActions.HIDE_PREVIEW,
      handleIsSyncing: AppActions.IS_SYNCING,
      handleSelectItem: AppActions.SELECT_ITEM
    })

    this.state = {
      shouldShowPreview: false,
      selectedItem: {},
      selectedItems: [],
      isSyncingDB: false
    }
  }

  handleShowPreview(item) {
    this.setState({
      shouldShowPreview: true,
      selectedItem: item
    })
  }

  handleHidePreview() {
    this.setState({
      shouldShowPreview: false,
      previewItem: null
    })
  }

  handleIsSyncing(bool) {
    this.setState({
      isSyncingDB: bool
    })
  }

  handleSelectItem(item) {
    this.setState({
      selectedItem: item
    })
  }

}


export default alt.createStore(AppStore, 'AppStore')
