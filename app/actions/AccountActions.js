import _ from 'lodash'
import alt from 'lib/alt'
import Datastore from 'nedb'

const db = new Datastore({ filename: 'data/account.db', autoload: true })


class AccountActions {

  getUserInfo() {
    return ((dispatch) => {
      db.find({}, (err, account) => {
        if(err) console.log(err)
        let data = {
          token: null,
          accountInfo: null,
        }
        if(account[0]) {
          if(account[0].token) {
            data.token = account[0].token
            localStorage.setItem('token', account[0].token)
          }
          if(account[0].accountInfo) data.accountInfo = account[0].accountInfo
        }
        dispatch(data)
      })
    })
  }

  saveUserInfo(info) {
    return ((dispatch) => {
      db.insert(info)
      dispatch(info)
    })
  }


}


export default alt.createActions(AccountActions)
