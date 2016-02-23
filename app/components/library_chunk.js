import React, { Component } from 'react'
import SingleMedia from './single_media'


export default class LibraryChunk extends Component {

  constructor(props) {
    super(props)
  }

  renderLocation() {
    for(let i in this.props.chunk) {
      if(this.props.chunk[i].location !== undefined) {
        const locality = this.props.chunk[i].location.address.locality
        const country = this.props.chunk[i].location.address.countryRegion

        if(locality !== undefined && country !== undefined) {
          const location = `${locality} - ${country}`
          return <p className='location'>{location}</p>
        }
      }
    }
    return
  }

  renderDate() {
    if(this.props.date === '01 Jan 1970') {
      return <p className='date'>Sometime in the past</p>
    }
    return <p className='date'>{this.props.date}</p>
  }

  renderList() {
    return this.props.chunk.map((media) => {
      return (
        <li key={media.id} className={media.className}>
          <SingleMedia media={media} />
        </li>
      )
    })
  }

  render() {
    return (
      <div>
        <div className='meta'>
          {this.renderLocation()}
          {this.renderDate()}
        </div>
        <ul>
          {this.renderList()}
        </ul>
      </div>
    )
  }

}
