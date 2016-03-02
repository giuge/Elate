import React, { Component } from 'react'
import { remote } from 'electron'

import NavigationActions from './../actions/navigation_actions'
import SelectionActions from './../actions/selection_actions'


export default class Sidebar extends Component {

  renderStatus() {
    if(this.props.isSyncingDB) {
      return(
        <div className='bottom-info sync'>
          <img src='assets/loading.svg' />
          <span>Importing</span>
        </div>
      )
    } else {
      return(
        <div className='bottom-info'>
          <p>Version {remote.app.getVersion()}</p>
        </div>
      )
    }
  }

  setActiveItem(event) {
    let listView = document.getElementsByClassName('listView')[0]
    let activeItems = document.querySelectorAll('li.active')
    for (let i in activeItems) {
      if(activeItems[i].classList) {
        activeItems[i].classList.remove('active')
      }
    }
    event.target.closest('li').classList.add('active')
    listView.scrollTop = 0

    SelectionActions.clearSelection()
  }

  showAllMedia(event) {
    this.setActiveItem(event)
    NavigationActions.showAllMedia()
  }

  showFavorites(event) {
    this.setActiveItem(event)
    NavigationActions.showFavorites()
  }

  render () {
    return (
      <div className='sidebar'>
        <ul>
          <h6>Library</h6>
          <li className='active' onClick={(event) => { this.showAllMedia(event) }}>
            <img src='assets/all-media.svg'/>All media
          </li>

          <li className='' onClick={(event) => { this.showFavorites(event) }}>
            <img src='assets/favorites.svg'/>Favorites
          </li>
          {/*<li className=''><img src='assets/albums.svg'/>Albums</li>
          <li className=''><img src='assets/shared.svg'/>Shared</li>*/}
        </ul>
        {/*<ul>
          <h6>Filter</h6>
          <li className='active'>Day</li>
          <li className=''>Month</li>
          <li className=''>Year</li>
        </ul>
        <ul>
          <h6>Account</h6>
          <li className=''><img src='assets/logout.svg'/>Logout</li>
        </ul>*/}

        {this.renderStatus()}
      </div>
    )
  }
}
