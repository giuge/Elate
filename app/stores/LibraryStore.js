import alt from 'lib/alt'
import _ from 'lodash'
import LibraryActions from 'actions/LibraryActions'


class LibraryStore {
  constructor() {
    this.bindListeners({
      handleLoadDatabase: LibraryActions.LOAD_DATABASE,
      handleSaveAfterImport: LibraryActions.SAVE_AFTER_IMPORT
    })

    this.state = {
      library: [],
      loading: true
    }
  }

  handleLoadDatabase(library) {
    this.setState({
      library: library,
      loading: false
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
