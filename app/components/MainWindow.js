import ipc from 'ipc'
import React, { Component } from 'react'
import LibraryView from 'components/LibraryView'
import Sidebar from 'components/Sidebar'
import PreviewView from 'components/PreviewView'
import Spinner from 'components/Spinner'


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
    ipc.on('update-downloaded', () => {
      alert('Updates ready to be installed')
      updater.install()
    })
  }

  render () {
    return (
      <div className='container'>
        {this.renderPreview()}
        <Sidebar />
        <LibraryView library={this.props.library} />
      </div>
    )
  }
}
