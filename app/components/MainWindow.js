import React, { Component } from 'react'
import remote from 'remote'
import LibraryView from 'components/LibraryView'
import Sidebar from 'components/Sidebar'
import PreviewView from 'components/PreviewView'
import Spinner from 'components/Spinner'

import Updater from 'electron-gh-updater'


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
      owner: 'giuge',
      repo: 'Elate',
      location: '/Applications',
      appVersion: remote.app.getVersion()
    }
    const updater = new Updater(options)
    updater.check()

    updater.on('checked', updateAvailable => {
      console.log(updateAvailable)
      if(updateAvailable){
        console.log('Abbiamo un update')
        updater.download()
      }
    })

    updater.on('download-ready', () => {
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
