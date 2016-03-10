import React, { Component } from 'react'

import KeyboardManager from './keyboard_manager'
import PreviewView from './preview_view'
import MediaList from './media_list'
import AlbumsEmpty from './albums_empty'

import connectToStores from 'alt-utils/lib/connectToStores'
import AlbumsStore from './../stores/albums_store'
import AlbumsActions from './../actions/albums_actions'
import SelectionActions from './../actions/selection_actions'


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

  componentWillReceiveProps(nextProps) {
    if(nextProps.albums.length <= 0) return
    if(this.state.selectedAlbum) {
      let items = []
      let nextAlbumIndex = -1

      for(let i in nextProps.albums) {
        if(this.state.selectedAlbum._id == nextProps.albums[i]._id) {
          nextAlbumIndex = i
        }
      }
      if(nextAlbumIndex == -1) return

      let nextAlbum = nextProps.albums[nextAlbumIndex]

      this.props.library.forEach((item) => {
        for(let i in nextAlbum.items) {
          if(item._id == nextAlbum.items[i])
          items.push(item)
        }
      })

      this.setState({
        albumItems: items
      })
    }
  }

  handleClick(album) {
    SelectionActions.singleSelectItem(album)
  }

  handleDoubleClick(album) {
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
          onClick={() => { this.handleClick(album) }}
          onDoubleClick={() => { this.handleDoubleClick(album) }} >
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
