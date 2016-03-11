import _ from 'lodash'
import alt from './../lib/alt'
import update from 'react-addons-update'

import LibraryStore from './library_store'
import AlbumsActions from './../actions/albums_actions'


class AlbumsStore {

  constructor() {
    this.bindListeners({
      handleGetAlbums: AlbumsActions.GET_ALBUMS,
      handleCreateAlbum: AlbumsActions.CREATE_ALBUM,
      handleDeleteAlbum: AlbumsActions.DELETE_ALBUM,
      handleRemoveFromAlbum: AlbumsActions.REMOVE_FROM_ALBUM,
      handleShowSingleAlbum: AlbumsActions.SHOW_SINGLE_ALBUM,
      handleHideSingleAlbum: AlbumsActions.HIDE_SINGLE_ALBUM
    })

    this.state = {
      albums: [],
      emptyAlbums: false,
      showSingleAlbum: false,
      selectedAlbum: null,
      albumItems: null
    }
  }


  handleShowSingleAlbum(album) {
    let {library} = LibraryStore.getState()
    let items = []

    library.forEach(item => {
      for(let i in album.items) {
        if(item._id == album.items[i])
        items.push(item)
      }
    })

    this.setState({
      showSingleAlbum: true,
      selectedAlbum: album,
      albumItems: items
    })
  }


  handleHideSingleAlbum() {
    this.setState({
      showSingleAlbum: false,
      selectedAlbum: null,
      albumItems: null
    })
  }


  handleGetAlbums(albums) {
    let emptyAlbums
    albums.length > 0 ? emptyAlbums = false : emptyAlbums = true

    this.setState({albums, emptyAlbums})
  }


  handleCreateAlbum(album) {
    this.setState({
      albums: [...this.state.albums, album],
      emptyAlbums: false
    })
  }


  handleDeleteAlbum(album) {
    let index = this.state.albums.indexOf(album)

    this.setState({
      albums: this.state.albums.filter((_, i) => i !== index)
    })

    if(this.state.albums.length <= 0) {
      this.setState({emptyAlbums: true})
    }
  }


  handleRemoveFromAlbum(album) {
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

}


export default alt.createStore(AlbumsStore, 'AlbumsStore')
