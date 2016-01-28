import React, { Component } from 'react'

import connectToStores from 'alt-utils/lib/connectToStores'
import LibraryStore from 'stores/LibraryStore'
import LibraryActions from 'actions/LibraryActions'

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
    console.log(this.props.library)
    return(
      <h1>Hello World</h1>
    )
  }
}


export default connectToStores(App)
