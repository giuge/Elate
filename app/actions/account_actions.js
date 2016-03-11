import _ from 'lodash'
import alt from './../lib/alt'
import path from 'path'
import jetpack from 'fs-jetpack'
import dropbox from './../lib/dropbox'

import { USER_DATA, refreshToken } from './../lib/constants'
const accountDB = path.join(USER_DATA, 'account.db')

class AccountActions {

  /**
   * Retrieves the user account info from the database
   * and fetches missing data from Dropbox.
   * The db.find function always returns an array.
   */
  getUserInfo() {
    return ((dispatch) => {
      let account = jetpack.read(accountDB, 'json')
      dispatch(account)
    })
  }


  /**
   * Saves the user account info to the database
   * after the user has finished connecting his
   * Dropbox account (dropbox_connect).
   * @param {Object} account
   */
  saveAfterConnect(account) {
    return ((dispatch) => {
      dropbox.getAccountInfo(account.token).then(user => {
        delete user.account_type
        account.account_info = user
        jetpack.write(accountDB, account)
        dispatch(account)
      })
    })
  }


  /**
   * Updates the has_imported_library field in the database
   * @param {Bool}
   */
  hasImportedLibrary(bool) {
    return ((dispatch) => {
      let account = jetpack.read(accountDB, 'json')
      account.has_imported_library = bool
      jetpack.write(accountDB, account)
      dispatch(account)
    })
  }


  /**
   * Logs the user out of the dropbox account
   * TODO: Delete only the token and check if you
   * need to delete everything on next login.
   */
  logout() {
    jetpack.remove(accountDB)
    return true
  }

}


export default alt.createActions(AccountActions)
