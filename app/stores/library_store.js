import _ from 'lodash'
import update from 'react-addons-update'

import alt from './../lib/alt'
import LibraryActions from './../actions/library_actions'


class LibraryStore {

  constructor() {
    this.bindListeners({
      onLoadDatabase: LibraryActions.LOAD_DATABASE,
      onSaveAfterImport: LibraryActions.SAVE_AFTER_IMPORT,
      onAddToFavorites: LibraryActions.ADD_TO_FAVORITES,
      onDeleteMedia: LibraryActions.DELETE_MEDIA
    })

    this.state = {
      library: [],
      favorites: [],
      emptyLibrary: false,
      emptyFavorites: false
    }
  }


  onLoadDatabase(library) {
    let favorites = library.filter(x => x.isFavorite === true)
    let emptyFavorites = favorites.length <= 0 ? emptyFavorites = true : emptyFavorites = false
    let emptyLibrary = library.length <= 0 ? emptyLibrary = true : emptyLibrary = false

    this.setState({library, emptyFavorites, emptyLibrary, favorites})
  }


  onSaveAfterImport(library) {
    let emptyLibrary = library.length <= 0 ? emptyLibrary = true : emptyLibrary = false

    this.setState({library, emptyLibrary})
  }


  onDeleteMedia(media) {
    let library = _.difference(this.state.library, media)
    let favorites = this.state.favorites

    if(media.isFavorite) {
      favorites = _.difference(this.state.favorites, media)
    }

    let emptyFavorites = favorites.length <= 0 ? emptyFavorites = true : emptyFavorites = false
    let emptyLibrary = library.length <= 0 ? emptyLibrary = true : emptyLibrary = false

    this.setState({library, favorites, emptyLibrary, emptyFavorites})
  }


  onAddToFavorites(media) {
    let data = this.state.library
    let index = data.findIndex(x => x._id == media._id)

    let updatedMedia = update(data[index], {
      isFavorite: {$set: media.isFavorite},
      highResThumbnail: {$set: media.highResThumbnail}
    })

    let newLibrary = update(data, {
      $splice: [[index, 1, updatedMedia]]
    })

    let favorites = newLibrary.filter(x => x.isFavorite === true)
    let emptyFavorites = favorites.length <= 0 ? emptyFavorites = true : emptyFavorites = false

    this.setState({
      library: newLibrary,
      favorites: favorites,
      emptyFavorites: emptyFavorites
    })
  }

}


export default alt.createStore(LibraryStore, 'LibraryStore')
