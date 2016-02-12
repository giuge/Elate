import _ from 'lodash'
import Datastore from 'nedb'

import alt from './../lib/alt'
import dropbox from './../lib/dropbox'
import { USER_DATA } from './../lib/costants'

const db = new Datastore({ filename: `${USER_DATA}/account.db`, autoload: true })


class AccountActions {

  getUserInfo() {
    return ((dispatch) => {
      db.find({}, (err, account) => {
        if(err) console.log(err)
        let data = {}
        if(account[0]) {
          if(account[0].token && account[0].has_token) {
            data.has_token = true
            localStorage.setItem('token', account[0].token)
          } else {
            data.has_token = false
          }
          if(account[0].has_imported_library) {
            data.has_imported_library = true
          } else data.has_imported_library = false
          if(account[0].account_info) {
            data.account_info = account[0].account_info
            dispatch(data)
          } else {
            dropbox.getAccountInfo().then(user => {
              delete user.account_type
              db.update({token: account[0].token}, { $set: { account_info: user } })
              data.account_info = user
              dispatch(data)
            })
          }

        }
      })
    })
  }

  saveAfterConnect(info) {
    db.insert(info, () => {
      dropbox.getAccountInfo().then(user => {
        delete user.account_type
        db.update({token: info.token}, { $set: { account_info: user } })
        this.getUserInfo()
      })
    })
    return false
  }

  hasImportedLibrary(bool) {
    db.update({}, { $set: { has_imported_library: bool } })
    this.getUserInfo()
    return false
  }


  logout() {
    localStorage.clear()
    return true
  }

}


export default alt.createActions(AccountActions)
