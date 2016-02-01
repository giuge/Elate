import React, { Component } from 'react'
import _ from 'lodash'
import AppActions from 'actions/AppActions'

import 'styles/PreviewView.scss'


export default class PreviewView extends Component {

  constructor(props) {
    super(props)
    this.state = {
      previewItem: this.props.media
    }
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown.bind(this), true)
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown.bind(this), true)
  }

  handleKeyDown(event) {
    const item = this.props.media
    switch(event.keyCode) {
      case 27:
        this.handleEscDownKey()
        break
      case 37:
        this.handleLeftArrowDown()
        break
      case 39:
        this.handleRightArrowDown()
        break
    }
  }

  handleLeftArrowDown () {
    //if(this.state.previewItem === this.props.library[0]) return

    for(let i in this.props.library) {
      if(this.state.previewItem === this.props.library[i]) {
        this.setState({
          previewItem: this.props.library[i - 1]
        })
        return
      }
    }
  }

  handleRightArrowDown () {
    if(this.state.previewItem === this.props.library[this.props.library.length - 1]) return
    let found = false
    for(let i in this.props.library) {
      if(found) {
        this.setState({
          previewItem: this.props.library[i]
        })
        return
      }
      if(this.state.previewItem === this.props.library[i]) {
        found = true
      }
    }
  }

  handleEscDownKey() {
    AppActions.hidePreview()
  }


  render () {
    return (
      <div className='mediaPreview'>
        <img src={this.state.previewItem.thumbnail} />
        <a onClick={() => { AppActions.hidePreview() }}>Back</a>
      </div>
    )
  }
}
