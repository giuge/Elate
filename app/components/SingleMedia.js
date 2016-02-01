import React, { Component } from 'react'
import AppActions from 'actions/AppActions'

export default class SingleMedia extends Component {

  handleDoubleClick() {
    AppActions.showPreview(this.props.media)
  }

  render () {
    return (
      <img
        onDoubleClick={() => { this.handleDoubleClick() }}
        src={this.props.media.thumbnail}
      />
    )
  }
}
