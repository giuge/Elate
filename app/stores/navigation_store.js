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
      navigationStack: [],
      navigationIndex: 0,
      canGoBack: false,
      canGoForward: false,

      showAllMedia: true,
      showFavorites: false,
      showAlbums: false,
      showShare: false,
      showAdd: false,
      previewItem: null
    }

    let inistialNavStack = JSON.parse(JSON.stringify(this.state))
    delete inistialNavStack.navigationStack
    delete inistialNavStack.navigationIndex

    this.state.navigationStack.push(inistialNavStack)
  }


  onShowFavorites() {
    this.setState({
      showFavorites: true,
      showAllMedia: false,
      showAlbums: false,
      showShare: false,
      showAdd: false
    })
    this._pushToNavigationStack(this.state)
  }


  onShowAllMedia() {
    this.setState({
      showAllMedia: true,
      showFavorites: false,
      showAlbums: false,
      showShare: false,
      showAdd: false
    })
    this._pushToNavigationStack(this.state)
  }


  onShowAlbums() {
    this.setState({
      showAlbums: true,
      showAllMedia: false,
      showFavorites: false,
      showShare: false,
      showAdd: false
    })
    this._pushToNavigationStack(this.state)
  }


  onShowShare() {
    this.setState({
      showShare: true,
      showAlbums: false,
      showAllMedia: false,
      showFavorites: false,
      showAdd: false
    })
  }


  onShowAdd() {
    this.setState({
      showAdd: true,
      showAlbums: false,
      showAllMedia: false,
      showFavorites: false,
      showShare: false
    })
  }


  onGoBack() {
    if(this.state.navigationIndex - 1 < 0) return

    let navigationIndex = this.state.navigationIndex - 1
    let {showAdd, showAlbums, showAllMedia, showFavorites, showShare} = this.state.navigationStack[navigationIndex]

    this.setState({navigationIndex, showAdd, showAlbums, showAllMedia, showFavorites, showShare})
    this._checkBackForward(this.state.navigationStack, this.state.navigationIndex)
  }


  onGoForward() {
    if(this.state.navigationIndex + 1 >= this.state.navigationStack.length) return

    let navigationIndex = this.state.navigationIndex + 1
    let {showAdd, showAlbums, showAllMedia, showFavorites, showShare} = this.state.navigationStack[navigationIndex]

    this.setState({navigationIndex, showAdd, showAlbums, showAllMedia, showFavorites, showShare})
    this._checkBackForward(this.state.navigationStack, this.state.navigationIndex)
  }


  onPreviewItem(previewItem) {
    this.setState({previewItem})
  }

  onHidePreview() {
    this.setState({previewItem: null})
  }


  _pushToNavigationStack(state) {
    let newState = JSON.parse(JSON.stringify(state))
    delete newState.navigationStack
    delete newState.navigationIndex

    this.setState({
      navigationStack: this.state.navigationStack.concat(newState),
      navigationIndex: this.state.navigationIndex += 1
    })

    this._checkBackForward(this.state.navigationStack, this.state.navigationIndex)
  }


  _checkBackForward(stack, index) {
    if(stack[index - 1]) {
      this.setState({canGoBack: true})
    } else { this.setState({canGoBack: false}) }

    if(stack[index + 1]) {
      this.setState({canGoForward: true})
    } else { this.setState({canGoForward: false}) }
  }

}


export default alt.createStore(NavigationStore, 'NavigationStore')
