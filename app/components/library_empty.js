import React, { Component } from 'react'
import {shell} from 'electron'

export default class LibraryEmpty extends Component {

  handleClick(){
    shell.openExternal('https://www.dropbox.com/en/help/289')
  }

  render () {
    return (
      <div className='libraryEmpty'>
          <img src='assets/library-empty-state.svg' />
          <h4>Your library is empty!</h4>
          <p>You need to enable camera upload for Elate to work.<br />
          <b onClick={() => {this.handleClick()}}>How do I use camera upload?</b></p>
      </div>
    )
  }
}