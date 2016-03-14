import React, { Component } from 'react'
import { remote } from 'electron'

import NavigationActions from './../actions/navigation_actions'
import SelectionActions from './../actions/selection_actions'
import AlbumsActions from './../actions/albums_actions'


const Sidebar = (props) => {

  const prepareForView = () => {
    let listView = document.getElementsByClassName('listView')[0]
    let albumsView = document.getElementsByClassName('albumsView')[0]

    if(listView) {
      listView.scrollTop = 0
    } else if(albumsView) {
      albumsView.scrollTop = 0
    }

    SelectionActions.clearSelection()
  }


  const renderStatus = () => {
    if(props.isSyncingDB) {
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


  return (
    <div className='sidebar'>
      <ul>
        <h6>Library</h6>

        <li className={props.showAllMedia ? 'active' : ''}
          onClick={() => { NavigationActions.showAllMedia(); prepareForView() }}>
          <img src='assets/all-media.svg'/>All media
        </li>

        <li className={props.showFavorites ? 'active' : ''}
          onClick={() => { NavigationActions.showFavorites(); prepareForView() }}>
          <img src='assets/favorites.svg'/>Favorites
        </li>

        <li className={props.showAlbums ? 'active' : ''}
          onClick={() => { NavigationActions.showAlbums(); AlbumsActions.hideSingleAlbum(); prepareForView() }}>
          <img src='assets/albums.svg'/>Albums
        </li>
      </ul>

      {renderStatus()}
    </div>
  )

}


export default Sidebar
