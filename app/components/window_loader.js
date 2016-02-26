import React, { Component } from 'react'

import connectToStores from 'alt-utils/lib/connectToStores'
import LibraryStore from './../stores/library_store'
import AppStore from './../stores/app_store'
import AccountStore from './../stores/account_store'

import LibraryActions from './../actions/library_actions'
import AppActions from './../actions/app_actions'
import AccountActions from './../actions/account_actions'

import DropboxConnect from './dropbox_connect'
import ImportLibrary from './import_library'
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

  componentWillMount() {
    AccountActions.getUserInfo()
    LibraryActions.loadDatabase()
  }

  componentDidMount() {
    if(this.props.token && this.props.has_imported_library) {
      LibraryActions.syncLibrary()
    }
  }

  render() {
    if(!this.props.token) return <DropboxConnect />
    if(this.props.token && !this.props.has_imported_library) return <ImportLibrary account_info={this.props.account_info} />
    return (
      <MainWindow
        shouldShowPreview={this.props.shouldShowPreview}
        library={this.props.library}
        selectedItem={this.props.selectedItem}
        isSyncingDB={this.props.isSyncingDB} 
        />
    )
  }
}


export default connectToStores(WindowLoader)
