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
      library: [],
      emptyLibrary: false,
      emptyFavorites: false
    }
  }

  handleLoadDatabase(library) {
    let emptyFavorites = this._checkFavorites(library)
    let emptyLibrary = library.length < 0 ? emptyLibrary = true : emptyLibrary = false

    this.setState({library, emptyFavorites, emptyLibrary})
  }

  handleSaveAfterImport(library) {
    let emptyLibrary = library.length < 0 ? emptyLibrary = true : emptyLibrary = false

    this.setState({library, emptyLibrary})
  }

  handleDeleteMedia(media) {
    let library = _.difference(this.state.library, media)
    let emptyFavorites = this._checkFavorites(library)
    let emptyLibrary = library.length < 0 ? emptyLibrary = true : emptyLibrary = false

    this.setState({library, emptyFavorites, emptyLibrary})
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

    let emptyFavorites = this._checkFavorites(newLibrary)

    this.setState({
      library: newLibrary,
      emptyFavorites: emptyFavorites
    })
  }

  _checkFavorites(library) {
    for(let i in library) {
      if(library[i].isFavorite) {
        return false
      }
    }
    return true
  }

}


export default alt.createStore(LibraryStore, 'LibraryStore')
