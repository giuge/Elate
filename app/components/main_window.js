import _ from 'lodash'
import React, { Component } from 'react'
import remote, { dialog } from 'remote'

import LibraryView from './library_view'
import AlbumsView from './albums_view'
import PreviewView from './preview_view'
import ShareView from './share_view'
import AddView from './add_view'
import TopBar from './topbar'
import Sidebar from './sidebar'
import Spinner from './spinner'

import connectToStores from 'alt-utils/lib/connectToStores'
import SelectionStore from './../stores/selection_store'
import SelectionActions from './../actions/selection_actions'
import LibraryActions from './../actions/library_actions'
import AppActions from './../actions/app_actions'
import NavigationStore from './../stores/navigation_store'


export default class MainWindow extends Component {

  constructor(props) {
    super(props)

    this.state = {
      library: this.props.library,
      showFavorites: false
    }

    this.handleKeyDown = this.handleKeyDown.bind(this)
  }

  static getStores() {
    return [SelectionStore, NavigationStore]
  }

  static getPropsFromStores() {
    return {
      ...SelectionStore.getState(),
      ...NavigationStore.getState()
    }
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown)
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown)
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.showFavorites) {
      let library = []
      nextProps.library.forEach((item) => {
        if(item.isFavorite) library.push(item)
      })
      this.setState({
        library: library,
        showFavorites: true
      })
    } else if(nextProps.showAllMedia) {
      let library = nextProps.library
      this.setState({
        library: library,
        showFavorites: false
      })
    }
  }

  ensureVisible() {
    let listView = document.getElementsByClassName('listView')[0]
    let selectedElem = document.getElementsByClassName('selected')[0]

    listView.scrollTop = selectedElem.parentNode.offsetTop - 100
  }

  handleKeyDown(event) {
    if(this.props.selectedItems.length <= 0) return

    let index = _.findIndex(this.state.library, o => {
      return o._id === this.props.selectedItems[0]._id
    })

    // TODO: we need to select photo from the correct library (eg: favorites)
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
        AppActions.previewItem(this.state.library[index])
        break
      // Left arrow pressed
      case 37:
        if(index - 1 < 0) break
        SelectionActions.singleSelectItem(this.state.library[index - 1])
        this.ensureVisible()
        break
      // Right arrow pressed
      case 39:
        if(index + 1 >= this.state.library.length) break
        SelectionActions.singleSelectItem(this.state.library[index + 1])
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
          library={this.state.library}
          media={this.props.previewItem} />
      )
    }
    return
  }

  renderView() {
    if(this.props.showAlbums) {
      return <AlbumsView />
    } else if(this.props.showShare) {
      return <ShareView />
    } else if(this.props.showAdd) {
      return <AddView />
    }
  }

  render () {
    /**
     * We keep the LibraryView around
     * even if we are displaying another
     * view that doesn't need it or the component
     * will unmount causing a slow rerender.
     * LibraryView will be pushed down, under the
     * loaded view and will not be visible.
     */
    return (
      <div className='container'>
        <TopBar shouldShowActionbar={true} />
        {this.renderPreview()}
        <Sidebar isSyncingDB={this.props.isSyncingDB} />
        {this.renderView()}

        <LibraryView
          library={this.state.library}
          emptyLibrary={this.props.emptyLibrary}
          emptyFavorites={this.props.emptyFavorites}
          showFavorites={this.state.showFavorites} />
      </div>
    )
  }
}

export default connectToStores(MainWindow)
