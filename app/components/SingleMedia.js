import React, { Component } from 'react'

export default class SingleMedia extends Component {
  render () {
    return (
      <img src={this.props.media.thumbnail} />
    )
  }
}
