import React, { Component } from 'react'

import KeyboardManager from './../lib/keyboard_manager'
import PreviewView from './preview_view'
import FavoritesEmpty from './favorites_empty'
import MediaList from './media_list'


export default class FavoritesView extends Component {

  constructor(props) {
    super(props)
  }


  componentWillMount() {
    KeyboardManager().activate(this)
  }


  componentWillUnmount() {
    KeyboardManager().deactivate()
  }


  renderPreview() {
    if(this.props.previewItem) {
      return (
        <PreviewView
          media={this.props.previewItem}
          library={this.props.favorites} />
      )
    }
  }


  render () {
    if(this.props.emptyFavorites) {
      return (
        <div className='listView'>
          <FavoritesEmpty />
        </div>
      )
    }
    return (
      <div className='listView'>
        {this.renderPreview()}
        <MediaList library={this.props.favorites} />
      </div>
    )
  }

}
