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
   * @param: {String} the album name
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

  /**
   * Deletes an album
   * @param: {Object} the album
   */
  deleteAlbum(album) {
    return ((dispatch) => {
      db.remove(album._id, album._rev)
      .then(dispatch(album))
      .catch((err) => {
        throw(err)
      })
    })
  }

  /**
   * Removes media from an album
   * @param: {Object} the album
   * @param: {Array} an array of media
   */
  removeFromAlbum(album, medias) {
    return ((dispatch) => {
      let itemsIDs = []

      for(let i in medias) {
        itemsIDs.push(medias[i]._id)
      }

      let items = _.difference(album.items, itemsIDs)

      db.get(album._id).then((doc) => {
        doc.items = items
        db.put(doc).then(dispatch(doc)).catch(err => { console.log(err) })
      }).catch(err => { console.log(err) })
    })
  }

}


export default alt.createActions(AlbumsActions)
