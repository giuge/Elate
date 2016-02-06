import React, { Component } from 'react'
import dropbox from 'lib/dropbox'
import utils from 'lib/utils'
import LibraryActions from 'actions/LibraryActions'
import AccountActions from 'actions/AccountActions'
import { TOKEN, API_ROOT, CONTENT_ROOT, MEDIA_FOLDER, SUPPORTED_MIME_TYPES } from 'lib/costants'


export default class ImportLibrary extends Component {
  constructor(props) {
    super(props)

    this.state = {
      importedMedia: [],
      mediaToImport: []
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
        console.log(finishAt)
      }).then(data => {
        let {json, blob} = data
        utils.createMediaObj(json, blob).then((media) => {
          this.setState({importedMedia: this.state.importedMedia.concat(media)})
          if(this.state.importedMedia.length === finishAt) {
            console.log('Saving to db')
            AccountActions.hasImportedLibrary(true)
            LibraryActions.saveAfterImport(this.state.importedMedia)
          }
        })
      })
    }
  }

  render () {
    return (
      <div className='container'>
        <h1>Welcome to Elate</h1>
        <a onClick={() => { this.handleClick() }}>Import Library</a>
        <progress
          value={this.state.importedMedia.length}
          max={this.state.mediaToImport.length} />
        <p>Downloading {this.state.importedMedia.length} of {this.state.mediaToImport.length}</p>
      </div>
    )
  }
}
