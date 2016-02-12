import alt from './../lib/alt'

class AppActions {

  showPreview(item) {
    return item
  }

  hidePreview() {
    return true
  }

  selectItem(item) {
    return item
  }

}


export default alt.createActions(AppActions)
