import alt from 'lib/alt'
import _ from 'lodash'
import LibraryActions from 'actions/LibraryActions'


class LibraryStore {
  constructor() {
    this.bindListeners({
      handleLoadDatabase: LibraryActions.LOAD_DATABASE
    })

    this.state = {
      library: [],
      loading: true
    }
  }

  handleLoadDatabase(library) {
    library = _.orderBy(library, 'sortDate', 'desc')
    this.setState({
      library: library,
      loading: false
    })
  }

}


export default alt.createStore(LibraryStore, 'LibraryStore')
