import React, { Component } from 'react'

import connectToStores from 'alt-utils/lib/connectToStores'
import LibraryStore from 'stores/LibraryStore'
import AppStore from 'stores/AppStore'
import AccountStore from 'stores/AccountStore'

import LibraryActions from 'actions/LibraryActions'
import AppActions from 'actions/AppActions'
import AccountActions from 'actions/AccountActions'

import DropboxConnect from 'components/DropboxConnect'
import ImportLibrary from 'components/ImportLibrary'
import MainWindow from 'components/MainWindow'
import Spinner from 'components/Spinner'

import 'styles/App.scss'


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
    if(this.props.library.length > 0) {
      return (
        <MainWindow
          shouldShowPreview={this.props.shouldShowPreview}
          library={this.props.library}
          selectedItem={this.props.selectedItem} />
      )
    }
    else return <Spinner />
  }
}


export default connectToStores(App)
