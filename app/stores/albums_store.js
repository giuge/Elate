import alt from './../lib/alt'
import AlbumsActions from './../actions/albums_actions'


class AlbumsStore {
  constructor() {
    this.bindListeners({
      handleGetAlbums: AlbumsActions.GET_ALBUMS,
      handleCreateAlbum: AlbumsActions.CREATE_ALBUM
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

}


export default alt.createStore(AlbumsStore, 'AlbumsStore')
