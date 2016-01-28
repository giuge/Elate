import axios from 'axios'
import alt from 'lib/alt'

const SearchSource = (alt) => {

  fetch: () => {
    return axios.get(`/search/q/${state.value}`)
  }


}
