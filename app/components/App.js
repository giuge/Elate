import React, { Component } from 'react'

import connectToStores from 'alt-utils/lib/connectToStores'
import LibraryStore from 'stores/LibraryStore'
import LibraryActions from 'actions/LibraryActions'

import LibraryView from 'components/LibraryView'
import Spinner from 'components/Spinner'

import 'styles/App.scss'


class App extends Component {
  constructor(props) {
    super(props)
  }

  static getStores() {
    return [LibraryStore]
  }

  static getPropsFromStores() {
    return LibraryStore.getState()
  }

  componentWillMount() {
    LibraryActions.getLibrary()
  }

  render() {
    if(this.props.library.length > 0) return <LibraryView library={this.props.library}/>
    else return <Spinner />
  }
}


export default connectToStores(App)
