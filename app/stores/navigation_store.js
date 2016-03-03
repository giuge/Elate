import alt from './../lib/alt'
import NavigationActions from './../actions/navigation_actions'


class NavigationStore {
  constructor() {
    this.bindListeners({
      handleShowFavorites: NavigationActions.SHOW_FAVORITES,
      handleShowAllMedia: NavigationActions.SHOW_ALL_MEDIA,
      handleShowAlbums: NavigationActions.SHOW_ALBUMS
    })

    this.state = {
      showAllMedia: true,
      showFavorites: false,
      showAlbums: false
    }
  }

  handleShowFavorites() {
    this.setState({
      showFavorites: true,
      showAllMedia: false,
      showAlbums: false
    })
  }

  handleShowAllMedia() {
    this.setState({
      showAllMedia: true,
      showFavorites: false,
      showAlbums: false
    })
  }

  handleShowAlbums() {
    this.setState({
      showAlbums: true,
      showAllMedia: false,
      showFavorites: false
    })
  }

}


export default alt.createStore(NavigationStore, 'NavigationStore')
