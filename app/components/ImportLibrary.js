import React, { Component } from 'react'
import dropbox from 'lib/dropbox'
import request from 'superagent'
import utils from 'lib/utils'
import { TOKEN, API_ROOT, CONTENT_ROOT, MEDIA_FOLDER, SUPPORTED_MIME_TYPES } from 'lib/costants'

import LibraryActions from 'actions/LibraryActions'


export default class ImportLibrary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      libraryLength: 0,
      importedMedia: []
    }
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(){
    let importedMedia = []
    console.log(this)
    dropbox.getFileList().then(results  => {
      console.log(this)
      this.SetState({libraryLength: results.length})
    })

  }

  render () {
    return (
      <div className='container'>
        <h1>Welcome to Elate</h1>
        <a onClick={() => { this.handleClick() }}>Import Library</a>
        <progress value={this.state.importedMedia.length} max={this.state.libraryLength}></progress>
      </div>
    )
  }
}
