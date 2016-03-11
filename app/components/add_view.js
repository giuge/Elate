import React, { Component } from 'react'

import connectToStores from 'alt-utils/lib/connectToStores'
import AlbumsStore from './../stores/albums_store'
import AlbumsActions from './../actions/albums_actions'
import NavigationActions from './../actions/navigation_actions'

export default class AddView extends Component {

  constructor(props) {
    super(props)

    this.state = {
      items: props.selectedItems,
      albumTitle: ''
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

  createNewAlbum() {
    if(this.state.albumTitle) {
      AlbumsActions.createAlbum(this.state.albumTitle, this.state.items)
      AlbumsActions.hideSingleAlbum()
      NavigationActions.showAlbums()
    }
  }

  renderTitle() {
    if(this.props.albums.length <= 0) {
      return <h2>Create your first album with {this.state.items.length} items</h2>
    } else {
      return <h2>Add {this.state.items.length} items to an album</h2>
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

  render () {
    return (
      <div className='addView'>
        {this.renderTitle()}
        {this.renderCreate()}
      </div>
    )
  }
}

export default connectToStores(AddView)
