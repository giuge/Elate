import React, { Component } from 'react'
import remote, { dialog } from 'remote'
import {nativeImage} from 'electron'

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

  handleTrash() {
    let itmeStr = `${this.props.selectedItems.length == 1 ? 'This item' : 'These items'}`
    let msgStr =  'will be permanently deleted from Elate and Dropbox.'
    let message = `${itmeStr} ${msgStr}`

    let choice = dialog.showMessageBox(
      remote.getCurrentWindow(),
      {
        type: 'question',
        buttons: ['Delete', 'Cancel'],
        message: 'Delete from all your devices?',
        detail: message
      })

  	if (choice === 0){
      console.log("Should delete")
  	} else {
  		console.log("No delete")
  	}
  }

  render () {
    if(this.props.selectedItems.length > 0) {
      return (
        <ul className="actionBar">
          <li className='trash' onClick={() => { this.handleTrash() }}>
            <img src='assets/trash.svg' />
          </li>
        </ul>
      )
    }
    return (
      <div />
    )
  }
}

export default connectToStores(ActionBar)
