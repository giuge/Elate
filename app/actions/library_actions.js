import _ from 'lodash'
import alt from './../lib/alt'
import jetpack from 'fs-jetpack'
import dropbox from './../lib/dropbox'
import { USER_DATA, refreshToken } from './../lib/constants'
import AccountActions from './account_actions'

import low from 'lowdb'
import storage from 'lowdb/file-async'
const db = low(`${USER_DATA}/library.db`, { storage })


class LibraryActions {

  // Loads the library database
  loadDatabase() {
    return ((dispatch) => {
      jetpack.readAsync(`${USER_DATA}/library.db`, 'json')
      .then((data) => {
        dispatch(_.orderBy(data.library, 'sortDate', 'desc'))
      })
    })
  }

  // Syncs library with Dropbox
  syncLibrary() {
    return ((dispatch) => {
      let library = db.object.library
      let allMedia = []

      dropbox.getFileList().then(results => {
        let missingMedia = _.differenceBy(results, library, 'path_lower')
        let promises = dropbox.getAllMedia(missingMedia)
        Promise.all(promises).then((values) => {
          if (values.length == 0) return false

          for(let i in values) {
            allMedia.push(values[i])
          }

          db.object.library = _.concat(db.object.library, missingMedia)
          db.write()
          this.loadDatabase()
        })
      })

    })

    return false
  }

  /**
   * Saves the user library to the database after
   * it has been imported
   * @param {Array} importedMedia: the whole user library
   */
  saveAfterImport(importedMedia) {
    let dbLibrary = {library: importedMedia}
    db.object = dbLibrary
    db.write()

    return _.orderBy(importedMedia, 'sortDate', 'desc')
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
