import alt from 'lib/alt'


class LibraryActions {
  getLibrary() {
    return (dispatch) => {
      fetch('http://jsonplaceholder.typicode.com/photos').then((response) => {
        return response.json()
      }).then((json) => {
        dispatch(json)
      })
    }
  }
}


export default alt.createActions(LibraryActions)
