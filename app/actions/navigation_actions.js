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

}


export default alt.createActions(NavigationActions)
