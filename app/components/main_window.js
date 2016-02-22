import { ipcRenderer } from 'electron'
import React, { Component } from 'react'

import LibraryView from './library_view'
import TopBar from './topbar'
import Sidebar from './sidebar'
import PreviewView from './preview_view'
import Spinner from './spinner'


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
