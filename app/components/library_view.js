import React, { Component, PropTypes } from 'react'

import KeyboardManager from './keyboard_manager'
import PreviewView from './preview_view'
import LibraryEmpty from './library_empty'
import MediaList from './media_list'


export default class LibraryView extends Component {

  constructor(props) {
    super(props)
  }


  static propTypes = {
    library: PropTypes.array.isRequired
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
          library={this.props.library} />
      )
    }
  }


  render () {
    if(this.props.emptyLibrary) {
      return (
        <div className='listView'>
          <LibraryEmpty />
        </div>
      )
    }

    return (
      <div className='listView'>
        {this.renderPreview()}
        <MediaList library={this.props.library} />
      </div>
    )
  }

}
