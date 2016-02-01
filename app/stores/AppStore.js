import alt from 'lib/alt'
import AppActions from 'actions/AppActions'


class AppStore {
  
  constructor() {
    this.bindListeners({
      handleShowPreview: AppActions.SHOW_PREVIEW,
      handleHidePreview: AppActions.HIDE_PREVIEW,
    })

    this.state = {
      shoudShowPreview: false,
      previewItem: null,
      selectedItems: []
    }
  }

  handleShowPreview(item) {
    this.setState({
      shoudShowPreview: true,
      previewItem: item
    })
  }

  handleHidePreview() {
    this.setState({
      shoudShowPreview: false,
      previewItem: null
    })
  }

}


export default alt.createStore(AppStore, 'AppStore')
