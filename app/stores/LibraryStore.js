import alt from 'lib/alt'
import _ from 'lodash'

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
    library = _.orderBy(library, 'sortDate', 'desc')
    console.log(library)
    this.setState({ library })
  }
}


export default alt.createStore(LibraryStore, 'LibraryStore')
