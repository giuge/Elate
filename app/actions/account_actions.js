import _ from 'lodash'
import Datastore from 'nedb'

import alt from './../lib/alt'
import dropbox from './../lib/dropbox'
import { USER_DATA, refreshToken } from './../lib/constants'

const db = new Datastore({ filename: `${USER_DATA}/account.db`, autoload: true })


class AccountActions {

  /**
   * Retrieves the user account info from the database
   * and fetches missing data from Dropbox.
   * The db.find function always returns an array.
   */
  getUserInfo() {
    return ((dispatch) => {
      db.find({}, (err, account) => {
        if(err) console.log(err)
        let data = {}
        if(account[0]) {
          if(account[0].token) {
            data.has_token = true
          } else {
            data.has_token = false
          }
          if(account[0].has_imported_library) {
            data.has_imported_library = account[0].has_imported_library
          }
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

  /**
   * Saves the user account info to the database
   * after the user has finished connecting his
   * Dropbox account (dropbox_connect).
   * @param {Object} info
   */
  saveAfterConnect(info) {
    refreshToken(info.token)
    db.insert(info, () => {
      dropbox.getAccountInfo(info.token).then(user => {
        delete user.account_type
        db.update({}, { $set: { account_info: user } }, () => {
          this.getUserInfo()
        })
      })
    })
    return false
  }

  /**
   * Updates the has_imported_library field in the database
   * @param {Bool}
   */
  hasImportedLibrary(bool) {
    db.update({}, { $set: { has_imported_library: bool } })
    this.getUserInfo()
    return false
  }

  /**
   * Logs the user out of the dropbox account
   * TODO: Delete the account database after logout
   */
  logout() {
    return true
  }

}


export default alt.createActions(AccountActions)
