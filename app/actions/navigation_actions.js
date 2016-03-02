import alt from './../lib/alt'

class NavigationActions {

  // Show the favorites view
  showFavorites() {
    return true
  }

  showAllMedia() {
    return true
  }

}


export default alt.createActions(NavigationActions)
