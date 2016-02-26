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

  render () {
    return (
      <div className='container'>
        {process.platform === 'darwin' ? <TopBar /> : ''}
        {this.renderPreview()}
        <Sidebar isSyncingDB={this.props.isSyncingDB} />
        <LibraryView library={this.props.library} />
      </div>
    )
  }
}
