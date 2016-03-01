import React, { Component } from 'react'
import connectToStores from 'alt-utils/lib/connectToStores'

import AppActions from './../actions/app_actions'
import SelectionActions from './../actions/selection_actions'
import LibraryActions from './../actions/library_actions'
import SelectionStore from './../stores/selection_store'

export default class SingleMedia extends Component {

  constructor(props) {
    super(props)
  }

  static getStores() {
    return [SelectionStore]
  }

  static getPropsFromStores() {
    return {...SelectionStore.getState()}
  }

  handleClick(event) {
    if(event.shiftKey) SelectionActions.selectItem(this.props.media)
    else SelectionActions.singleSelectItem(this.props.media)
  }

  handleDoubleClick() {
    AppActions.previewItem(this.props.media)
  }

  addFavorite() {
    LibraryActions.addToFavorites(this.props.media)
  }

  renderDuration() {
    if(this.props.media.media_info && this.props.media.media_info.metadata) {
      if(this.props.media.media_info.metadata.duration) {
        let ms = this.props.media.media_info.metadata.duration
        let min = (ms/1000/60) << 0
        let sec = parseInt((ms/1000) % 60)

        return <p>{`${min < 10 ? '0' + min : min }:${sec < 10 ? '0' + sec : sec }`}</p>
      }
    }
  }

  render () {
    let className = ''
    if(this.props.selectedItems.indexOf(this.props.media) !== -1) {
      className = 'selected'
    }

    let image = ''
    if(this.props.media.isFavorite) {
      image = 'is-favorite.svg'
    } else {
      image = 'favorites.svg'
    }

    if(this.props.media.media_info &&
      this.props.media.media_info.metadata &&
      this.props.media.media_info.metadata.tag === 'video') {
      return (
        <div className={`video ${className}`}>
          <img onClick={() => { this.addFavorite() }}
            src={`assets/${image}`}
            className='addFavorite' />

          <img onClick={(event) => { this.handleClick(event) }}
            onDoubleClick={() => { this.handleDoubleClick() }}
            src={this.props.media.thumbnail}
            className='picture' />
          {this.renderDuration()}
        </div>
      )
    }
    return (
      <div className={`picture ${className}`}>
        <img onClick={() => { this.addFavorite() }}
          src={`assets/${image}`}
          className='addFavorite' />

        <img
          onClick={(event) => { this.handleClick(event) }}
          onDoubleClick={() => { this.handleDoubleClick() }}
          src={this.props.media.thumbnail}
          className='picture' />
      </div>
    )
  }
}

export default connectToStores(SingleMedia)
