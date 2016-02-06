import _ from 'lodash'
import alt from 'lib/alt'
import Datastore from 'nedb'
import dropbox from 'lib/dropbox'

const db = new Datastore({ filename: 'data/library.db', autoload: true })


class LibraryActions {

  loadDatabase() {
    return ((dispatch) => {
      db.find({}, (err, library) => {
        if(err) console.log(err)
        library = _.orderBy(library, 'sortDate', 'desc')
        dispatch(library)
      })
    })
  }

  importLibrary() {
    let library = []
    let allMedia = []

    dropbox.getFileList().then(results => {
      let promises = dropbox.getAllMedia(results)
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

  syncLibraryDB() {
    let library = []
    let allMedia = []

    db.find({}, (err, dbLibrary) => { library = dbLibrary })
    dropbox.getFileList().then(results => {
      let missingMedia = _.differenceBy(results, library, 'id')
      let promises = dropbox.getAllMedia(missingMedia)
      // console.log(`Existing library: ${library.length}`)
      // console.log(`Missing media: ${missingMedia.length}`)
      // console.log(`Promises: ${promises.length}`)
      Promise.all(promises).then((values) => {
        // console.log(`Promises results: ${values.length}`)
        for(let i in values) {
          allMedia.push(values[i])
        }
        db.insert(allMedia)
        this.loadDatabase()
      })
    })
    return false
  }

  saveAfterImport(importedMedia) {
    db.insert(importedMedia)
    return false
  }

}


export default alt.createActions(LibraryActions)
