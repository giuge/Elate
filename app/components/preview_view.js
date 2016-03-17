import _ from 'lodash'
import request from 'superagent'
import React, { Component } from 'react'
import NavigationActions from './../actions/navigation_actions'

import VideoPlayer from './video_player'
import { Circle } from 'rc-progress'
import { CONTENT_ROOT, TOKEN } from './../lib/constants'


export default class PreviewView extends Component {

  constructor(props) {
    super(props)
    this.state = {
      media: props.media,
      library: props.library,
      mediaFile: props.media.highResThumbnail || '',
      loading: false,
      loadingPercent: 0,
      isClosingPreview: false
    }

    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.req = request
  }


  componentWillMount() {
    if(!this.props.media.highResThumbnail) {
      this.setState({
        loading: true,
        loadingPercent: 0
      })
    }
  }


  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown)
    this.downloadMedia()
  }


  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown)
  }


  downloadMedia() {
    let media = this.state.media
    // If it's a favorite we already have the high res image
    if(media.highResThumbnail) {
      return setTimeout(() => {
        this.setState({ mediaFile: media.highResThumbnail })
      }, 0)
    }

    let data = []
    let contentLength = 0
    let dataLength = 0

    this.req = request
    .post(`${CONTENT_ROOT}/files/download`)
    .set('Authorization', `Bearer ${TOKEN}`)
    .set('Dropbox-API-Arg', JSON.stringify({ 'path': `${media.path_lower}`}))
    .end((err, res) => {
      contentLength = res.headers['original-content-length']
      res.on('data', chunk  => {
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
    let {media, mediaFile, library} = this.state

    this.setState({ loading: false })
    URL.revokeObjectURL(mediaFile)

    const item = media
    const index = _.findIndex(library, o => { return o.id === item.id })
    switch(event.keyCode) {
      // Esc button pressed
      case 27:
        this.setState({ isClosingPreview: true, mediaFile: '' })
        try {
          this.req.abort()
        } catch(e) { /* We're dealing with a favorite it's ok :) */ }

        NavigationActions.hidePreview()
        break
      // Left arrow pressed
      case 37:
        try {
          this.req.abort()
        } catch(e) { /* We're dealing with a favorite it's ok :) */ }

        setTimeout(() => { this.setState({ mediaFile: ''})}, 0)
        if(index - 1 < 0) break
        this.setState({ media: library[index - 1]})
        this.downloadMedia()
        break
      // Right arrow pressed
      case 39:
        try {
          this.req.abort()
        } catch(e) { /* We're dealing with a favorite it's ok :) */ }
        setTimeout(() => { this.setState({ mediaFile: ''})}, 0)
        if(index + 1 >= library.length) break
        this.setState({ media: library[index + 1]})
        this.downloadMedia()
        break
    }
  }


  renderLoader() {
    let {loading, loadingPercent} = this.state

    if(loading) {
      return (
        <div className='circularProgress'>
          <Circle percent={loadingPercent} strokeWidth='10' strokeColor='#fff' />
        </div>
      )
    }
    return
  }


  renderMedia() {
    let {media_info, thumbnail} = this.state.media
    let {loading, mediaFile} = this.state

    if(media_info && media_info.metadata && media_info.metadata.tag === 'video') {
      if(loading || !mediaFile) {
        return <img src={thumbnail} />
      } else {
        return <VideoPlayer src={mediaFile} poster={thumbnail} />
      }
    }
    return <img src={mediaFile === '' ? thumbnail : mediaFile} />
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
