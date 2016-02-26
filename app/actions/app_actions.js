import alt from './../lib/alt'

class AppActions {

  /**
   * Sets an item for preview
   * @param {Object} item
   */
  showPreview(item) {
    return item
  }

  isSyncing(bool) {
    return bool
  }

  // Hides the preview
  hidePreview() {
    return true
  }

  /**
   * Selects the media item
   * @param {Object} item
   */
  selectItem(item) {
    return item
  }

}


export default alt.createActions(AppActions)
