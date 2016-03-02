import alt from './../lib/alt'
import NavigationActions from './../actions/navigation_actions'


class NavigationStore {
  constructor() {
    this.bindListeners({
      handleShowFavorites: NavigationActions.SHOW_FAVORITES,
      handleShowAllMedia: NavigationActions.SHOW_ALL_MEDIA
    })

    this.state = {
      showAllMedia: true,
      showFavorites: false
    }
  }

  handleShowFavorites() {
    this.setState({
      showAllMedia: false,
      showFavorites: true
    })
  }

  handleShowAllMedia() {
    this.setState({
      showAllMedia: true,
      showFavorites: false
    })
  }

}


export default alt.createStore(NavigationStore, 'NavigationStore')
