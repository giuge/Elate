import React, { Component } from 'react'

import AlbumsActions from './../actions/albums_actions'


export default class AlbumItemsView extends Component {

  constructor(props) {
    super(props)
  }

  renderList() {
    return this.props.items.map(item => {
      return (
        <div className='item' key={item._id}>
          <img src={item.thumbnail} />
        </div>
      )
    })
  }

  render () {
    console.log(this.props)
    return (
      <div className='albumItemsView'>
        {this.renderList()}
      </div>
    )
  }
}
