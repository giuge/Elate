import React, { Component } from 'react'
import remote from 'remote'
import LibraryView from 'components/LibraryView'
import Sidebar from 'components/Sidebar'
import PreviewView from 'components/PreviewView'
import Spinner from 'components/Spinner'

import GhReleases from 'electron-gh-releases'


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
    let options = {
      repo: 'https://github.com/giuge/Elate.git',
      currentVersion: remote.app.getVersion()
    }
    const updater = new GhReleases(options)

    updater.check((err, status) => {
      console.log(status)
      console.log(err)
      if (!err && status) {
        alert(status)
        updater.download()
      }
    })

    // When an update has been downloaded
    // updater.on('update-downloaded', (info) => {
    //   // Restart the app and install the update
    //   updater.install()
    // })

    // Access electrons autoUpdater
    // updater.autoUpdater
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
