import alt from './../lib/alt'
import SelectionActions from './../actions/selection_actions'


class SelectionStore {
  constructor() {
    this.bindListeners({
      handleSingleSelectItem: SelectionActions.SINGLE_SELECT_ITEM,
      handleSelectItem: SelectionActions.SELECT_ITEM,
      handleDeselectItem: SelectionActions.DESELECT_ITEM
    })

    this.state = {
      selectedItems: []
    }
  }

  handleSelectItem(item) {
    if(this.state.selectedItems.indexOf(item) != -1) {
      return this.handleDeselectItem(item)
    }

    this.setState({
      selectedItems: this.state.selectedItems.concat(item)
    })
  }

  handleSingleSelectItem(selectedItem) {
    this.setState({
      selectedItems: [selectedItem]
    })
  }

  handleDeselectItem(item) {
    let index = this.state.selectedItems.indexOf(item)
    this.setState({
      selectedItems: this.state.selectedItems.filter((_, i) => i !== index)
    })
  }

}


export default alt.createStore(SelectionStore, 'SelectionStore')
