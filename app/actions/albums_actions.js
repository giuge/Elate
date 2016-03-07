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
        dispatch(albums)
      })
      .catch(err => { throw(err) })
    })
  }

  /**
   * Creates an album
   * @param: {Name} the album name
   * @param: {Array} an array of media
   */
  createAlbum(title, medias) {
    return ((dispatch) => {
      let mediasID = []

      medias.map(media => {
        mediasID.push(media._id)
      })

      let album = {
        title: title,
        items: mediasID,
        cover: medias[0].thumbnail
      }

      db.post(album).then(() => {
        dispatch(album)
      }).catch(err => { throw(err) })

    })

  }

}


export default alt.createActions(AlbumsActions)
