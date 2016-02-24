import jetpack from 'fs-jetpack'
import path from 'path'
import alt from './../lib/alt'

import { USER_DATA, refreshToken } from './../lib/constants'
import AccountActions from './../actions/account_actions'

const accountDB = path.join(USER_DATA, 'account.db')


class AccountStore {
  constructor() {
    this.bindListeners({
      handleGetUserInfo: AccountActions.GET_USER_INFO,
      handleHasImportedLibrary: AccountActions.HAS_IMPORTED_LIBRARY,
      handleSaveAfterConnect: AccountActions.saveAfterConnect,
      handleLogout: AccountActions.LOGOUT
    })

    let account = jetpack.read(accountDB, 'json')
    this.state = {...account}
  }

  handleGetUserInfo(account) {
    this.setState({ ...account })
  }

  handleHasImportedLibrary(account) {
    this.setState({ ...account })
  }

  handleSaveAfterConnect(account) {
    this.setState({ ...account })
  }

  handleLogout() {
    this.setState({})
  }

}


export default alt.createStore(AccountStore, 'AccountStore')
