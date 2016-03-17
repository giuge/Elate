import React, { Component } from 'react'

import connectToStores from 'alt-utils/lib/connectToStores'
import AlbumsStore from './../stores/albums_store'
import AlbumsActions from './../actions/albums_actions'
import NavigationActions from './../actions/navigation_actions'

import AlbumsView from './albums_view'


export default class AddView extends Component {

  constructor(props) {
    super(props)

    this.state = {
      items: this.props.selectedItems,
      albumTitle: '',
      selectedAlbum: null
    }
  }


  static getStores() {
    return [AlbumsStore]
  }


  static getPropsFromStores() {
    return { ...AlbumsStore.getState()}
  }


  static componentDidConnect() {
    AlbumsActions.getAlbums()
  }


  handleTitleChange(event) {
    this.setState({
      albumTitle: event.target.value
    })
  }


  handleClick(album) {
    this.setState({
      selectedAlbum: album
    })
  }


  createNewAlbum() {
    if(this.state.albumTitle) {
      AlbumsActions.createAlbum(this.state.albumTitle, this.state.items)
      AlbumsActions.hideSingleAlbum()
      NavigationActions.showAlbums()
    }
  }


  addToAlbum() {
    if(this.state.selectedAlbum) {
      AlbumsActions.addToAlbum(this.state.selectedAlbum, this.state.items)
      NavigationActions.showAlbums()
    }
  }


  renderTitle() {
    if(this.props.albums.length <= 0) {
      return <h2>Create your first album with {this.state.items.length} items</h2>
    } else {
      return <h2>Create a new album with {this.state.items.length} items</h2>
    }
  }


  renderCreate() {
    return (
      <div className="newAlbum">
        <input type='text' placeholder='Album name' className='albumTitle' onChange={(event) => { this.handleTitleChange(event) }} />
        <a className='button' onClick={() => { this.createNewAlbum() }}>Create album</a>
      </div>
    )
  }


  renderAlbumsList() {
    return this.props.albums.map(album => {
      let className = this.state.selectedAlbum === album ? 'selected' : ''
      return (
        <li className={`album ${className}`}
          key={album.title}
          style={{backgroundImage: `url(${album.cover})`}}
          onClick={() => { this.handleClick(album) }}>
          <p>{album.title}</p>
        </li>
      )
    })
  }


  renderAddToAlbum() {
    if(!this.props.emptyAlbums) {
      return (
        <div className="addToAlbum">
          <h2>Add {this.state.items.length} items to an album</h2>
          <ul>
            {this.renderAlbumsList()}
          </ul>
          <a className='button' onClick={() => { this.addToAlbum() }}>Add to album</a>
        </div>
      )
    }
  }


  render () {
    return (
      <div className='addView'>
        {this.renderTitle()}
        {this.renderCreate()}
        {this.renderAddToAlbum()}
      </div>
    )
  }

}


export default connectToStores(AddView)
