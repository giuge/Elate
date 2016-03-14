import React, { Component } from 'react'


const AlbumsEmpty = () => (
  <div className='albumsEmpty'>
      <img src='assets/albums-empty-state.svg' />
      <h4>You don’t have any album</h4>
      <p>You can create a new album by selecting some items<br />
      and clicking on the plus button in the top bar.</p>
  </div>
)


export default AlbumsEmpty
