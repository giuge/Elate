import alt from 'lib/alt'

let API_ROOT = 'https://api.dropboxapi.com/2'
let TOKEN = 'bm8ZZaJQVKsAAAAAAAEG1HhI4ZVGbgYfwUWhy3mdi6at3A_GbjGB_Udmz3UYcM1f'

class LibraryActions {

  getLibrary() {
    return (dispatch) => {
      let allMedia = []
      this._getAllMedia((results) => {
        for(let i in results) {
          if(results[i].media_info) {
            fetch('https://content.dropboxapi.com/2/files/get_thumbnail', {
              method: 'post',
              headers: {
                'Authorization': `Bearer ${TOKEN}`,
                'Dropbox-API-Arg': JSON.stringify(
                  {
                    'path': `${results[i].path_lower}`,
                    'size': {'.tag': 'w640h480'}
                  }
                )}
            }).then((response) => {
              return response.blob()
            }).then((data) => {
              let media = results[i]
              let width = parseInt(media.media_info.metadata.dimensions.width)
              let height = parseInt(media.media_info.metadata.dimensions.height)
              let aspectRatio = (width / height * 10)

              media.thumbnail = URL.createObjectURL(data)
              media.className = aspectRatio >= 10 ? 'landscape' : 'portrait'

              allMedia.push(media)
              dispatch(allMedia)
            })
          }
        }
      })
    }
  }

  _getAllMedia(callback) {
    fetch(`${API_ROOT}/files/list_folder`, {
      method: 'post',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'text/plain; charset=dropbox-cors-hack'
      },
      body: JSON.stringify({
        'path': '/Camera Uploads',
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
