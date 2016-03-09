import _ from 'lodash'
import React, { Component, PropTypes } from 'react'
import remote, { dialog } from 'remote'

import TopBar from './topbar'
import Sidebar from './sidebar'
import Spinner from './spinner'
import LibraryView from './library_view'
import FavoritesView from './favorites_view'
import AlbumsView from './albums_view'
import ShareView from './share_view'
import AddView from './add_view'

import connectToStores from 'alt-utils/lib/connectToStores'
import SelectionStore from './../stores/selection_store'
import SelectionActions from './../actions/selection_actions'
import LibraryActions from './../actions/library_actions'
import AppActions from './../actions/app_actions'
import NavigationStore from './../stores/navigation_store'


export default class MainWindow extends Component {

  constructor(props) {
    super(props)
  }

  static propTypes = {
    library: PropTypes.array.isRequired,
    favorites: PropTypes.array.isRequired,
    emptyLibrary: PropTypes.bool.isRequired,
    emptyFavorites: PropTypes.bool.isRequired,
    showAllMedia: PropTypes.bool.isRequired,
    showFavorites: PropTypes.bool.isRequired,
    showAlbums: PropTypes.bool.isRequired,
    showAdd: PropTypes.bool.isRequired,
    showShare: PropTypes.bool.isRequired
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

  renderView() {
    if(this.props.showAllMedia) {
      return (
        <LibraryView
          previewItem={this.props.previewItem}
          emptyLibrary={this.props.emptyLibrary}
          library={this.props.library} />
      )
    }
    else if(this.props.showAlbums) {
      return <AlbumsView
        previewItem={this.props.previewItem}
        library={this.props.library} />
    }
    else if(this.props.showShare) {
      return <ShareView selectedItems={this.props.selectedItems} />
    }
    else if(this.props.showAdd) {
      return <AddView selectedItems={this.props.selectedItems} />
    }
    else if(this.props.showFavorites) {
      return (
        <FavoritesView
          previewItem={this.props.previewItem}
          emptyFavorites={this.props.emptyFavorites}
          favorites={this.props.favorites} />
      )
    }
  }

  render () {
    return (
      <div className='container'>
        <TopBar shouldShowActionbar={true} />
        <Sidebar isSyncingDB={this.props.isSyncingDB} />
        {this.renderView()}
      </div>
    )
  }
}

export default connectToStores(MainWindow)
