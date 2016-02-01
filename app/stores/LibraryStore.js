import alt from 'lib/alt'
import _ from 'lodash'
import Datastore from 'nedb'
import LibraryActions from 'actions/LibraryActions'

const db = new Datastore({ filename: 'data/library.db' })

class LibraryStore {
  constructor() {
    this.bindListeners({
      handleImportLibrary: LibraryActions.IMPORT_LIBRARY,
      handleSyncLibraryDB: LibraryActions.SYNC_LIBRARY_DB
    })

    this.state = {
      library: []
    }

    db.find({}, (err, library) => {
      library = _.orderBy(library, 'sortDate', 'desc')
      this.setState({
        library: library,
        loading: false
      })
    })
  }

  handleImportLibrary(library) {
    db.loadDatabase()
    db.find({}, (err, library) => {
      library = _.orderBy(library, 'sortDate', 'desc')
      this.setState({
        library: library,
        loading: false
      })
    })
  }

  handleSyncLibraryDB() {
    db.loadDatabase()
    db.find({}, (err, library) => {
      if(err) console.log(err)
      console.log(library)
      library = _.orderBy(library, 'sortDate', 'desc')
      this.setState({
        library: library,
        loading: false
      })
    })
  }
}


export default alt.createStore(LibraryStore, 'LibraryStore')
