import jetpack from 'fs-jetpack'
import path from 'path'
import alt from './../lib/alt'

import { USER_DATA, refreshToken } from './../lib/constants'
import AccountActions from './../actions/account_actions'

const accountDB = path.join(USER_DATA, 'account.db')


class AccountStore {

  constructor() {
    this.bindListeners({
      onGetUserInfo: AccountActions.GET_USER_INFO,
      onHasImportedLibrary: AccountActions.HAS_IMPORTED_LIBRARY,
      onSaveAfterConnect: AccountActions.saveAfterConnect,
      onLogout: AccountActions.LOGOUT
    })

    let account = jetpack.read(accountDB, 'json')
    this.state = {...account}
  }


  onGetUserInfo(account) {
    this.setState({ ...account })
  }


  onHasImportedLibrary(account) {
    this.setState({ ...account })
  }


  onSaveAfterConnect(account) {
    this.setState({ ...account })
  }


  onLogout() {
    this.setState({})
  }

}


export default alt.createStore(AccountStore, 'AccountStore')
