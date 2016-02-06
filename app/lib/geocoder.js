import { GEOCODER_API_KEY, GEOCODER_API_ROOT } from 'lib/costants'

export default class Geocoder {

  static lookUp(lat, long) {
    return new Promise((resolve, reject) => {
      fetch(`${GEOCODER_API_ROOT}${lat},${long}?&key=${GEOCODER_API_KEY}`).then((response) => {
        return response.json()
      }).then(json => {
        resolve(json)
      })
    })
  }

}
