import React, { Component } from 'react'

import connectToStores from 'alt-utils/lib/connectToStores'
import NavigationStore from './../stores/navigation_store'
import NavigationActions from './../actions/navigation_actions'


export default class NavigationBar extends Component {

  constructor(props) {
    super(props)
  }


  static getStores() {
    return [NavigationStore]
  }


  static getPropsFromStores() {
    return {...NavigationStore.getState()}
  }


  handleGoBack() {
    NavigationActions.goBack()
  }


  handleGoForward() {
    NavigationActions.goForward()
  }


  render () {
    return (
      <ul className='navigationBar'>
        <li className={`back ${this.props.canGoBack ? '' : 'disabled'}`}
          onClick={() => { this.handleGoBack() }} />
      </ul>
    )
  }

}


export default connectToStores(NavigationBar)
