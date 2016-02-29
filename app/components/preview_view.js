import _ from 'lodash'
import request from 'superagent'
import React, { Component } from 'react'
import AppActions from './../actions/app_actions'

import { Circle } from 'rc-progress'
import { CONTENT_ROOT, TOKEN } from './../lib/constants'


export default class PreviewView extends Component {

  constructor(props) {
    super(props)
    this.state = {
      media: props.media,
      library: props.library,
      mediaFile: '',
      loading: false,
      loadingPercent: 0,
      isClosingPreview: false
    }

    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.req = request
  }

  componentWillMount() {
    this.setState({
      loading: true,
      loadingPercent: 0
    })
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown)
    this.downloadMedia()
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown)
  }

  downloadMedia() {
    let data = []
    let contentLength = 0
    let dataLength = 0

    this.req = request
    .post(`${CONTENT_ROOT}/files/download`)
    .set('Authorization', `Bearer ${TOKEN}`)
    .set('Dropbox-API-Arg', JSON.stringify({ 'path': `${this.state.media.path_lower}`}))
    .end((err, res) => {
      contentLength = res.headers['original-content-length']
      res.on('data', (chunk)  => {
        dataLength += chunk.length
        this.setState({
          loading: true,
          loadingPercent: (dataLength / contentLength) * 100
        })
        data.push(chunk)
      })

      res.on('end', () => {
        data = Buffer.concat(data)
        let blob = new Blob([data])
        if(!this.state.isClosingPreview) {
          this.setState({
            mediaFile: URL.createObjectURL(blob),
            loadingPercent: 100
          })
          // Let the animation finish before unloading the spinner
          setTimeout(() => {
            this.setState({
              loading: false,
              loadingPercent: 0
          }) }, 300)
        }
      })
    })
  }

  handleKeyDown(event) {
    this.setState({ loading: false })
    URL.revokeObjectURL(this.state.mediaFile)

    const item = this.state.media
    const index = _.findIndex(this.state.library, o => { return o.id === item.id })
    switch(event.keyCode) {
      // Esc button pressed
      case 27:
        this.setState({ isClosingPreview: true, mediaFile: '' })
        this.req.abort()
        AppActions.hidePreview()
        break
      // Left arrow pressed
      case 37:
        this.req.abort()
        setTimeout(() => { this.setState({ mediaFile: ''})}, 0)
        if(index - 1 < 0) break
        this.setState({ media: this.state.library[index - 1]})
        this.downloadMedia()
        break
      // Right arrow pressed
      case 39:
        this.req.abort()
        setTimeout(() => { this.setState({ mediaFile: ''})}, 0)
        if(index + 1 >= this.state.library.length) break
        this.setState({ media: this.state.library[index + 1]})
        this.downloadMedia()
        break
    }
  }

  renderLoader() {
    if(this.state.loading) {
      return (
        <div className='circularProgress'>
          <Circle percent={this.state.loadingPercent} strokeWidth='10' strokeColor='#fff' />
        </div>
      )
    }
    return
  }

  renderMedia() {
    if(this.state.media.media_info &&
      this.state.media.media_info.metadata &&
      this.state.media.media_info.metadata.tag === 'video') {
      if(this.state.loading || this.state.mediaFile === '') {
        return <img src={this.state.media.thumbnail} />
      } else {
        // TODO: We need to create a better video component to use
        return <video src={this.state.mediaFile} controls poster={this.state.media.thumbnail} />
      }
    }
    return <img src={this.state.mediaFile === '' ? this.state.media.thumbnail : this.state.mediaFile} />
  }

  render () {
    return (
      <div className='mediaPreview'>
        <div>
          {this.renderLoader()}
          {this.renderMedia()}
        </div>
      </div>
    )
  }

}
