import _ from 'lodash'
import update from 'react-addons-update'

import alt from './../lib/alt'
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
      favorites: [],
      emptyLibrary: false,
      emptyFavorites: false
    }
  }

  handleLoadDatabase(library) {
    let favorites = []

    library.forEach((item) => {
      if(item.isFavorite) {
        favorites = favorites.concat(item)
      }
    })

    let emptyFavorites = favorites.length <= 0 ? emptyFavorites = true : emptyFavorites = false
    let emptyLibrary = library.length <= 0 ? emptyLibrary = true : emptyLibrary = false

    this.setState({library, emptyFavorites, emptyLibrary, favorites})
  }

  handleSaveAfterImport(library) {
    let emptyLibrary = library.length <= 0 ? emptyLibrary = true : emptyLibrary = false

    this.setState({library, emptyLibrary})
  }

  handleDeleteMedia(media) {
    let library = _.difference(this.state.library, media)
    let favorites = this.state.favorites

    if(media.isFavorite) {
      favorites = _.difference(this.state.favorites, media)
    }

    let emptyFavorites = favorites.length <= 0 ? emptyFavorites = true : emptyFavorites = false
    let emptyLibrary = library.length <= 0 ? emptyLibrary = true : emptyLibrary = false

    this.setState({library, favorites, emptyLibrary, emptyFavorites})
  }

  handleAddToFavorites(media) {
    let data = this.state.library
    let favorites = []
    let index = data.findIndex((c) => { return c._id == media._id })

    let updatedMedia = update(data[index], {
      isFavorite: {$set: media.isFavorite},
      highResThumbnail: {$set: media.highResThumbnail}
    })

    let newLibrary = update(data, {
      $splice: [[index, 1, updatedMedia]]
    })

    newLibrary.forEach((item) => {
      if(item.isFavorite) {
        favorites = favorites.concat(item)
      }
    })

    let emptyFavorites = favorites.length <= 0 ? emptyFavorites = true : emptyFavorites = false

    this.setState({
      library: newLibrary,
      favorites: favorites,
      emptyFavorites: emptyFavorites
    })
  }

}


export default alt.createStore(LibraryStore, 'LibraryStore')
