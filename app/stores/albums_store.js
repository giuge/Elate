import alt from './../lib/alt'
import update from 'react-addons-update'

import AlbumsActions from './../actions/albums_actions'


class AlbumsStore {
  constructor() {
    this.bindListeners({
      handleGetAlbums: AlbumsActions.GET_ALBUMS,
      handleCreateAlbum: AlbumsActions.CREATE_ALBUM,
      handleDeleteAlbum: AlbumsActions.DELETE_ALBUM,
      handleRemoveFromAlbum: AlbumsActions.REMOVE_FROM_ALBUM
    })

    this.state = {
      albums: [],
      emptyAlbums: false
    }
  }

  handleGetAlbums(albums) {
    let emptyAlbums
    albums.length > 0 ? emptyAlbums = false : emptyAlbums = true

    this.setState({albums, emptyAlbums})
  }

  handleCreateAlbum(album) {
    this.setState({
      albums: this.state.albums.concat(album),
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
    let data = this.state.albums
    let index = data.findIndex((c) => { return c._id == album._id })

    let updatedAlbum = update(data[index], {
      items: {$set: album.items.filter((_, i) => i !== index)}
    })

    let newAlbums = update(data, {
      $splice: [[index, 1, updatedAlbum]]
    })

    this.setState({
      albums: newAlbums
    })
  }

}


export default alt.createStore(AlbumsStore, 'AlbumsStore')
