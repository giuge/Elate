import React, { Component } from 'react'
import { remote } from 'electron'

export default class Sidebar extends Component {
  render () {
    return (
      <div className='sidebar'>
        <ul>
          <h6>Library</h6>
          <li className='active'><img src='assets/all_media.svg'/>All media</li>
          <li className=''><img src='assets/favorites.svg'/>Favorites</li>
          <li className=''><img src='assets/albums.svg'/>Albums</li>
          <li className=''><img src='assets/shared.svg'/>Shared</li>
        </ul>
        <ul>
          <h6>Filter</h6>
          <li className='active'>Day</li>
          <li className=''>Month</li>
          <li className=''>Year</li>
        </ul>
        <ul>
          <h6>Account</h6>
          <li className=''><img src='assets/logout.svg'/>Logout</li>
        </ul>
        <div className='bottom-info'>
          <p>Version {remote.app.getVersion()}</p>
        </div>
      </div>
    )
  }
}
