import alt from './../lib/alt'
import NavigationActions from './../actions/navigation_actions'


class NavigationStore {
  constructor() {
    this.bindListeners({
      handleShowFavorites: NavigationActions.SHOW_FAVORITES,
      handleShowAllMedia: NavigationActions.SHOW_ALL_MEDIA,
      handleShowAlbums: NavigationActions.SHOW_ALBUMS,
      handleShowShare: NavigationActions.SHOW_SHARE,
      handleShowAdd: NavigationActions.SHOW_ADD
    })

    this.state = {
      showAllMedia: true,
      showFavorites: false,
      showAlbums: false,
      showShare: false,
      showAdd: false
    }
  }

  handleShowFavorites() {
    this.setState({
      showFavorites: true,
      showAllMedia: false,
      showAlbums: false,
      showShare: false,
      showAdd: false
    })
  }

  handleShowAllMedia() {
    this.setState({
      showAllMedia: true,
      showFavorites: false,
      showAlbums: false,
      showShare: false,
      showAdd: false
    })
  }

  handleShowAlbums() {
    this.setState({
      showAlbums: true,
      showAllMedia: false,
      showFavorites: false,
      showShare: false,
      showAdd: false
    })
  }

  handleShowShare() {
    this.setState({
      showShare: true,
      showAlbums: false,
      showAllMedia: false,
      showFavorites: false,
      showAdd: false
    })
  }

  handleShowAdd() {
    this.setState({
      showAdd: true,
      showAlbums: false,
      showAllMedia: false,
      showFavorites: false,
      showShare: false
    })
  }

}


export default alt.createStore(NavigationStore, 'NavigationStore')
