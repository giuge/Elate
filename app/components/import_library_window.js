import React, { Component } from 'react'
import remote from 'remote'
import dropbox from './../lib/dropbox'
import utils from './../lib/utils'
import { API_ROOT, CONTENT_ROOT, MEDIA_FOLDER, SUPPORTED_MIME_TYPES, TOKEN, refreshToken } from './../lib/constants'

import TopBar from './topbar'
import LibraryActions from './../actions/library_actions'
import AccountActions from './../actions/account_actions'


export default class ImportLibraryWindow extends Component {

  constructor(props) {
    super(props)

    this.state = {
      importedMedia: [],
      mediaToImport: [],
      isImporting: false
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


  handleClick() {
    let finishAt = this.state.mediaToImport.length

    this.setState({isImporting: true})

    for(let i in this.state.mediaToImport) {
      let data = []
      const nameComponents = this.state.mediaToImport[i].name.split('.')
      let mime = String(nameComponents[nameComponents.length - 1]).toLowerCase()
      fetch(`${CONTENT_ROOT}/files/get_thumbnail`, {
        method: 'post',
        headers: {
          'Authorization': `Bearer ${TOKEN || refreshToken()}`,
          'Dropbox-API-Arg': JSON.stringify({
            'path': `${this.state.mediaToImport[i].path_lower}`,
            'size': {'.tag': 'w640h480'}
          })
        }
      }).then((response) => {
        let json = JSON.parse(response.headers.get('dropbox-api-result'))
        return response.blob().then(blob => {
          return {json, blob}
        })
      }).catch((reason) => {
        // We were not able to fetch this media due to an unsupported format
        --finishAt
      }).then(data => {
        let {json, blob} = data
        utils.createMediaObj(json, blob).then((media) => {
          this.setState({importedMedia: this.state.importedMedia.concat(media)})
          if(this.state.importedMedia.length === finishAt) {
            AccountActions.hasImportedLibrary(true)
            LibraryActions.saveAfterImport(this.state.importedMedia)
          }
        })
      })
    }
  }


  renderButton() {
    let {isImporting, mediaToImport} = this.state

    if(!isImporting && mediaToImport.length > 0) {
      return <a onClick={() => { this.handleClick() }} className='button'>Import Library</a>
    } else if (!isImporting && mediaToImport.length <= 0) {
      return <p>Fetching file list</p>
    } else return
  }


  renderProgressText() {
    let {isImporting, mediaToImport, importedMedia} = this.state

    if (isImporting) {
      return <p>Downloading {importedMedia.length} of {mediaToImport.length}</p>
    }
    return <p>Total media: {mediaToImport.length}</p>
  }


  renderWelcomeIntro() {
    let {account_info} = this.props
    let {isImporting} = this.state

    if(account_info) {
      return (
        <div className='welcome'>
          <img src={account_info.profile_photo_url} />
          <h2 className={isImporting ? 'hidden' : ''}>Welcome, {account_info.name.given_name}</h2>
          <h2 className={!isImporting ? 'hidden' : ''}>This may take a while</h2>
          {this.renderButton()}
        </div>
      )
    }

    return (
      <div className='welcome'>
        <h2 className={isImporting ? 'hidden' : ''}>Welcome, stranger</h2>
        <h2 className={!isImporting ? 'hidden' : ''}>You're almost done</h2>
        {this.renderButton()}
      </div>
    )
  }


  render () {
    let {mediaToImport, importedMedia} = this.state
    let shouldWait = true

    if(mediaToImport.length > 0) {
      shouldWait = false
    }

    return (
      <div className='container'>
        <TopBar />
        {this.renderWelcomeIntro()}
        <div className={shouldWait ? 'hidden bottom-bar' : 'bottom-bar'}>
          {this.renderProgressText()}
          <progress
            className={shouldWait ? 'hidden' : ''}
            value={importedMedia.length}
            max={mediaToImport.length} />
        </div>
      </div>
    )
  }

}
