import _ from 'lodash'
import alt from 'lib/alt'
import Datastore from 'nedb'
import { USER_DATA } from 'lib/costants'

const db = new Datastore({ filename: `${USER_DATA}/account.db`, autoload: true })


class AccountActions {

  getUserInfo() {
    return ((dispatch) => {
      db.find({}, (err, account) => {
        localStorage.clear('token')
        if(err) console.log(err)
        let data = {}
        if(account[0]) {
          if(account[0].token && account[0].has_token) {
            data.has_token = true
            localStorage.setItem('token', account[0].token)
            console.log(localStorage.getItem('token'))
          } else {
            data.has_token = false
          }
          if(account[0].has_imported_library) {
            data.has_imported_library = true
          } else data.has_imported_library = false
        } else {
          data.has_token = false
          data.has_imported_library = false
          data.account_info = null
        }
        dispatch(data)
      })
    })
  }

  saveUserInfo(info) {
    db.insert(info)
    this.getUserInfo()
    return false
  }

  hasImportedLibrary(bool) {
    db.update({}, { $set: { has_imported_library: bool } })
    this.getUserInfo()
    return false
  }


}


export default alt.createActions(AccountActions)
