import alt from './../lib/alt'
import AppActions from './../actions/app_actions'


class AppStore {

  constructor() {
    this.bindListeners({
      handlePreviewItem: AppActions.PREVIEW_ITEM,
      handleHidePreview: AppActions.HIDE_PREVIEW,
      handleIsSyncing: AppActions.IS_SYNCING,
    })

    this.state = {
      previewItem: null,
      isSyncingDB: false
    }
  }


  handlePreviewItem(previewItem) {
    this.setState({previewItem})
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

}


export default alt.createStore(AppStore, 'AppStore')
