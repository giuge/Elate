import alt from 'lib/alt'
import AccountActions from 'actions/AccountActions'


class AccountStore {
  constructor() {
    this.bindListeners({
      handleGetUserInfo: AccountActions.GET_USER_INFO,
      handleSaveUserInfo: AccountActions.SAVE_USER_INFO
    })

    this.state = {
      token: null,
      accountInfo: null
    }
  }

  handleGetUserInfo(account) {
    let { token, accountInfo} = account
    this.setState({
      token: token,
      accountInfo: accountInfo
    })
  }

  handleSaveUserInfo(token) {
    this.setState({token})
  }


}


export default alt.createStore(AccountStore, 'AccountStore')
