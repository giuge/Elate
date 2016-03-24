import alt from './../lib/alt'
import NavigationActions from './../actions/navigation_actions'
import LibraryStore from './library_store'


class NavigationStore {

  constructor() {
    this.bindListeners({
      onGoBack: NavigationActions.GO_BACK,
      onGoForward: NavigationActions.GO_FORWARD,

      onShowFavorites: NavigationActions.SHOW_FAVORITES,
      onShowAllMedia: NavigationActions.SHOW_ALL_MEDIA,
      onShowAlbums: NavigationActions.SHOW_ALBUMS,
      onShowSingleAlbum: NavigationActions.SHOW_SINGLE_ALBUM,
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
      previewItem: null,

      showSingleAlbum: false,
      selectedAlbum: null,
      albumItems: null
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
      previewItem: null,

      showSingleAlbum: false,
      selectedAlbum: null,
      albumItems: null
    })
  }


  onShowSingleAlbum(album) {
    this.setBack(this.state)

    let {library} = LibraryStore.getState()
    let items = library.filter(item => album.items.indexOf(item._id) != -1)

    this.setState({
      showSingleAlbum: true,
      selectedAlbum: album,
      albumItems: items
    })
  }


  onHideSingleAlbum() {
    this.setState({
      showSingleAlbum: false,
      selectedAlbum: null,
      albumItems: null
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
      previewItem: null,

      showSingleAlbum: false,
      selectedAlbum: null,
      albumItems: null
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
    if(this.state.showSingleAlbum) {
      this.setState({
        canGoBack: this.state.canGoBack.filter(x => x != 'showSingleAlbum')
      })
    }
    this.setState({previewItem: null})
  }


  onGoBack() {
    switch(this.state.canGoBack.slice(-1)[0]) {
      case 'showAdd':
        this.onShowAdd()
        this.resetNavigationStack()
        break
      case 'showAlbums':
        this.onShowAlbums()
        this.resetNavigationStack()
        break
      case 'showSingleAlbum':
        this.onHidePreview()
        this.setState({
          canGoBack: this.state.canGoBack.filter(x => x != 'showSingleAlbum')
        })
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
    let oldPages = Object.keys(oldState).filter(x => {
      if(oldState[`${x}`] === true) return x
    })

    this.setState({canGoBack: oldPages})
  }


  resetNavigationStack() {
    this.setState({
      canGoBack: '',
      canGoForward: ''
    })
  }

}


export default alt.createStore(NavigationStore, 'NavigationStore')
