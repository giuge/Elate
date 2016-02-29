import React, { Component } from 'react'
import remote, { dialog } from 'remote'

import LibraryView from './library_view'
import TopBar from './topbar'
import Sidebar from './sidebar'
import PreviewView from './preview_view'
import Spinner from './spinner'

import connectToStores from 'alt-utils/lib/connectToStores'
import SelectionStore from './../stores/selection_store'
import LibraryActions from './../actions/library_actions'


export default class MainWindow extends Component {

  constructor(props) {
    super(props)
    this.handleKeyDown = this.handleKeyDown.bind(this)
  }

  static getStores() {
    return [SelectionStore]
  }

  static getPropsFromStores() {
    return {...SelectionStore.getState()}
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown)
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown)
  }

  handleKeyDown(event) {
    switch(event.keyCode) {
      // Esc button pressed
      case 46:
        this.handleTrash()
        break
      case 8:
        this.handleTrash()
        break
    }
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

    if (choice === 0) {
      LibraryActions.deleteMedia(this.props.selectedItems)
    }
  }

  renderPreview() {
    if(this.props.previewItem) {
      return (
        <PreviewView
          library={this.props.library}
          media={this.props.previewItem} />
      )
    } return
  }

  render () {
    return (
      <div className='container'>
        {process.platform === 'darwin' ? <TopBar /> : ''}
        {this.renderPreview()}
        <Sidebar isSyncingDB={this.props.isSyncingDB} />
        <LibraryView {...this.props} />
      </div>
    )
  }
}

export default connectToStores(MainWindow)
