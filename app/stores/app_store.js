import alt from './../lib/alt'
import AppActions from './../actions/app_actions'


class AppStore {

  constructor() {
    this.bindListeners({
      onIsSyncing: AppActions.IS_SYNCING
    })

    this.state = {
      isSyncingDB: false
    }
  }


  onIsSyncing(bool) {
    this.setState({
      isSyncingDB: bool
    })
  }

}


export default alt.createStore(AppStore, 'AppStore')
