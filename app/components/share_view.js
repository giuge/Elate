import React, { Component } from 'react'
import {shell} from 'electron'
import childProcess from 'child_process'
import utils from './../lib/utils'


export default class ShareView extends Component {

  sendEmail() {
    let cmd = `open -a Mail `

    this.props.selectedItems.map(img => {
      let blob = utils.dataURItoBlob(img.thumbnail)
      let url = URL.createObjectURL(blob)
      cmd += `"${img.thumbnail}" `
    })

    return childProcess.execSync(cmd, () => {
      console.log(cmd)
    })

    // return shell.openExternal(link)
  }

  render () {
    return (
      <div className='shareView'>
        <h2>Share items</h2>
        <button onClick={() => this.sendEmail()}>
          Send via Email
        </button>
      </div>
    )
  }

}
