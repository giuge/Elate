import React, { Component } from 'react'

import connectToStores from 'alt-utils/lib/connectToStores'
import LibraryStore from 'stores/LibraryStore'
import AppStore from 'stores/AppStore'
import LibraryActions from 'actions/LibraryActions'

import LibraryView from 'components/LibraryView'
import PreviewView from 'components/PreviewView'
import Spinner from 'components/Spinner'

import 'styles/App.scss'


class App extends Component {
  constructor(props) {
    super(props)
  }

  static getStores() {
    return [LibraryStore, AppStore]
  }

  static getPropsFromStores() {
    return {
      ...LibraryStore.getState(),
      ...AppStore.getState()
    }
  }

  componentWillMount() {
    LibraryActions.loadDatabase()
    LibraryActions.syncLibraryDB()
  }

  render() {
    if(this.props.shoudShowPreview) return <PreviewView library={this.props.library} media={this.props.previewItem} />
    if(this.props.library.length > 0) return <LibraryView library={this.props.library}/>
    else return <Spinner />
  }
}


export default connectToStores(App)
