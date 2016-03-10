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

  renderPreview() {
    if(this.props.previewItem) {
      return (
        <PreviewView
          media={this.props.previewItem}
          library={this.state.albumItems} />
      )
    }
  }

  renderView() {
    if(this.props.emptyAlbums) {
      return (
        <div className='albumsView'>
          <AlbumsEmpty />
        </div>
      )
    }

    if(this.state.showSingleAlbum) {
      return (
        <div className='listView'>
          {this.renderPreview()}
          <MediaList library={this.state.albumItems} />
        </div>
      )
    }

    return (
      <div className='albumsView'>
        <div className='albumList'>
          {this.renderAlbums()}
        </div>
      </div>

    )
  }

  renderAlbums() {
    return this.props.albums.map(album => {
      let className = ''

      if(this.props.selectedItems.indexOf(album) !== -1) {
        className = 'selected'
      }

      return(
        <div className={`album ${className}`}
          key={album.title}
          style={{backgroundImage: `url(${album.cover})`}}
          onDoubleClick={() => { this.handleClick(album) }} >
          <p>{album.title}</p>
        </div>
      )
    })
  }

  render () {
    return this.renderView()
  }
}

export default connectToStores(AlbumsView)
