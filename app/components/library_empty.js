import React, { Component } from 'react'
import {shell} from 'electron'


const handleClick = () => {
  return shell.openExternal('https://www.dropbox.com/en/help/289')
}


const LibraryEmpty = () => (
  <div className='libraryEmpty'>
      <img src='assets/library-empty-state.svg' />
      <h4>Your library is empty!</h4>
      <p>You need to enable camera upload for Elate to work.<br />
        <b onClick={() => {handleClick()}}>
          How do I use camera upload?
        </b>
      </p>
  </div>
)


export default LibraryEmpty
