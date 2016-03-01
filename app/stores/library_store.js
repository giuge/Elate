import alt from './../lib/alt'
import _ from 'lodash'
import update from 'react-addons-update'
import LibraryActions from './../actions/library_actions'


class LibraryStore {
  constructor() {
    this.bindListeners({
      handleLoadDatabase: LibraryActions.LOAD_DATABASE,
      handleSaveAfterImport: LibraryActions.SAVE_AFTER_IMPORT,
      handleAddToFavorites: LibraryActions.ADD_TO_FAVORITES,
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

  handleAddToFavorites(media) {
    let data = this.state.library
    let index = data.findIndex((c) => { return c._id == media._id })

    let updatedMedia = update(data[index], {
      isFavorite: {$set: media.isFavorite},
      highResThumbnail: {$set: media.highResThumbnail}
    })

    let newLibrary = update(data, {
      $splice: [[index, 1, updatedMedia]]
    })

    this.setState({library: newLibrary})
  }

}


export default alt.createStore(LibraryStore, 'LibraryStore')
