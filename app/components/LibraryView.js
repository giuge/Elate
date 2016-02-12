import _ from 'lodash'
import React, { Component } from 'react'
import ReactList from 'react-list'
import remote from 'remote'
import SingleMedia from './SingleMedia'
import Spinner from './Spinner'
import LibraryChunk from './LibraryChunk'


export default class LibraryView extends Component {

  constructor(props) {
    super(props)

    this.state = {
      chunks: []
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if(this.props.library.length === 0 && this.state.chunks.length === 0 && nextProps.library.length > 0) {
      let chunks = []
      let sorteLibrary = _.orderBy(nextProps.library, 'sortDate', 'desc' )
      let splittedLibrary = _.groupBy(sorteLibrary, 'displayDate')

      _.forEach(splittedLibrary, (value, key) => {
        chunks.push(<LibraryChunk chunk={value} date={key} key={key} />)
      })
      //nextState.chunks = chunks
      this.setState({ chunks })
      return true
    }

    return false

  }

  renderChunk(index, key) {
    return this.state.chunks[index]
  }

  renderList() {
    if(this.state.chunks.length > 0) {
      return (
        //this.state.chunks
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
