import alt from 'lib/alt'
import AppActions from 'actions/AppActions'


class AppStore {
  constructor() {
    this.bindListeners({
      handleShowPreview: AppActions.SHOW_PREVIEW,
      handleHidePreview: AppActions.HIDE_PREVIEW,
      handleSelectItem: AppActions.SELECT_ITEM
    })

    this.state = {
      shouldShowPreview: false,
      previewItem: null,
      selectedItem: {},
      selectedItems: []
    }
  }

  handleShowPreview(item) {
    this.setState({
      shouldShowPreview: true,
      previewItem: item
    })
  }

  handleHidePreview() {
    this.setState({
      shouldShowPreview: false,
      previewItem: null
    })
  }

  handleSelectItem(item) {
    this.setState({
      selectedItem: item
    })
  }

}


export default alt.createStore(AppStore, 'AppStore')
