import _ from 'lodash'
import moment from 'moment'
import geocoder from 'lib/geocoder'

const TOKEN = 'bm8ZZaJQVKsAAAAAAAEG2eJqd-pgpYsEEDtK8tolxiPacwGP3QKm7ZxaGrrq2tlI'
const API_ROOT = 'https://api.dropboxapi.com/2'
const CONTENT_ROOT = 'https://content.dropboxapi.com/2'
const MEDIA_FOLDER = '/Camera Uploads'

const SUPPORTED_MIME_TYPES = [
  'bmp', 'gif', 'jpg', 'jpeg', 'png',
  'pjpeg', 'tiff', 'webp', 'x-tiff',
  'avi', 'mp4', 'mov', 'moov', 'pdf',
  'jpe', 'mpeg'
]

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
          return this.createMediaObj(json, blob).then((media) => {
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

  static createMediaObj(json, blob) {
    return new Promise((resolve, reject) => {
      let media = json
      let reader = new FileReader()
      reader.readAsDataURL(blob)

      media.tag = media['.tag']
      delete media['.tag']

      if(media.media_info) {
        media.media_info.tag = media.media_info['.tag']
        delete media.media_info['.tag']

        if(media.media_info.metadata) {
          media.media_info.metadata.tag = media.media_info.metadata['.tag']
          delete media.media_info.metadata['.tag']

          if(media.media_info && media.media_info.metadata && media.media_info.metadata.location) {
            let lat = media.media_info.metadata.location.latitude
            let long = media.media_info.metadata.location.longitude

            geocoder.lookUp(lat, long).then(res => {
              media.location = res.resourceSets[0].resources[0]
            })
          }

          if(media.media_info.metadata.time_taken) {
            media.displayDate = moment(media.media_info.metadata.time_taken).format('DD MMM YYYY')
            media.sortDate = parseInt(moment(media.media_info.metadata.time_taken).format('X'))
          } else {
            media.displayDate = moment('1970-01-01T00:00:00Z').format('DD MMM YYYY')
            media.sortDate = moment('1970-01-01T00:00:00Z').format('X')
          }

          if(media.media_info.metadata.dimensions) {
            let width = parseInt(media.media_info.metadata.dimensions.width)
            let height = parseInt(media.media_info.metadata.dimensions.height)
            media.className = (width / height * 10) >= 10 ? 'landscape' : 'portrait'
          }
        }

      } else {
        media.displayDate = moment('1970-01-01T00:00:00Z').format('DD MMM YYYY')
        media.sortDate = moment('1970-01-01T00:00:00Z').format('X')
        media.className = 'portrait'
      }

      reader.onloadend = () => {
        media.thumbnail = reader.result
        resolve(media)
      }

    })
  }

}
