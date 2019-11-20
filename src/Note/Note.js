import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './Note.css'
import context from './../context';

export default class Note extends Component {
  static contextType = context;

  render() {
    const { id, name, modified } = this.props;
    const { handleDelete } = this.context;

    return ( <div className='Note'>
      <h2 className='Note__title'>
        <Link to={`/note/${ id }`}>
          {name}
        </Link>
      </h2>
      <button className='Note__delete' type='button' onClick={() => handleDelete( id )}>
        <FontAwesomeIcon icon='trash-alt'/> {' '}
        remove
      </button>
      <div className='Note__dates'>
        <div className='Note__dates-modified'>
          Modified {' '}
          <span className='Date'>
            {format( modified, 'Do MMM YYYY' )}
          </span>
        </div>
      </div>
    </div> )
  }
}
