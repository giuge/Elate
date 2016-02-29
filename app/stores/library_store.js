import alt from './../lib/alt'
import _ from 'lodash'
import LibraryActions from './../actions/library_actions'


class LibraryStore {
  constructor() {
    this.bindListeners({
      handleLoadDatabase: LibraryActions.LOAD_DATABASE,
      handleSaveAfterImport: LibraryActions.SAVE_AFTER_IMPORT,
      handleDeleteMedia: LibraryActions.DELETE_MEDIA
    })

    this.state = {
      library: []
    }
  }

  handleLoadDatabase(library) {
    this.setState({library})
  }

  handleSaveAfterImport(library) {
    this.setState({library})
  }

  handleDeleteMedia(media) {
    this.setState({
      library: _.difference(this.state.library, media)
    })
  }

}


export default alt.createStore(LibraryStore, 'LibraryStore')
