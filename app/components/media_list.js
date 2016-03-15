import _ from 'lodash'
import React, { Component, PropTypes } from 'react'
import {findDOMNode} from 'react-dom'

import ReactList from 'react-list'
import SingleMedia from './single_media'
import Spinner from './spinner'
import MediaListChunk from './media_list_chunk'


export default class MediaList extends Component {

  constructor(props) {
    super(props)

    this.state = {
      chunks: []
    }
  }


  static propTypes = {
    library: PropTypes.array.isRequired
  }


  shouldComponentUpdate(nextProps, nextState) {
    if(this.props.library == nextProps.library) {
      return false
    }
    return true
  }


  componentWillReceiveProps(nextProps) {
    if(nextProps.library.length > 0) {

      let chunks = []
      let sortedLibrary = _.orderBy(nextProps.library, 'sortDate', 'desc' )
      let splittedLibrary = _.groupBy(sortedLibrary, 'displayDate')

      _.forEach(splittedLibrary, (value, key) => {
        chunks.push(
          <MediaListChunk chunk={value} date={key} key={key} />
        )
      })
      this.setState({chunks})
    }
  }


  componentWillMount() {
    let chunks = []
    let sortedLibrary = _.orderBy(this.props.library, 'sortDate', 'desc' )
    let splittedLibrary = _.groupBy(sortedLibrary, 'displayDate')

    _.forEach(splittedLibrary, (value, key) => {
      chunks.push(
        <MediaListChunk chunk={value} date={key} key={key} />
      )
    })

    this.setState({chunks})
  }


  renderChunk(index) {
    return this.state.chunks[index]
  }


  render() {
    if(this.state.chunks.length > 0) {
      return (
        <ReactList
          itemRenderer={::this.renderChunk}
          length={this.state.chunks.length}
          type='simple'
          initialIndex={0}
          pageSize={3}
          threshold={1500}
          useTranslate3d={true}
        />
      )
    }
    return <Spinner />
  }

}
