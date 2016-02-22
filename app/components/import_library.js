import React, { Component } from 'react'
import remote from 'remote'
import dropbox from './../lib/dropbox'
import utils from './../lib/utils'

import LibraryActions from './../actions/library_actions'
import AccountActions from './../actions/account_actions'
import { API_ROOT, CONTENT_ROOT, MEDIA_FOLDER, SUPPORTED_MIME_TYPES } from './../lib/constants'


export default class ImportLibrary extends Component {
  constructor(props) {
    super(props)

    this.state = {
      importedMedia: [],
      mediaToImport: [],
      isImporting: false
    }
  }

  componentWillMount() {
    let currentWindow = remote.getCurrentWindow()
    let currentBounds = currentWindow.getBounds()
    if(currentBounds.x !== 450 && currentBounds.y !== 400) {
      currentWindow.setBounds({width: 450, height: 400, y: (screen.height / 2 - 225), x: (screen.width / 2 - 200)})
    }
  }

  componentDidMount() {
    dropbox.getFileList().then(results => {
      let media = []
      for(let i in results) {
        const nameComponents = results[i].name.split('.')
        const mime = String(nameComponents[nameComponents.length - 1]).toLowerCase()
        if(results[i]['.tag'] === 'file' && SUPPORTED_MIME_TYPES.indexOf(mime) !== -1) {
          media.push(results[i])
        }
      }
      this.setState({mediaToImport: media})
    })
  }

  componentWillUnmount() {
    let currentWindow = remote.getCurrentWindow()
    currentWindow.setBounds({width: 1024, height: 650, y: (screen.height / 2 - 325), x: (screen.width / 2 - 512)})
  }

  handleClick() {
    this.setState({isImporting: true})
    let TOKEN = localStorage.getItem('token')
    let finishAt = this.state.mediaToImport.length

    for(let i in this.state.mediaToImport) {
      let data = []
      const nameComponents = this.state.mediaToImport[i].name.split('.')
      let mime = String(nameComponents[nameComponents.length - 1]).toLowerCase()
      fetch(`${CONTENT_ROOT}/files/get_thumbnail`, {
        method: 'post',
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Dropbox-API-Arg': JSON.stringify({
            'path': `${this.state.mediaToImport[i].path_lower}`,
            'size': {'.tag': 'w640h480'}
          })
        }
      }).then(response => {
        let json = JSON.parse(response.headers.get('dropbox-api-result'))
        return response.blob().then(blob => {
          return {json, blob}
        })
      }).catch(reason => {
        // We were not able to fetch this media due to
        // an unsupported format
        --finishAt
      }).then(data => {
        let {json, blob} = data
        utils.createMediaObj(json, blob).then((media) => {
          this.setState({importedMedia: this.state.importedMedia.concat(media)})
          if(this.state.importedMedia.length === finishAt) {
            localStorage.setItem('has_imported_library', true)
            AccountActions.hasImportedLibrary(true)
            LibraryActions.saveAfterImport(this.state.importedMedia)
          }
        })
      })
    }
  }

  renderButton() {
    if(!this.state.isImporting && this.state.mediaToImport.length > 0) {
      return <a onClick={() => { this.handleClick() }} className='button'>Import Library</a>
    } else if (!this.state.isImporting && this.state.mediaToImport.length <= 0) {
      return <p>Fetching file list</p>
    } else return
  }

  renderProgressText() {
    if (this.state.isImporting) {
      return <p>Downloading {this.state.importedMedia.length} of {this.state.mediaToImport.length}</p>
    }
    return <p>Total media: {this.state.mediaToImport.length}</p>
  }

  renderWelcomeIntro() {
    if(this.props.account_info) {
      return (
        <div className='welcome'>
          <img src={this.props.account_info.profile_photo_url} />
          <h2 className={this.state.isImporting ? 'hidden' : ''}>Welcome, {this.props.account_info.name.given_name}</h2>
          <h2 className={!this.state.isImporting ? 'hidden' : ''}>You're almost done</h2>
          {this.renderButton()}
        </div>
      )
    }

    return (
      <div className='welcome'>
        <h2 className={this.state.isImporting ? 'hidden' : ''}>Welcome, stranger</h2>
        <h2 className={!this.state.isImporting ? 'hidden' : ''}>You're almost done</h2>
        {this.renderButton()}
      </div>
    )
  }

  render () {
    let shouldWait = true
    if(this.state.mediaToImport.length > 0) {
      shouldWait = false
    }

    return (
      <div className='container'>
        {this.renderWelcomeIntro()}
        <div className={shouldWait ? 'hidden bottom-bar' : 'bottom-bar'}>
          {this.renderProgressText()}
          <progress
            className={shouldWait ? 'hidden' : ''}
            value={this.state.importedMedia.length}
            max={this.state.mediaToImport.length} />
        </div>
      </div>
    )
  }
}
