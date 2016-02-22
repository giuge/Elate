import remote from 'remote'
import jetpack from 'fs-jetpack'
import path from 'path'
import env from './env'

// Where we store databases, preferences, etc
export let USER_DATA = remote.app.getPath('userData')

// Dropbox token stuff
export function refreshToken() {
  let accountDBPath = path.join(USER_DATA, 'account.db')
  try {
    /**
     * Nedb adds lines to the database when adding new data.
     * We need to make sure we get the token even after a save.
     */
    let accountDB = JSON.parse(`${jetpack.read(accountDBPath)}`.split('\n').filter(Boolean).slice(-1)[0])
    return accountDB.token != '' ? accountDB.token : null
  } catch(e) {
    return null
  }
}
export let TOKEN = refreshToken()

// Dropbox API stuff
export const API_ROOT = 'https://api.dropboxapi.com/2'
export const CONTENT_ROOT = 'https://content.dropboxapi.com/2'
export const APP_KEY = 'mn8nb1bz34sxpe3'
export const APP_SECRET = '0lpmbxuiiy4qe42'
export const OAUTH_REDIRECT_URL = 'http://localhost/oauth'
export const MEDIA_FOLDER = '/test'

// Geocoder
export const GEOCODER_API_KEY = 'AthmNCikQpDVlLZZ_8QV4nNJaLq7bLnolOPnQgd5pJK23nyV0WT6FX7XFiUSPxQI'
export const GEOCODER_API_ROOT = `http://dev.virtualearth.net/REST/v1/Locations/`

// Media we support in our app
export const SUPPORTED_MIME_TYPES = [
  'bmp', 'gif', 'jpg', 'jpeg', 'png',
  'pjpeg', 'tiff', 'webp', 'x-tiff',
  'avi', 'mp4', 'mov', 'moov', 'pdf',
  'jpe', 'mpeg'
]
