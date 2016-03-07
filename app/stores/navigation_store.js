import alt from './../lib/alt'
import NavigationActions from './../actions/navigation_actions'


class NavigationStore {
  constructor() {
    this.bindListeners({
      handleGoBack: NavigationActions.GO_BACK,
      handleGoForward: NavigationActions.GO_FORWARD,

      handleShowFavorites: NavigationActions.SHOW_FAVORITES,
      handleShowAllMedia: NavigationActions.SHOW_ALL_MEDIA,
      handleShowAlbums: NavigationActions.SHOW_ALBUMS,
      handleShowShare: NavigationActions.SHOW_SHARE,
      handleShowAdd: NavigationActions.SHOW_ADD
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
      showAdd: false
    }

    let inistialNavStack = JSON.parse(JSON.stringify(this.state))
    delete inistialNavStack.navigationStack
    delete inistialNavStack.navigationIndex

    this.state.navigationStack.push(inistialNavStack)
  }

  handleShowFavorites() {
    this.setState({
      showFavorites: true,
      showAllMedia: false,
      showAlbums: false,
      showShare: false,
      showAdd: false
    })
    this._pushToNavigationStack(this.state)
  }

  handleShowAllMedia() {
    this.setState({
      showAllMedia: true,
      showFavorites: false,
      showAlbums: false,
      showShare: false,
      showAdd: false
    })
    this._pushToNavigationStack(this.state)
  }

  handleShowAlbums() {
    this.setState({
      showAlbums: true,
      showAllMedia: false,
      showFavorites: false,
      showShare: false,
      showAdd: false
    })
    this._pushToNavigationStack(this.state)
  }

  handleShowShare() {
    this.setState({
      showShare: true,
      showAlbums: false,
      showAllMedia: false,
      showFavorites: false,
      showAdd: false
    })
    this._pushToNavigationStack(this.state)
  }

  handleShowAdd() {
    this.setState({
      showAdd: true,
      showAlbums: false,
      showAllMedia: false,
      showFavorites: false,
      showShare: false
    })
    this._pushToNavigationStack(this.state)
  }

  handleGoBack() {
    if(this.state.navigationIndex - 1 < 0) return

    let navigationIndex = this.state.navigationIndex - 1
    let {showAdd, showAlbums, showAllMedia, showFavorites, showShare} = this.state.navigationStack[navigationIndex]

    this.setState({navigationIndex, showAdd, showAlbums, showAllMedia, showFavorites, showShare})

    if(this.state.navigationStack[this.state.navigationIndex - 1]) {
      this.setState({canGoBack: true})
    } else { this.setState({canGoBack: false}) }

    if(this.state.navigationStack[this.state.navigationIndex + 1]) {
      this.setState({canGoForward: true})
    } else { this.setState({canGoForward: false}) }
  }

  handleGoForward() {
    if(this.state.navigationIndex + 1 >= this.state.navigationStack.length) return

    let navigationIndex = this.state.navigationIndex + 1
    let {showAdd, showAlbums, showAllMedia, showFavorites, showShare} = this.state.navigationStack[navigationIndex]

    this.setState({navigationIndex, showAdd, showAlbums, showAllMedia, showFavorites, showShare})

    if(this.state.navigationStack[this.state.navigationIndex - 1]) {
      this.setState({canGoBack: true})
    } else { this.setState({canGoBack: false}) }

    if(this.state.navigationStack[this.state.navigationIndex + 1]) {
      this.setState({canGoForward: true})
    } else { this.setState({canGoForward: false}) }
  }

  _pushToNavigationStack(state) {
    let newState = JSON.parse(JSON.stringify(state))
    delete newState.navigationStack
    delete newState.navigationIndex

    this.setState({
      navigationStack: this.state.navigationStack.concat(newState),
      navigationIndex: this.state.navigationIndex += 1
    })

    if(this.state.navigationStack[this.state.navigationIndex - 1]) {
      this.setState({canGoBack: true})
    } else { this.setState({canGoBack: false}) }

    if(this.state.navigationStack[this.state.navigationIndex + 1]) {
      this.setState({canGoForward: true})
    } else { this.setState({canGoForward: false}) }
  }

}


export default alt.createStore(NavigationStore, 'NavigationStore')
