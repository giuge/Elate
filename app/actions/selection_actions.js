import alt from './../lib/alt'


class SelectionActions {

  /**
   * Selects the media item
   * @param {Object} item
   */
  singleSelectItem(item) {
    return item
  }


  /**
   * Selects the media item for multiselection
   * @param {Object} item
   */
  selectItem(item) {
    return item
  }


  /**
   * Selects the media item
   * @param {Object} item
   */
  deselectItem(item) {
    return item
  }


  /**
   * Deselects everything
   * @param {Object} item
   */
  clearSelection() {
    return true
  }

}


export default alt.createActions(SelectionActions)
