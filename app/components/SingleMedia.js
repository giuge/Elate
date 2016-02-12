import React, { Component } from 'react'
import AppActions from './../actions/AppActions'


export default class SingleMedia extends Component {

  handleDoubleClick() {
    AppActions.showPreview(this.props.media)
  }

  renderDuration() {
    if(this.props.media.media_info && this.props.media.media_info.metadata) {
      if(this.props.media.media_info.metadata.duration) {
        let ms = this.props.media.media_info.metadata.duration
        let min = (ms/1000/60) << 0
        let sec = parseInt((ms/1000) % 60)

        return <p>{`${min < 10 ? '0' + min : min }:${sec < 10 ? '0' + sec : sec }`}</p>
      }
    }
  }

  render () {
    if(this.props.media.media_info &&
      this.props.media.media_info.metadata &&
      this.props.media.media_info.metadata.tag === 'video') {
      return (
        <div className='video'>
          <img
            onDoubleClick={() => { this.handleDoubleClick() }}
            src={this.props.media.thumbnail}
            className='picture' />
          {this.renderDuration()}
        </div>
      )
    }
    return (
      <div className='picture'>
        <img
          onDoubleClick={() => { this.handleDoubleClick() }}
          src={this.props.media.thumbnail}
          className='picture' />
      </div>
    )
  }
}
