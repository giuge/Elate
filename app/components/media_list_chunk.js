import React, { Component, PropTypes } from 'react'
import SingleMedia from './single_media'


const MediaListChunk = ({chunk, date}) => {

  const renderLocation = () => {
    for(let i in chunk) {
     if(chunk[i].location) {
       const locality = chunk[i].location.address.locality
       const country = chunk[i].location.address.countryRegion

       if(locality && country) {
         const location = `${locality} - ${country}`
         return <p className='location'>{location}</p>
       }
     }
   }
   return
  }


  const renderDate = () => {
    if(date === '01 Jan 1970') {
      return <p className='date'>Sometime in the past</p>
    }
    return <p className='date'>{date}</p>
  }


  const renderList = () => {
    return chunk.map(media => {
      return (
        <li key={media.id} className={media.className}>
          <SingleMedia media={media} />
        </li>
      )
    })
  }


  return (
    <div>
      <div className='meta'>
        {renderLocation()}
        {renderDate()}
      </div>
      <ul>
        {renderList()}
      </ul>
    </div>
  )

}


export default MediaListChunk
