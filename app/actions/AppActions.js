import alt from 'lib/alt'

class AppActions {

  showPreview(item) {
    return item
  }

  hidePreview() {
    return true
  }

}


export default alt.createActions(AppActions)
