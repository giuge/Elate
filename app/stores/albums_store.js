import alt from './../lib/alt'
import AlbumsActions from './../actions/albums_actions'


class AlbumsStore {
  constructor() {
    this.bindListeners({
      handleGetAlbums: AlbumsActions.GET_ALBUMS,
    })

    this.state = {
      albums: []
    }
  }

  handleGetAlbums(albums) {
    this.setState({albums})
  }

}


export default alt.createStore(AlbumsStore, 'AlbumsStore')
