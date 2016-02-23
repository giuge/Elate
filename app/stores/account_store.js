import fs from 'fs'
import path from 'path'
import alt from './../lib/alt'

import { USER_DATA, refreshToken } from './../lib/constants'
import AccountActions from './../actions/account_actions'


class AccountStore {
  constructor() {
    this.bindListeners({
      handleGetUserInfo: AccountActions.GET_USER_INFO,
      handleLogout: AccountActions.LOGOUT
    })

    /**
     * If there is a library.db file and the file contains something
     * (bigger than 0 bytes) the user has imported library
     */
    let has_library
    try {
      let stats = fs.statSync(path.join(USER_DATA, 'library.db'))
      stats["size"] > 0 ? has_library = true : has_library = false
    } catch(e) {
      has_library = false
    }

    // Check if we have a token saved in the account db
    let accountDBPath = path.join(USER_DATA, 'account.db')
    let has_token

    try {
      refreshToken() ? has_token = true : has_token = false
    } catch(e) {
      has_token: false
    }

    this.state = {
      has_token: has_token,
      has_imported_library: has_library,
      account_info: null
    }
  }

  handleGetUserInfo(account) {
    this.setState({ ...account })
  }

  handleLogout() {
    this.setState({
      has_token: false
    })
  }

}


export default alt.createStore(AccountStore, 'AccountStore')
