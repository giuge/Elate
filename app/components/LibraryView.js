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

  renderLocation(media) {
    if(media.location === undefined) return
    let location = `${media.location.address.locality} - ${media.location.address.countryRegion}`
    return (
      <p className='location'>{location}</p>
    )
  }

  renderDate(date) {
    if(date === '01 Jan 1970') {
      return <p className='date'>Sometime in the past</p>
    }
    return <p className='date'>{date}</p>
  }

  renderList() {
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
            <div className='meta'>
              {this.renderLocation(media)}
              {this.renderDate(date)}
            </div>
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
        <ul className='listView'>{this.renderList()}</ul>
      </div>
    )
  }

}
