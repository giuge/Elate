import alt from './../lib/alt'
import SelectionActions from './../actions/selection_actions'


class SelectionStore {

  constructor() {
    this.bindListeners({
      onSingleSelectItem: SelectionActions.SINGLE_SELECT_ITEM,
      onSelectItem: SelectionActions.SELECT_ITEM,
      onDeselectItem: SelectionActions.DESELECT_ITEM,
      onClearSelection: SelectionActions.CLEAR_SELECTION
    })

    this.state = {
      selectedItems: []
    }
  }


  onSelectItem(item) {
    if(this.state.selectedItems.indexOf(item) != -1) {
      return this.onDeselectItem(item)
    }

    this.setState({
      selectedItems: this.state.selectedItems.concat(item)
    })
  }


  onSingleSelectItem(selectedItem) {
    this.setState({
      selectedItems: [selectedItem]
    })
  }


  onDeselectItem(item) {
    let index = this.state.selectedItems.indexOf(item)
    this.setState({
      selectedItems: this.state.selectedItems.filter((_, i) => i !== index)
    })
  }


  onClearSelection() {
    this.setState({ selectedItems: []})
  }

}


export default alt.createStore(SelectionStore, 'SelectionStore')
