import fs from 'fs'
import path from 'path'
import alt from './../lib/alt'

import { USER_DATA } from './../lib/constants'
import AccountActions from './../actions/account_actions'


class AccountStore {
  constructor() {
    this.bindListeners({
      handleGetUserInfo: AccountActions.GET_USER_INFO,
      handleLogout: AccountActions.LOGOUT
    })

    /**
     * If there is an account.db file and the file contains something
     * (bigger than 0 bytes) the user has connected his account
     * and has a token.
     */
    let has_token
    try {
      let stats = fs.statSync(path.join(USER_DATA, 'account.db'))
      stats["size"] > 0 ? has_token = true : has_token = false
    } catch(e) {
      has_library = false
    }

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
