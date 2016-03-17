import alt from './../lib/alt'
import NavigationActions from './../actions/navigation_actions'


class NavigationStore {

  constructor() {
    this.bindListeners({
      onGoBack: NavigationActions.GO_BACK,
      onGoForward: NavigationActions.GO_FORWARD,

      onShowFavorites: NavigationActions.SHOW_FAVORITES,
      onShowAllMedia: NavigationActions.SHOW_ALL_MEDIA,
      onShowAlbums: NavigationActions.SHOW_ALBUMS,
      onShowShare: NavigationActions.SHOW_SHARE,
      onShowAdd: NavigationActions.SHOW_ADD,

      onPreviewItem: NavigationActions.PREVIEW_ITEM,
      onHidePreview: NavigationActions.HIDE_PREVIEW
    })

    this.state = {
      canGoBack: '',
      canGoForward: '',

      showAllMedia: true,
      showFavorites: false,
      showAlbums: false,
      showShare: false,
      showAdd: false,
      previewItem: null
    }
  }


  onShowFavorites() {
    this.setState({
      showFavorites: true,
      showAllMedia: false,
      showAlbums: false,
      showShare: false,
      showAdd: false,
      previewItem: null
    })
  }


  onShowAllMedia() {
    this.setState({
      showAllMedia: true,
      showFavorites: false,
      showAlbums: false,
      showShare: false,
      showAdd: false,
      previewItem: null
    })
  }


  onShowAlbums() {
    this.setState({
      showAlbums: true,
      showAllMedia: false,
      showFavorites: false,
      showShare: false,
      showAdd: false,
      previewItem: null
    })
  }


  onShowShare() {
    this.setBack(this.state)

    this.setState({
      showShare: true,
      showAlbums: false,
      showAllMedia: false,
      showFavorites: false,
      showAdd: false,
      previewItem: null
    })
  }


  onShowAdd() {
    this.setBack(this.state)

    this.setState({
      showAdd: true,
      showAlbums: false,
      showAllMedia: false,
      showFavorites: false,
      showShare: false,
      previewItem: null
    })
  }


  onPreviewItem(previewItem) {
    this.setBack(this.state)
    this.setState({previewItem})
  }


  onHidePreview() {
    this.setState({previewItem: null})
  }


  onGoBack() {
    switch(this.state.canGoBack) {
      case 'showAdd':
        this.onShowAdd()
        this.resetNavigationStack()
        break
      case 'showAlbums':
        this.onShowAlbums()
        this.resetNavigationStack()
        break
      case 'showAllMedia':
        this.onShowAllMedia()
        this.resetNavigationStack()
        break
      case 'showFavorites':
        this.onShowFavorites()
        this.resetNavigationStack()
        break
      case 'showShare':
        this.onShowShare()
        this.resetNavigationStack()
        break
    }
  }


  onGoForward() {}


  setBack(oldState) {
    let oldPage = Object.keys(oldState).filter(x => {
      if(oldState[`${x}`] === true) return x
    })

    this.setState({canGoBack: `${oldPage[0]}`})
  }


  resetNavigationStack() {
    this.setState({
      canGoBack: '',
      canGoForward: ''
    })
  }

}


export default alt.createStore(NavigationStore, 'NavigationStore')
