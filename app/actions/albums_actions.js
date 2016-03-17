import _ from 'lodash'
import alt from './../lib/alt'
import pdb from 'pouchdb/dist/pouchdb'

pdb.adapter('worker', require('worker-pouch/dist/pouchdb.worker-pouch.min.js'))
const db = new pdb('albums', {adapter: 'worker'})


class AlbumsActions {

  // Get all the albums from the DB
  getAlbums() {
    return (dispatch => {
      db.allDocs({ include_docs: true, attachments: true })
      .then(results => {
        let albums = results.rows.map(row => row.doc)
        dispatch(albums)
      })
      .catch(err => { console.log(err) })
    })
  }


  // Shows the content of an album
  showSingleAlbum(album) {
    return album
  }


  // Doesn't show any album
  hideSingleAlbum() {
    return true
  }


  /**
   * Creates an album
   * @param: {String} the album name
   * @param: {Array} an array of media
   */
  createAlbum(title, medias) {
    return (dispatch => {
      let mediasID = medias.map(media => media._id)

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
    return (dispatch => {
      db.get(album._id).then(doc => {
        db.remove(doc)
        .then(dispatch(album))
        .catch(err => { console.log(err) })
      })
    })
  }


  /**
   * Removes media from an album
   * @param: {Object} the album
   * @param: {Array} an array of media
   */
  removeFromAlbum(album, medias) {
    return (dispatch => {
      let itemsIDs = medias.map(media => media._id)

      db.get(album._id).then(doc => {
        doc.items = _.difference(doc.items, itemsIDs)
        db.put(doc).then(dispatch(doc)).catch(err => { console.log(err) })
      })
    })
  }


  /**
   * Add items to an existing album
   * @param: {Object} the album
   * @param: {Array} an array of media
   */
  addToAlbum(album, medias) {
    return (dispatch => {
      let itemsIDs = medias.map(media => media._id)

      db.get(album._id).then(doc => {
        doc.items = _.union(doc.items, itemsIDs)
        db.put(doc).then(dispatch(doc)).catch(err => { console.log(err) })
      })
    })
  }

}


export default alt.createActions(AlbumsActions)
