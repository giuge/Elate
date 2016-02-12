import React, { Component } from 'react'

import connectToStores from 'alt-utils/lib/connectToStores'
import LibraryStore from './../stores/LibraryStore'
import AppStore from './../stores/AppStore'
import AccountStore from './../stores/AccountStore'

import LibraryActions from './../actions/LibraryActions'
import AppActions from './../actions/AppActions'
import AccountActions from './../actions/AccountActions'

import DropboxConnect from './DropboxConnect'
import ImportLibrary from './ImportLibrary'
import MainWindow from './MainWindow'
import Spinner from './Spinner'


class App extends Component {
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
    if(this.props.token && this.props.library.length > 0) {
      LibraryActions.syncLibraryDB()
    }
  }

  render() {
    if(!this.props.has_token) return <DropboxConnect />
    if(this.props.has_token && !this.props.has_imported_library) return <ImportLibrary account_info={this.props.account_info} />
    return (
      <MainWindow
        shouldShowPreview={this.props.shouldShowPreview}
        library={this.props.library}
        selectedItem={this.props.selectedItem} />
    )
  }
}


export default connectToStores(App)
