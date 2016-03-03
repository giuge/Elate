import React, { Component } from 'react'
import remote, { dialog } from 'remote'

import connectToStores from 'alt-utils/lib/connectToStores'
import SelectionStore from './../stores/selection_store'


export default class ActionBar extends Component {

  constructor(props) {
    super(props)
  }

  static getStores() {
    return [SelectionStore]
  }

  static getPropsFromStores() {
    return {...SelectionStore.getState()}
  }

  handleAdd() {
    if(this.props.selectedItems.length <= 0) return
  }

  handleShare() {
    if(this.props.selectedItems.length <= 0) return
  }

  render () {
    let className = ''
    if(this.props.selectedItems.length <= 0) {
      className = 'disabled'
    }

    return (
      <ul className={`actionBar ${className}`}>
        <li className='share' onClick={() => { this.handleShare() }} />
        <li className='plus' onClick={() => { this.handleAdd() }} />
      </ul>
    )
  }
}

export default connectToStores(ActionBar)
