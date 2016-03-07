import React, { Component } from 'react'
import { remote } from 'electron'

import connectToStores from 'alt-utils/lib/connectToStores'
import NavigationStore from './../stores/navigation_store'
import NavigationActions from './../actions/navigation_actions'
import SelectionActions from './../actions/selection_actions'


export default class Sidebar extends Component {

  constructor(props) {
    super(props)
  }

  static getStores() {
    return [NavigationStore]
  }

  static getPropsFromStores() {
    return {...NavigationStore.getState()}
  }

  prepareForView() {
    let listView = document.getElementsByClassName('listView')[0]
    let albumsView = document.getElementsByClassName('albumsView')[0]

    if(listView) {
      listView.scrollTop = 0
    } else if(albumsView) {
      albumsView.scrollTop = 0
    }

    SelectionActions.clearSelection()
  }

  renderStatus() {
    if(this.props.isSyncingDB) {
      return(
        <div className='bottom-info sync'>
          <img src='assets/loading.svg' />
          <span>Importing</span>
        </div>
      )
    } else {
      return(
        <div className='bottom-info'>
          <p>Version {remote.app.getVersion()}</p>
        </div>
      )
    }
  }

  render () {
    return (
      <div className='sidebar'>
        <ul>
          <h6>Library</h6>

          <li className={this.props.showAllMedia ? 'active' : ''}
            onClick={() => { NavigationActions.showAllMedia(); this.prepareForView() }}>
            <img src='assets/all-media.svg'/>All media
          </li>

          <li className={this.props.showFavorites ? 'active' : ''}
            onClick={() => { NavigationActions.showFavorites(); this.prepareForView() }}>
            <img src='assets/favorites.svg'/>Favorites
          </li>

          <li className={this.props.showAlbums ? 'active' : ''}
            onClick={() => { NavigationActions.showAlbums(); this.prepareForView() }}>
            <img src='assets/albums.svg'/>Albums
          </li>
        </ul>

        {this.renderStatus()}
      </div>
    )
  }
}

export default connectToStores(Sidebar)
