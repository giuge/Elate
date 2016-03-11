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
    SelectionActions.singleSelectItem(album)
  }


  handleDoubleClick(album) {
    AlbumsActions.showSingleAlbum(album)
  }


  renderPreview() {
    if(this.props.previewItem) {
      return (
        <PreviewView
          media={this.props.previewItem}
          library={this.props.albumItems} />
      )
    }
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
    if(this.props.emptyAlbums) {
      return (
        <div className='albumsView'>
          <AlbumsEmpty />
        </div>
      )
    }

    if(this.props.showSingleAlbum) {
      return (
        <div className='listView'>
          {this.renderPreview()}
          <MediaList library={this.props.albumItems} />
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

}


export default connectToStores(AlbumsView)
