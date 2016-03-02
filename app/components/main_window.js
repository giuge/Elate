import React, { Component } from 'react'
import remote, { dialog } from 'remote'
import {findDOMNode} from 'react-dom'
import utils from './../lib/utils'

import LibraryView from './library_view'
import TopBar from './topbar'
import Sidebar from './sidebar'
import PreviewView from './preview_view'
import Spinner from './spinner'

import connectToStores from 'alt-utils/lib/connectToStores'
import SelectionStore from './../stores/selection_store'
import SelectionActions from './../actions/selection_actions'
import LibraryActions from './../actions/library_actions'
import AppActions from './../actions/app_actions'


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

  ensureVisible() {
    let listView = document.getElementsByClassName('listView')[0]
    let listViewTop = listView.scrollTop
    let listViewBottom = listViewTop + listView.innerHeight

    let selectedElem = document.getElementsByClassName('selected')[0]
    let selectedElemTop = selectedElem.parentNode.getBoundingClientRect().top
    let selectedElemBottom = selectedElem.parentNode.getBoundingClientRect().bottom

    //let isVisible = (selectedElemTop >= 0) && (selectedElemBottom <= listView.innerHeight)
    let isVisible = (listViewBottom  - 100 > selectedElemBottom) && (listViewTop + 100 < selectedElemTop)
    let position = selectedElem.parentNode.offsetTop - 100

    if(!isVisible) {
      utils.smoothScrollTo(listView, position, 200).catch(() => {})
      //listView.scrollTop = selectedElem.parentNode.offsetTop - 100
    }
  }

  handleKeyDown(event) {
    if(this.props.selectedItems.length <= 0) return

    let index = _.findIndex(this.props.library, o => {
      return o._id === this.props.selectedItems[0]._id
    })

    switch(event.keyCode) {
      // Canc button pressed
      case 46:
        this.handleTrash()
        break
      // Delete button pressed
      case 8:
        this.handleTrash()
        break
      // Return key pressed
      case 13:
        AppActions.previewItem(this.props.library[index])
        break
      // Left arrow pressed
      case 37:
        if(index - 1 < 0) break
        SelectionActions.singleSelectItem(this.props.library[index - 1])
        this.ensureVisible()
        break
      // Right arrow pressed
      case 39:
        if(index + 1 >= this.props.library.length) break
        SelectionActions.singleSelectItem(this.props.library[index + 1])
        this.ensureVisible()
        break
      // Esc button pressed
      case 27:
        if(!this.props.previewItem) {
          SelectionActions.clearSelection()
        }
        break
    }
  }

  handleTrash() {
    let itmeStr = `${this.props.selectedItems.length == 1 ? 'This item' : 'These items'}`
    let msgStr =  'will be deleted both from Elate and Dropbox.'
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
