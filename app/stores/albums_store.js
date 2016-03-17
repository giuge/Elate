import _ from 'lodash'
import alt from './../lib/alt'
import update from 'react-addons-update'

import LibraryStore from './library_store'
import AlbumsActions from './../actions/albums_actions'


class AlbumsStore {

  constructor() {
    this.bindListeners({
      onGetAlbums: AlbumsActions.GET_ALBUMS,
      onCreateAlbum: AlbumsActions.CREATE_ALBUM,
      onDeleteAlbum: AlbumsActions.DELETE_ALBUM,
      onRemoveFromAlbum: AlbumsActions.REMOVE_FROM_ALBUM,
      onAddToAlbum: AlbumsActions.ADD_TO_ALBUM,
      onShowSingleAlbum: AlbumsActions.SHOW_SINGLE_ALBUM,
      onHideSingleAlbum: AlbumsActions.HIDE_SINGLE_ALBUM
    })

    this.state = {
      albums: [],
      emptyAlbums: false,
      showSingleAlbum: false,
      selectedAlbum: null,
      albumItems: null
    }
  }


  onShowSingleAlbum(album) {
    let {library} = LibraryStore.getState()
    let items = library.filter(item => album.items.indexOf(item._id) != -1)

    this.setState({
      showSingleAlbum: true,
      selectedAlbum: album,
      albumItems: items
    })
  }


  onHideSingleAlbum() {
    this.setState({
      showSingleAlbum: false,
      selectedAlbum: null,
      albumItems: null
    })
  }


  onGetAlbums(albums) {
    let emptyAlbums
    albums.length > 0 ? emptyAlbums = false : emptyAlbums = true

    this.setState({albums, emptyAlbums})
  }


  onCreateAlbum(album) {
    this.setState({
      albums: [...this.state.albums, album],
      emptyAlbums: false
    })
  }


  onDeleteAlbum(album) {
    let index = this.state.albums.indexOf(album)

    this.setState({
      albums: this.state.albums.filter((_, i) => i !== index)
    })

    if(this.state.albums.length <= 0) {
      this.setState({emptyAlbums: true})
    }
  }


  onRemoveFromAlbum(album) {
    let index = _.findIndex(this.state.albums, o => { return o._id === album._id })
    let newAlbums = update(this.state.albums, {$splice: [[index, 1, album]]})

    this.setState({albums: newAlbums})

    if(this.state.selectedAlbum._id == album._id) {
      this.setState({
        selectedAlbum: album,
        albumItems: this.state.albumItems.filter(item => {
          return album.items.indexOf(item._id) !== -1
        })
      })
    }
  }


  onAddToAlbum(album) {
    let index = _.findIndex(this.state.albums, o => { return o._id === album._id })
    let newAlbums = update(this.state.albums, {$splice: [[index, 1, album]]})

    this.setState({
      albums: newAlbums
    })

    this.onShowSingleAlbum(album)
  }

}


export default alt.createStore(AlbumsStore, 'AlbumsStore')
