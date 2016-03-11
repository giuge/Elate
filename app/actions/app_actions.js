import alt from './../lib/alt'


class AppActions {

  /**
   * Sets an item for preview
   * @param {Object} item
   */
  previewItem(item) {
    if(item) return item
    else return null
  }


  // Hides the preview
  hidePreview() {
    return true
  }


  // The library is syncing
  isSyncing(bool) {
    return bool
  }

}


export default alt.createActions(AppActions)
