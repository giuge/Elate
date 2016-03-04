import React, { Component } from 'react'
import remote, { dialog } from 'remote'

import connectToStores from 'alt-utils/lib/connectToStores'
import SelectionStore from './../stores/selection_store'
import NavigationActions from './../actions/navigation_actions'

export default class ActionBar extends Component {

  constructor(props) {
    super(props)
  }

  static getStores() {
    return [SelectionStore]
  }

  static getPropsFromStores() {
    return {...SelectionStore.getState()}
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.selectedItems.length <= 0) {
      let dropdowns = document.querySelectorAll('li.share .dropdown')
      for (let i in dropdowns) {
        if(dropdowns[i].classList) {
          dropdowns[i].classList.add('inactive')
        }
      }
    }
  }

  handleShare() {
    if(this.props.selectedItems.length <= 0) return
    NavigationActions.showShare()
  }

  handleAdd() {
    if(this.props.selectedItems.length <= 0) return
    NavigationActions.showAdd()
  }

  render () {
    let className = ''
    if(this.props.selectedItems.length <= 0) {
      className = 'disabled'
    }

    return (
      <ul className={`actionBar ${className}`}>
        <li className='share' onClick={() => { this.handleShare() }} />
        <li className='plus' onClick={() => { this.handleAdd() }} />
      </ul>
    )
  }
}

export default connectToStores(ActionBar)
