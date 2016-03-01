import geocoder from './geocoder'
import moment from 'moment'

export default class Utils {

  /**
   * Creates a media object that will be later saved
   * to the database. It also fetches the media location.
   * @param {Object} json: the media info from Dropbox
   * @param {Binary} blob: the media thumbnail file
   */
  static createMediaObj(json, blob) {
    return new Promise((resolve, reject) => {
      let media = json
      let reader = new FileReader()
      reader.readAsDataURL(blob)

      media._id = media.id
      media.tag = media['.tag']
      delete media['.tag']

      media.isFavorite = false
      media.highResThumbnail = null

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
            media.sortDate = moment(media.media_info.metadata.time_taken).format('X')
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

  /**
   *  Smoothly scroll element to the given target (element.scrollTop)
   *  for the given duration
   *
   *  Returns a promise that's fulfilled when done, or rejected if
   *  interrupted
   */
  static smoothScrollTo(element, target, duration) {
    target = Math.round(target)
    duration = Math.round(duration)
    if (duration < 0) {
      return Promise.reject("bad duration")
    }
    if (duration === 0) {
      element.scrollTop = target
      return Promise.resolve()
    }

    var start_time = Date.now()
    var end_time = start_time + duration

    var start_top = element.scrollTop
    var distance = target - start_top

    // based on http://en.wikipedia.org/wiki/Smoothstep
    var smooth_step = function(start, end, point) {
      if(point <= start) { return 0  }
      if(point >= end) { return 1  }
      var x = (point - start) / (end - start)  // interpolation
      return x*x*(3 - 2*x)
    }

    return new Promise(function(resolve, reject) {
      // This is to keep track of where the element's scrollTop is
      // supposed to be, based on what we're doing
      var previous_top = element.scrollTop

      // This is like a think function from a game loop
      var scroll_frame = function() {
        if(element.scrollTop != previous_top) {
          reject("interrupted")
          return
        }

        // set the scrollTop for this frame
        var now = Date.now()
        var point = smooth_step(start_time, end_time, now)
        var frameTop = Math.round(start_top + (distance * point))
        element.scrollTop = frameTop

        // check if we're done!
        if(now >= end_time) {
          resolve()
          return
        }

        // If we were supposed to scroll but didn't, then we
        // probably hit the limit, so consider it done  not
        // interrupted.
        if(element.scrollTop === previous_top
          && element.scrollTop !== frameTop) {
          resolve()
          return
        }
        previous_top = element.scrollTop

        // schedule next frame for execution
        setTimeout(scroll_frame, 0)
      }

      // boostrap the animation process
      setTimeout(scroll_frame, 0)
    })
  }

}
