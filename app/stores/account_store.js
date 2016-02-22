import alt from './../lib/alt'
import AccountActions from './../actions/account_actions'


class AccountStore {
  constructor() {
    this.bindListeners({
      handleGetUserInfo: AccountActions.GET_USER_INFO,
      handleLogout: AccountActions.LOGOUT
    })

    let token = localStorage.getItem('token')
    let has_token = localStorage.getItem('token') ? true : false

    this.state = {
      has_token: has_token,
      has_imported_library: localStorage.getItem('has_imported_library') || false,
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
