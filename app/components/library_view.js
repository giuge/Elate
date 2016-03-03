import _ from 'lodash'
import React, { Component } from 'react'
import ReactList from 'react-list'
import remote from 'remote'
import SingleMedia from './single_media'
import Spinner from './spinner'
import ActionBar from './action_bar'
import LibraryChunk from './library_chunk'


export default class LibraryView extends Component {

  constructor(props) {
    super(props)

    this.state = {
      chunks: []
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.library) {
      let chunks = []
      let sortedLibrary = _.orderBy(nextProps.library, 'sortDate', 'desc' )
      let splittedLibrary = _.groupBy(sortedLibrary, 'displayDate')

      _.forEach(splittedLibrary, (value, key) => {
        chunks.push(
          <LibraryChunk chunk={value} date={key} key={key} />
        )
      })
      //nextState.chunks = chunks
      this.setState({ chunks })
    }
  }

  renderChunk(index, key) {
    return this.state.chunks[index]
  }

  renderList() {
    if(this.state.chunks.length > 0) {
      return (
        <ReactList
          itemRenderer={::this.renderChunk}
          length={this.state.chunks.length}
          initialIndex={0}
          pageSize={6}
          threshold={1500}
          useTranslate3d={true}
        />
      )
    }
    return <Spinner />
  }

  render() {
    return (
      <div className='listView'>
        {this.renderList()}
      </div>
    )
  }

}
