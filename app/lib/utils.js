import geocoder from './geocoder'
import moment from 'moment'

export default class Utils {

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
