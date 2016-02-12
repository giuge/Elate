import { ipcRenderer } from 'electron'
import React, { Component } from 'react'

import LibraryView from './LibraryView'
import TopBar from './TopBar'
import Sidebar from './Sidebar'
import PreviewView from './PreviewView'
import Spinner from './Spinner'


export default class MainWindow extends Component {

  renderPreview() {
    if(this.props.shouldShowPreview) {
      return (
        <PreviewView
          library={this.props.library}
          media={this.props.selectedItem} />
      )
    } return
  }

  componentDidMount() {
    ipcRenderer.on('update-downloaded', () => {
      alert('Updates ready to be installed')
      updater.install()
    })
  }

  render () {
    return (
      <div className='container'>
        <TopBar />
        {this.renderPreview()}
        <Sidebar />
        <LibraryView library={this.props.library} />
      </div>
    )
  }
}
