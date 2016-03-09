import _ from 'lodash'
import Mousetrap from 'mousetrap'
import remote, { dialog } from 'remote'

import SelectionStore from './../stores/selection_store'
import AppActions from './../actions/app_actions'
import SelectionActions from './../actions/selection_actions'
import AlbumsActions from './../actions/albums_actions'
import LibraryActions from './../actions/library_actions'
import NavigationActions from './../actions/navigation_actions'

let caller
let callerName = ''
let supportedComponents = ['LibraryView', 'FavoritesView', 'AlbumsView', 'PreviewView']


export default class KeyboardManager {

  static activate(component) {
    caller = component
    callerName = component.constructor.name

    if(supportedComponents.indexOf(callerName) == -1) {
      return console.error(`The ${callerName} component is not supported.`)
    }

    Mousetrap.bind('left', () => {this.selectPrev()})
    Mousetrap.bind('right', () => {this.selectNext()})
    Mousetrap.bind('enter', () => {this.showPreview()})
    Mousetrap.bind(['del', 'backspace'], () => {this.delete()})
    Mousetrap.bind('esc', () => {this.exit()})
  }


  static deactivate() {
    Mousetrap.unbind('left')
    Mousetrap.unbind('right')
    Mousetrap.unbind('enter')
    Mousetrap.unbind(['del', 'backspace'])
    Mousetrap.unbind('esc')
  }


  static selectPrev() {
    let {selectedItems} = SelectionStore.getState()

    switch(callerName) {
      case 'LibraryView':
        let libraryIndex = caller.props.library.indexOf(selectedItems[0])
        if(libraryIndex - 1 < 0) break
        SelectionActions.singleSelectItem(caller.props.library[libraryIndex - 1])
        this.ensureVisible()
        break

      case 'FavoritesView':
        let favoritesIndex = caller.props.favorites.indexOf(selectedItems[0])
        if(favoritesIndex - 1 < 0) break
        SelectionActions.singleSelectItem(caller.props.favorites[favoritesIndex - 1])
        this.ensureVisible()
        break

      case 'AlbumsView':
        if(caller.state.showSingleAlbum) {
          let albumsIndex = caller.state.albumItems.indexOf(selectedItems[0])
          if(albumsIndex - 1 < 0) break
          SelectionActions.singleSelectItem(caller.state.albumItems[albumsIndex - 1])
          this.ensureVisible()
          break
        } else {

        }
    }
  }


  static selectNext() {
    let {selectedItems} = SelectionStore.getState()

    switch(callerName) {
      case 'LibraryView':
        let libraryIndex = caller.props.library.indexOf(selectedItems[0])
        if(libraryIndex + 1 >= caller.props.library.length) { break }
        SelectionActions.singleSelectItem(caller.props.library[libraryIndex + 1])
        this.ensureVisible()
        break

      case 'FavoritesView':
        let favoritesIndex = caller.props.favorites.indexOf(selectedItems[0])
        if(favoritesIndex + 1 >= caller.props.favorites.length) { break }
        SelectionActions.singleSelectItem(caller.props.favorites[favoritesIndex + 1])
        this.ensureVisible()
        break

      case 'AlbumsView':
        if(caller.state.showSingleAlbum) {
          let albumsIndex = caller.state.albumItems.indexOf(selectedItems[0])
          if(albumsIndex + 1 >= caller.state.albumItems.length) { break }
          SelectionActions.singleSelectItem(caller.state.albumItems[albumsIndex + 1])
          this.ensureVisible()
          break
        }
    }
  }

  static showPreview() {
    let {selectedItems} = SelectionStore.getState()

    switch(callerName) {
      case 'LibraryView':
        let libraryIndex = caller.props.library.indexOf(selectedItems[0])
        AppActions.previewItem(caller.props.library[libraryIndex])
        break

      case 'FavoritesView':
        let favoritesIndex = caller.props.favorites.indexOf(selectedItems[0])
        AppActions.previewItem(caller.props.favorites[favoritesIndex])
        break

      case 'AlbumsView':
        if(caller.state.showSingleAlbum) {
          let albumsIndex = caller.state.albumItems.indexOf(selectedItems[0])
          AppActions.previewItem(caller.state.albumItems[albumsIndex])
          break
        }
    }
  }


  static exit() {

  }


  static delete() {
    let {selectedItems} = SelectionStore.getState()
    let pluralString = `${selectedItems.length == 1 ? 'This item' : 'These items'}`

    switch(callerName) {

      case 'LibraryView':
        let libraryMsgStr =  'will be deleted from your Elate and Dropbox library.'
        let libraryMessage = `${pluralString} ${libraryMsgStr}`

        let libraryChoice = dialog.showMessageBox(
          remote.getCurrentWindow(), {
            type: 'question',
            buttons: ['Delete', 'Cancel'],
            message: 'Delete from all your devices?',
            detail: libraryMessage
        })

        if (libraryChoice === 0) {
          LibraryActions.deleteMedia(selectedItems)
        }
        break


      case 'FavoritesView':
        let favoritesMsgStr = 'will be deleted from your Elate and Dropbox library.'
        let favoritesMessage = `${pluralString} ${favoritesMsgStr}`

        let favoritesChoice = dialog.showMessageBox(
          remote.getCurrentWindow(), {
            type: 'question',
            buttons: ['Delete', 'Cancel'],
            message: 'Delete from all your devices?',
            detail: favoritesMessage
        })

        if (favoritesChoice === 0) {
          LibraryActions.deleteMedia(selectedItems)
        }
        break

      case 'AlbumsView':
        if(caller.state.showSingleAlbum) {
          if(selectedItems.length == caller.state.selectedAlbum.items.length) {
            let deleteAlbumMsg = 'You are deleting the album and all its items'

            let albumsChoice = dialog.showMessageBox(
              remote.getCurrentWindow(), {
                type: 'question',
                buttons: ['Delete album', 'Cancel'],
                message: 'Delete album?',
                detail: deleteAlbumMsg
            })

            if (albumsChoice === 0) {
              AlbumsActions.deleteAlbum(caller.state.selectedAlbum)
              NavigationActions.showAlbums()
            }
            break
          } else {
            let albumsMsgStr = 'will be removed from this album. It will still be available in your library.'
            let albumsMessage = `${pluralString} ${albumsMsgStr}`

            let albumsChoice = dialog.showMessageBox(
              remote.getCurrentWindow(), {
                type: 'question',
                buttons: ['Remove', 'Cancel'],
                message: 'Remove from this album?',
                detail: albumsMessage
            })

            if (albumsChoice === 0) {
              AlbumsActions.removeFromAlbum(caller.state.selectedAlbum, selectedItems)
            }
            break
          }

        }
        break
    }
  }


  static ensureVisible() {
    let listView = document.getElementsByClassName('listView')[0]
    let selectedElem = document.getElementsByClassName('selected')[0]

    listView.scrollTop = selectedElem.parentNode.offsetTop - 100
  }


}
