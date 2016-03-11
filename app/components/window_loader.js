import React, { Component } from 'react'

import connectToStores from 'alt-utils/lib/connectToStores'
import LibraryStore from './../stores/library_store'
import AppStore from './../stores/app_store'
import AccountStore from './../stores/account_store'

import LibraryActions from './../actions/library_actions'
import AppActions from './../actions/app_actions'
import AccountActions from './../actions/account_actions'

import DropboxConnectWindow from './dropbox_connect_window'
import ImportLibraryWindow from './import_library_window'
import MainWindow from './main_window'
import Spinner from './spinner'


export class WindowLoader extends Component {
  constructor(props) {
    super(props)
  }


  static getStores() {
    return [LibraryStore, AppStore, AccountStore]
  }


  static getPropsFromStores() {
    return {
      ...AccountStore.getState(),
      ...LibraryStore.getState(),
      ...AppStore.getState()
    }
  }


  static componentDidConnect() {
    AccountActions.getUserInfo()
    LibraryActions.loadDatabase()
  }


  componentDidMount() {
    if(this.props.token && this.props.has_imported_library) {
      LibraryActions.syncLibrary()
    }
  }


  render() {
    if(!this.props.token) return <DropboxConnectWindow />
    if(this.props.token && !this.props.has_imported_library)
      return <ImportLibraryWindow account_info={this.props.account_info} />
    return (
      <MainWindow {...this.props} />
    )
  }

}


export default connectToStores(WindowLoader)
