import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Note from '../Note/Note'
import CircleButton from '../CircleButton/CircleButton'
import './NoteListMain.css'
import context from './../context'

export default class NoteListMain extends Component {

  static contextType = context;

  render() {
    const { notes } = this.context
    console.log( notes )

    return ( <section className='NoteListMain'>
      <ul>
        {
          notes.map( note => <li key={note.id}>
            <Note id={note.id} name={note.name} modified={note.modified}/>
          </li> )
        }
      </ul>
      <div className='NoteListMain__button-container'>
        <CircleButton tag={Link} to='/add-note' type='button' className='NoteListMain__add-note-button'>
          <FontAwesomeIcon icon='plus'/>
          <br/>
          Note
        </CircleButton>
      </div>
    </section> )
  }
}

NoteListMain.defaultProps = {
  notes: []
}
