import alt from './../lib/alt'

class NavigationActions {

  // Go back in the navigation stack
  goBack() {
    return true
  }

  // Go forward in the navigation stack
  goForward() {
    return true
  }

  // Show the favorites view
  showFavorites() {
    return true
  }

  // Shows the main view
  showAllMedia() {
    return true
  }

  // Shows the album view
  showAlbums() {
    return true
  }

  // Shows the share view
  showShare() {
    return true
  }

  // Shows the add to album view
  showAdd() {
    return true
  }

}


export default alt.createActions(NavigationActions)
