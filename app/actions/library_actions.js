import _ from 'lodash'
import alt from './../lib/alt'
import pdb from 'pouchdb/dist/pouchdb'
import dropbox from './../lib/dropbox'
import notifier from 'node-notifier'
import path from 'path'

import AccountActions from './account_actions'
import AppActions from './app_actions'

const db = new pdb('library', { adapter: 'websql' })


class LibraryActions {

  // Loads the library database
  loadDatabase() {
    return ((dispatch) => {
      db.allDocs({ include_docs: true, attachments: true })
      .then((results) => {
        let library = []
        results.rows.map((row) => { library.push(row.doc) })
        dispatch(_.orderBy(library, 'sortDate', 'desc'))
      })
      .catch((err) => { console.log(err) })
    })
  }

  /**
   * Syncs library with Dropbox
   * TODO: We need to delete files as well :)
   */
  syncLibrary() {
    db.allDocs({ include_docs: true })
    .then((results) => {
      let library = []
      results.rows.map((row) => { library.push(row.doc) })

      dropbox.getFileList().then(results => {
        let missingMedia = _.differenceBy(results, library, 'id')
        let promises = dropbox.getAllMedia(missingMedia)

        if(promises.length > 0) AppActions.isSyncing(true)

        Promise.all(promises).then((values) => {
          db.bulkDocs(values)
          .then((results) => {
            AppActions.isSyncing(false)

            if(values.length > 0) {
              this.loadDatabase()
              notifier.notify({
                title: 'Sync finished',
                message: `Imported ${results.length} new pictures.`,
                icon: path.join(__dirname, 'assets', 'notification-logo.png'),
                sound: true,
                wait: false
              }, function (err, response) {
                console.log(err)
              })
            }

          })
          .catch((err) => {
            console.log(err)
          })
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
    return ((dispatch) => {
      db.bulkDocs(importedMedia)
      .then((results) => {
        dispatch(_.orderBy(importedMedia, 'sortDate', 'desc'))
      })
      .catch((err) => {
        console.log(err)
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
