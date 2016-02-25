import _ from 'lodash'
import alt from './../lib/alt'
import Datastore from 'nedb'
import dropbox from './../lib/dropbox'
import { USER_DATA, refreshToken } from './../lib/constants'
import AccountActions from './account_actions'

const db = new Datastore({ filename: `${USER_DATA}/library.db`, autoload: true })


class LibraryActions {

  // Loads the library database
  loadDatabase() {
    return ((dispatch) => {
      db.find({}, (err, library) => {
        if(err) console.log(err)
        else dispatch(_.orderBy(library, 'sortDate', 'desc'))
      })
    })
  }

  // Syncs library with Dropbox
  syncLibrary() {
    return ((dispatch) => {
      let library = []
      let allMedia = []

      db.find({}, (err, dbLibrary) => { library = dbLibrary })
      dropbox.getFileList().then(results => {
        let missingMedia = _.differenceBy(results, library, 'id')
        let promises = dropbox.getAllMedia(missingMedia)
        Promise.all(promises).then((values) => {
          for(let i in values) {
            allMedia.push(values[i])
          }
          db.insert(allMedia, (err, media) => {
            if(err) console.log(err)
            else dispatch(_.orderBy(media, 'sortDate', 'desc'))
          })
        })
      })
    })
  }

  /**
   * Saves the user library to the database after
   * it has been imported
   * @param {Array} importedMedia: the whole user library
   */
  saveAfterImport(importedMedia) {
    return ((dispatch) => {
      db.insert(importedMedia, (err, media) => {
        if(err) console.log(err)
        else dispatch(_.orderBy(media, 'sortDate', 'desc'))
      })
    })
  }

  /**
   * TODO: Create a function that deletes the library db
   * after the user has logged out and logged back in with a different
   * dropbox account.
   */
  deleteLibrary() {
    return false
  }

}


export default alt.createActions(LibraryActions)
