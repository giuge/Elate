import alt from 'lib/alt'
import AppActions from 'actions/AppActions'


class AppStore {
  constructor() {
    this.bindListeners({
      handleShowPreview: AppActions.SHOW_PREVIEW,
      handleHidePreview: AppActions.HIDE_PREVIEW
    })

    this.state = {
      shoudShowPreview: false,
      item: null
    }
  }

  handleShowPreview(item) {
    this.setState({
      shoudShowPreview: true,
      item: item
    })
  }

  handleHidePreview() {
    this.setState({
      shoudShowPreview: false,
      item: null
    })
  }
}


export default alt.createStore(AppStore, 'AppStore')
