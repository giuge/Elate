import React, { Component } from 'react'


const FavoritesEmpty = () => (
  <div className='favoritesEmpty'>
      <img src='assets/favorites-empty-state.svg' />
      <h4>You don’t have any favorite picture</h4>
      <p>You can add an item to favorites by clicking on the heart <br />
        that shows up when you hover over a picture (top left).</p>
  </div>
)


export default FavoritesEmpty
