import alt from './../lib/alt'

class NavigationActions {

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
