import AppDirectory from 'appdirectory'
import env from './env'

// Dropbox
export const API_ROOT = 'https://api.dropboxapi.com/2'
export const CONTENT_ROOT = 'https://content.dropboxapi.com/2'
export const APP_KEY = 'mn8nb1bz34sxpe3'
export const APP_SECRET = '0lpmbxuiiy4qe42'
export const OAUTH_REDIRECT_URL = 'http://localhost/oauth'
export const MEDIA_FOLDER = '/Camera Uploads'

// Data: we keep dev database locally
export let USER_DATA = 'data'
export let USER_CONFIG = 'data/config'
export let APP_CACHE = 'data/cache'

if(env.name === 'production') {
  var dirs = new AppDirectory({
      appName: 'elate',
      appAuthor: 'Giuseppe Germinaro',
      appVersion: 'v1'
  })
  USER_DATA = dirs.userData()
  USER_CONFIG = dirs.userConfig()
  APP_CACHE = dirs.userCache()
}

// Geocoder
export const GEOCODER_API_KEY = 'AthmNCikQpDVlLZZ_8QV4nNJaLq7bLnolOPnQgd5pJK23nyV0WT6FX7XFiUSPxQI'
export const GEOCODER_API_ROOT = `http://dev.virtualearth.net/REST/v1/Locations/`

export const SUPPORTED_MIME_TYPES = [
  'bmp', 'gif', 'jpg', 'jpeg', 'png',
  'pjpeg', 'tiff', 'webp', 'x-tiff',
  'avi', 'mp4', 'mov', 'moov', 'pdf',
  'jpe', 'mpeg'
]
