import _ from 'lodash'
import React, { Component } from 'react'
import ReactList from 'react-list'
import TopBar from 'components/TopBar'
import SingleMedia from 'components/SingleMedia'
import LibraryChunk from 'components/LibraryChunk'

import 'styles/LibraryView.scss'


export default class LibraryView extends Component {

  constructor(props) {
    super(props)

    this.state = {
      splittedLibrary: _.groupBy(props.library, 'displayDate'),
      chunks: []
    }
  }

  componentWillMount() {
    let chunks = []
    _.forEach(this.state.splittedLibrary, (value, key) => {
      chunks.push(<LibraryChunk chunk={value} date={key} key={key} />)
    })
    this.setState({chunks: chunks})
  }

  renderChunk(index, key) {
    return this.state.chunks[index]
  }

  render() {
    return (
      <div className='container'>
        <TopBar />
        <div className='listView'>
          <ReactList
            itemRenderer={::this.renderChunk}
            length={this.state.chunks.length}
            initialIndex={0}
            pageSize={6}
            threshold={1500}
            useTranslate3d={true}
          />
        </div>
      </div>
    )
  }

}


//{this.renderChunks()}
