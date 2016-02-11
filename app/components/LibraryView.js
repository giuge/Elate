import _ from 'lodash'
import React, { Component } from 'react'
import ReactList from 'react-list'
import remote from 'remote'
import TopBar from 'components/TopBar'
import SingleMedia from 'components/SingleMedia'
import LibraryChunk from 'components/LibraryChunk'

import 'styles/LibraryView.scss'


export default class LibraryView extends Component {

  constructor(props) {
    super(props)

    this.state = {
      chunks: []
    }
  }

  componentWillMount() {
    let chunks = []
    let sorteLibrary = _.orderBy(this.props.library, 'sortDate', 'desc' )
    let splittedLibrary = _.groupBy(sorteLibrary, 'displayDate')

    _.forEach(splittedLibrary, (value, key) => {
      chunks.push(<LibraryChunk chunk={value} date={key} key={key} />)
    })
    this.setState({chunks: chunks})
  }

  componentDidMount() {
    let currentWindow = remote.getCurrentWindow()
    let currentBounds = currentWindow.getBounds()
    if(currentBounds.x !== 800 && currentBounds.y !== 600) {
      currentWindow.setBounds({
        width: 800,
        height: 600,
        x: (screen.width / 2 - 400),
        y: (screen.height / 2 - 300),
      })

    }
  }

  renderChunk(index, key) {
    return this.state.chunks[index]
  }

  render() {
    return (
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
    )
  }

}
