import alt from 'lib/alt'
import dropbox from 'lib/dropbox'
import Datastore from 'nedb'
import _ from 'lodash'

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
    let allMedia = []
    dropbox.getFileList((results) => {
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

    dropbox.getFileList((results) => {
      let missingMedia = _.differenceBy(results, library, 'id')
      let promises = dropbox.getUnsyncedMedia(missingMedia)

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

}


export default alt.createActions(LibraryActions)
