import moment from 'moment'
import _ from 'lodash'

const TOKEN = 'bm8ZZaJQVKsAAAAAAAEG2eJqd-pgpYsEEDtK8tolxiPacwGP3QKm7ZxaGrrq2tlI'
const API_ROOT = 'https://api.dropboxapi.com/2'
const CONTENT_ROOT = 'https://content.dropboxapi.com/2'
const MEDIA_FOLDER = '/test'


export default class Dropbox {

  static getFileList(callback) {
    fetch(`${API_ROOT}/files/list_folder`, {
      method: 'post',
      cache: 'reload',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'text/plain; charset=dropbox-cors-hack'
      },
      body: JSON.stringify({
        'path': MEDIA_FOLDER,
        'recursive': true,
        'include_media_info': true
      })
    }).then((response) => {
      return response.json()
    }).then((json) => {
      callback(json.entries)
    })
    return false
  }

  static getAllMedia(files) {
    let array = []
    for(let i in files) {
      if(files[i].media_info !== undefined) {
        let promise = fetch(`${CONTENT_ROOT}/files/get_thumbnail`, {
          method: 'post',
          headers: {
            'Authorization': `Bearer ${TOKEN}`,
            'cache': 'default',
            'Dropbox-API-Arg': JSON.stringify({
              'path': `${files[i].path_lower}`,
              'size': {'.tag': 'w640h480'}
            })
          }
        }).then((response) => {
          return response.blob().then((data) => {
            return this.createMediaObj(files[i], data).then((media) => {
              return media
            })
          })
        })
        array.push(promise)
      }
    }
    return array
  }

  static getUnsyncedMedia(files) {
    let array = []
    for(let i in files) {
      if(files[i].media_info !== undefined) {
        let promise = fetch(`${CONTENT_ROOT}/files/get_thumbnail`, {
          method: 'post',
          headers: {
            'Authorization': `Bearer ${TOKEN}`,
            'Dropbox-API-Arg': JSON.stringify({
              'path': `${files[i].path_lower}`,
              'size': {'.tag': 'w640h480'}
            })
          }
        }).then((response) => {
          return response.blob().then((data) => {
            return this.createMediaObj(files[i], data).then((media) => {
              return media
            })
          })
        })
        array.push(promise)
      }
    }
    return array
  }

  static createMediaObj(file, blob) {
    return new Promise((resolve, reject) => {
      let media = file
      let reader = new FileReader()
      reader.readAsDataURL(blob)

      media.tag = media['.tag']
      media.media_info.metadata.tag = media.media_info.metadata['.tag']
      media.media_info.tag = media.media_info['.tag']

      delete media['.tag']
      delete media.media_info['.tag']
      delete media.media_info.metadata['.tag']

      media.displayDate = moment(media.media_info.metadata.time_taken).format('DD MMM YYYY')
      media.sortDate = parseInt(moment(media.media_info.metadata.time_taken).format('X'))

      if(media.media_info.metadata.dimensions !== undefined) {
        let width = parseInt(media.media_info.metadata.dimensions.width)
        let height = parseInt(media.media_info.metadata.dimensions.height)
        media.className = (width / height * 10) >= 10 ? 'landscape' : 'portrait'
      } else {
        media.className = 'portrait'
      }

      reader.onloadend = function() {
        media.thumbnail = blob = reader.result
        resolve(media)
      }
    })
  }

}
