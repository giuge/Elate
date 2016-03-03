import _ from 'lodash'
import alt from './../lib/alt'
import pdb from 'pouchdb/dist/pouchdb'

const db = new pdb('albums', { adapter: 'websql' })


class AlbumsActions {

  // Get all the albums
  getAlbums() {
    return ((dispatch) => {
      db.allDocs({ include_docs: true, attachments: true })
      .then((results) => {
        let albums = []
        results.rows.map((row) => { albums.push(row.doc) })
        dispatch(_.orderBy(albums, 'sortDate', 'desc'))
      })
      .catch((err) => { throw(err) })
    })
  }

  /**
   * Creates an album
   * @param: {Name} the album name
   * @param: {Array} an array of media
   */
  createAlbum(name, medias) {
    return
  }

}


export default alt.createActions(AlbumsActions)
