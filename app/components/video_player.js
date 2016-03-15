import React, { Component } from 'react'
import utils from './../lib/utils'

export default class VideoPlayer extends Component {

  constructor(props) {
    super(props)

    this.state = {
      objectURL: ''
    }
  }


  componentDidMount() {
    let blob = utils.dataURItoBlob(this.props.src)
    this.setState({
      objectURL: URL.createObjectURL(blob)
    })
  }


  componentWillUnmount() {
    URL.revokeObjectURL(this.state.objectURL)
  }


  render () {
    return (
      <video controls poster={this.props.poster} className='videoPlayer'>
        <source src={this.state.objectURL} type='video/mp4' />
      </video>
    )
  }

}
