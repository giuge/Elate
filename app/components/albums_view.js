import React, { Component } from 'react'

import AlbumItemsView from './album_items_view'
import AlbumsEmpty from './albums_empty'

import connectToStores from 'alt-utils/lib/connectToStores'
import AlbumsStore from './../stores/albums_store'
import AlbumsActions from './../actions/albums_actions'


export default class AlbumsView extends Component {

  constructor(props) {
    super(props)

    this.state = {
      showSingleAlbum: false,
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

  handleClick(album) {
    this.setState({
      showSingleAlbum: true,
      selectedAlbum: album
    })
  }

  renderView() {
    if(this.props.emptyAlbums) {
      return <AlbumsEmpty />
    }

    if(this.state.showSingleAlbum) {
      let items = []
      let albumItems = this.state.selectedAlbum.items

      this.props.library.forEach((item) => {
        for(let i in albumItems) {
          if(item._id == albumItems[i])
          items.push(item)
        }
      })

      return <AlbumItemsView items={items} />
    }

    return (
      <div className='albumList'>
        {this.renderAlbums()}
      </div>
    )
  }

  renderAlbums() {
    return this.props.albums.map(album => {
      return(
        <div className='album' key={album.title}>
          <p>{album.title}</p>
          <img src={album.cover} onDoubleClick={() => { this.handleClick(album) }} />
        </div>
      )
    })
  }

  render () {
    return (
      <div className='albumsView'>
        {this.renderView()}
      </div>
    )
  }
}

export default connectToStores(AlbumsView)
