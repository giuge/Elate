import _ from 'lodash'
import React, { Component } from 'react'
import TopBar from 'components/TopBar'
import SingleMedia from 'components/SingleMedia'

import 'styles/LibraryView.scss'


export default class LibraryView extends Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    console.log(`Finished render: ${new Date()}`)
  }

  renderImage() {
    let date = ''
    return this.props.library.map((media) => {
      if(media.displayDate === date) {
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
            <div className='date'>{date === '01 Jan 1970' ? 'Undefined Date' : media.displayDate}</div>
            <li key={media.id} className={media.className}>
              <SingleMedia media={media} />
            </li>
          </div>
        )
      }
    })
  }

  render() {
    console.log(`Starting render: ${new Date()}`)
    return(
      <div className='container'>
        <TopBar />
        <ul className='listView'>{this.renderImage()}</ul>
      </div>
    )
  }

}
