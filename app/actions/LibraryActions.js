import alt from 'lib/alt'
import moment from 'moment'

let API_ROOT = 'https://api.dropboxapi.com/2'
let TOKEN = 'bm8ZZaJQVKsAAAAAAAEG1HhI4ZVGbgYfwUWhy3mdi6at3A_GbjGB_Udmz3UYcM1f'

class LibraryActions {

  getLibrary() {
    let allMedia = []
    return (dispatch) => {
      this._getAllMedia((results) => {
        let promises = this._arrayPromises(results)
        Promise.all(promises).then((values) => {
          for(let i in values) {
            let media = values[i]
            allMedia.push(media)
          }
          dispatch(allMedia)
        })
      })
    }
  }

  _arrayPromises(files) {
    let array = []
    for(let i in files) {
      if(files[i].media_info !== undefined) {
        let promise =
        fetch('https://content.dropboxapi.com/2/files/get_thumbnail', {
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
            let media = files[i]
            media.displayDate = moment(media.media_info.metadata.time_taken).format('DD MMM YYYY')
            media.sortDate = parseInt(moment(media.media_info.metadata.time_taken).format('X'))
            media.thumbnail = URL.createObjectURL(data)

            if(media.media_info.metadata.dimensions !== undefined) {
              let width = parseInt(media.media_info.metadata.dimensions.width)
              let height = parseInt(media.media_info.metadata.dimensions.height)
              media.className = (width / height * 10) >= 10 ? 'landscape' : 'portrait'
            }

            return media
          })
        })
        array.push(promise)
      }
    }
    return array
  }

  _getAllMedia(callback) {
    fetch(`${API_ROOT}/files/list_folder`, {
      method: 'post',
      cache: 'reload',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'text/plain; charset=dropbox-cors-hack'
      },
      body: JSON.stringify({
        'path': '/test',
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

}


export default alt.createActions(LibraryActions)
