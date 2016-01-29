import React, { Component } from 'react'
import TopBar from 'components/TopBar'
import SingleMedia from 'components/SingleMedia'

import 'styles/LibraryView.scss'

export default class LibraryView extends Component {

  constructor(props) {
    super(props)
  }

  renderImage() {
    var date
    return this.props.library.map((media) => {
      if(media.media_info.time_taken == date) {
        return(
          <li key={media.id}
          className={media.className}>
            <SingleMedia media={media} />
          </li>
        )
      } else {
        date = media.media_info.time_taken
        return(
          <div key={media.id} className="container">
            <div className='date'>{date}</div>
            <li key={media.id} className={media.className}>
              <SingleMedia photo={media} />
            </li>
          </div>
        )
      }
    })
  }

  render() {
    return(
      <div className='container'>
        <TopBar />
        <ul className='listView'>{this.renderImage()}</ul>
      </div>
    )
  }

}
