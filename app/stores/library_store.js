import alt from './../lib/alt'
import _ from 'lodash'
import LibraryActions from './../actions/library_actions'


class LibraryStore {
  constructor() {
    this.bindListeners({
      handleLoadDatabase: LibraryActions.LOAD_DATABASE,
      handleSaveAfterImport: LibraryActions.SAVE_AFTER_IMPORT
    })

    this.state = {
      library: []
    }
  }

  handleLoadDatabase(library) {
    this.setState({
      library: library
    })
  }

  handleSaveAfterImport(library) {
    this.setState({
      library: library,
      loading: false
    })
  }

}


export default alt.createStore(LibraryStore, 'LibraryStore')
