const API_KEY = 'AthmNCikQpDVlLZZ_8QV4nNJaLq7bLnolOPnQgd5pJK23nyV0WT6FX7XFiUSPxQI'
const API_ROOT = `http://dev.virtualearth.net/REST/v1/Locations/`

export default class Geocoder {

  static lookUp(lat, long) {
    return new Promise((resolve, reject) => {
      fetch(`${API_ROOT}${lat},${long}?&key=${API_KEY}`).then((response) => {
        return response.json()
      }).then(json => {
        resolve(json)
      })
    })
  }

}
