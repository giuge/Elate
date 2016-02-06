import _ from 'lodash'
import utils from 'lib/utils'

import { TOKEN, API_ROOT, CONTENT_ROOT, MEDIA_FOLDER, SUPPORTED_MIME_TYPES } from 'lib/costants'


export default class Dropbox {

  static getFileList() {
    return new Promise((resolve, reject) => {
      let entries = []
      fetch(`${API_ROOT}/files/list_folder`, {
        method: 'post',
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Content-Type': 'text/plain; charset=dropbox-cors-hack'
        },
        body: JSON.stringify({
          'path': MEDIA_FOLDER,
          'recursive': true
        })
      }).then((response) => {
        return response.json()
      }).then((json) => {
        if(json.has_more) {
          console.log(`Get file continue called`)
          this.getFromCursor(json.cursor).then(entries => {
            entries.push(json.entries)
            resolve(_.flattenDeep(entries))
          })
        } else {
          entries.push(json.entries)
          resolve(_.flattenDeep(entries))
        }
      })
    })
  }

  static getFromCursor(cursor, entries) {
    return new Promise((resolve, reject) => {
      let allEntries = []
      if(entries) allEntries.push(entries)

      fetch(`${API_ROOT}/files/list_folder/continue`, {
        method: 'post',
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Content-Type': 'text/plain; charset=dropbox-cors-hack'
        },
        body: JSON.stringify({
          'cursor': cursor
        })
      }).then(response => {
        return response.json()
      }).then(json => {
        if(json.has_more) {
          console.log(`Has more need to fetch again`)
          this.getFromCursor(json.cursor, json.entries).then(entries => {
            console.log(`Fetched more entries: ${entries.length}`)
            allEntries.push(entries)
          })
        } else {
          allEntries.push(json.entries)
          resolve(_.flattenDeep(allEntries))
        }
      })
    })
  }

  static getAllMedia(files) {
    let array = []
    for(let i in files) {
      const nameComponents = files[i].name.split('.')
      let mime = String(nameComponents[nameComponents.length - 1]).toLowerCase()
      if(files[i]['.tag'] === 'file' && SUPPORTED_MIME_TYPES.indexOf(mime) !== -1) {

        let promise = fetch(`${CONTENT_ROOT}/files/get_thumbnail`, {
          method: 'post',
          headers: {
            'Authorization': `Bearer ${TOKEN}`,
            'Dropbox-API-Arg': JSON.stringify({
              'path': `${files[i].path_lower}`,
              'size': {'.tag': 'w640h480'}
            })
          }
        }).then(response => {
          let json = JSON.parse(response.headers.get('dropbox-api-result'))
          return response.blob().then(blob => {
            return {json, blob}
          })
        }).then(data => {
          let {json, blob} = data
          return utils.createMediaObj(json, blob).then((media) => {
            return media
          })
        })

        array.push(promise)
      }
    }
    return array
  }

  static downloadMedia(path) {
    return new Promise((resolve, reject) => {
      fetch(`${CONTENT_ROOT}/files/download`, {
        method: 'post',
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Dropbox-API-Arg': JSON.stringify({
            'path': `${path}`,
          })
        }
      }).then(response => {
        return response.blob()
      }).then(blob => {
        resolve(blob)
      })
    })
  }

}
