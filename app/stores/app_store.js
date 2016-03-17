import alt from './../lib/alt'
import AppActions from './../actions/app_actions'


class AppStore {

  constructor() {
    this.bindListeners({
      handleIsSyncing: AppActions.IS_SYNCING
    })

    this.state = {
      isSyncingDB: false
    }
  }


  handleIsSyncing(bool) {
    this.setState({
      isSyncingDB: bool
    })
  }

}


export default alt.createStore(AppStore, 'AppStore')
