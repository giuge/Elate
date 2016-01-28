import alt from 'lib/alt'
import LibraryActions from 'actions/LibraryActions'


class LibraryStore {
  constructor() {
    this.bindListeners({
      handleGetLibrary: LibraryActions.GET_LIBRARY
    })
    this.state = {
      library: []
    }
  }

  handleGetLibrary(library) {
    this.setState({ library })
  }
}


export default alt.createStore(LibraryStore, 'LibraryStore')
