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
      if(media.displayDate == date) {
        return(
          <li key={media._id}
          className={media.className}>
            <SingleMedia media={media} />
          </li>
        )
      } else {
        date = media.displayDate
        return(
          <div key={media._id} className="container">
            <div className='date'>{media.displayDate}</div>
            <li key={media.id} className={media.className}>
              <SingleMedia media={media} />
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
