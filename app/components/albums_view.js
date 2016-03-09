import React, { Component } from 'react'

import KeyboardManager from './keyboard_manager'
import PreviewView from './preview_view'
import MediaList from './media_list'
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

  componentWillMount() {
    KeyboardManager.activate(this)
  }

  componentWillUnmount() {
    KeyboardManager.deactivate()
  }

  handleClick(album) {
    let items = []

    this.props.library.forEach((item) => {
      for(let i in album.items) {
        if(item._id == album.items[i])
        items.push(item)
      }
    })

    this.setState({
      showSingleAlbum: true,
      selectedAlbum: album,
      albumItems: items
    })
  }

  renderView() {
    if(this.props.emptyAlbums) {
      return <AlbumsEmpty />
    }

    if(this.state.showSingleAlbum) {
      if(this.props.previewItem) {
        return (
          <PreviewView
            media={this.props.previewItem}
            library={this.state.albumItems} />
        )
      }

      return (
        <div className='listView'>
          <MediaList library={this.state.albumItems} />
        </div>
      )
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
