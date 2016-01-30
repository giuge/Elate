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

  handleGetLibrary(unorderedLibrary) {
    let library = _.union(this.state.library, unorderedLibrary)
    library = _.orderBy(library, 'media.media_info.metadata.time_taken', 'asc')
    this.setState({ library })
  }
}


export default alt.createStore(LibraryStore, 'LibraryStore')
