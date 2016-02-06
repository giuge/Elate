import alt from 'lib/alt'
import AccountActions from 'actions/AccountActions'


class AccountStore {
  constructor() {
    this.bindListeners({
      handleGetUserInfo: AccountActions.GET_USER_INFO
    })

    this.state = {
      has_token: true,
      has_imported_library: true,
      account_info: null
    }
  }

  handleGetUserInfo(account) {
    this.setState({ ...account })
    console.log(account)
  }

}


export default alt.createStore(AccountStore, 'AccountStore')
