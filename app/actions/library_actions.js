import _ from 'lodash'
import alt from './../lib/alt'
import Datastore from 'nedb'
import dropbox from './../lib/dropbox'
import { USER_DATA } from './../lib/constants'
import AccountActions from './account_actions'

const db = new Datastore({ filename: `${USER_DATA}/library.db`, autoload: true })


class LibraryActions {

  /* Loads the library database */
  loadDatabase() {
    return ((dispatch) => {
      db.find({}, (err, library) => {
        if(err) console.log(err)
        library = _.orderBy(library, 'sortDate', 'desc')
        dispatch(library)
      })
    })
  }

  /* Imports library from Dropbox */
  importLibrary() {
    let library = []
    let allMedia = []

    dropbox.getFileList().then(results => {
      let promises = dropbox.getAllMedia(results)
      Promise.all(promises).then((values) => {
        for(let i in values) {
          allMedia.push(values[i])
        }
        AccountActions.hasImportedLibrary(true)
        db.insert(allMedia)
        this.loadDatabase()
      })
    })
    return false
  }

  /* Syncs library with Dropbox */
  syncLibraryDB() {
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
        db.insert(allMedia)
        this.loadDatabase()
      })
    })
    return false
  }

  /**
   * Saves the user library to the database after
   * it has been imported
   * @param {Object} importedMedia
   */
  saveAfterImport(importedMedia) {
    db.insert(importedMedia)
    this.loadDatabase()
    return false
  }

}


export default alt.createActions(LibraryActions)
