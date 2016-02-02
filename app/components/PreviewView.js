import _ from 'lodash'
import React, { Component } from 'react'
import AppActions from 'actions/AppActions'

import 'styles/PreviewView.scss'


export default class PreviewView extends Component {

  constructor(props) {
    super(props)
    this.state = {
      media: props.media,
      library: props.library
    }
    this.handleKeyDown = this.handleKeyDown.bind(this)
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown)
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown)
  }

  handleKeyDown(event) {
    const item = this.state.media
    const index = _.findIndex(this.state.library, o => { return o.id === item.id })
    switch(event.keyCode) {
      // Esc button pressed
      case 27:
        AppActions.hidePreview()
        break
      // Left arrow pressed
      case 37:
        if(index - 1 < 0) break
        this.setState({ media: this.state.library[index - 1]})
        break
      // Right arrow pressed
      case 39:
      if(index + 1 >= this.state.library.length) break
        this.setState({ media: this.state.library[index + 1]})
        break
    }
  }

  render () {
    return (
      <div className='mediaPreview'>
        <img src={this.state.media.thumbnail} />
        <a onClick={() => { AppActions.hidePreview() }}>Back</a>
      </div>
    )
  }

}
