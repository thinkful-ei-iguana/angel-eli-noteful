import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import NoteListNav from '../NoteListNav/NoteListNav';
import NotePageNav from '../NotePageNav/NotePageNav';
import NoteListMain from '../NoteListMain/NoteListMain';
import NotePageMain from '../NotePageMain/NotePageMain';
import dummyStore from '../dummy-store';
import { getNotesForFolder, findNote, findFolder } from '../notes-helpers';
import config from './../config';
import Context from './../context';
import './App.css';

class App extends Component {
  state = {
    notes: [],
    folders: []
  };

  handleDelete = ( id ) => {

    const deleteNote = async () => {
      const result = await fetch( `${ config.API_ENDPOINT}/notes/${ id }`, { method: "DELETE" } )

      return result;
    }

    deleteNote().then( res => {
      if ( !res.ok ) 
        return res.json().then( r => Promise.reject( r ) );
      else {
        this.setState( {
          notes: this.state.notes.filter( n => n.id !== id )
        } )
        return res.json();
      }
    } ).catch( console.error );
  }

  componentDidMount() {
    Promise.all( [
      fetch( `${ config.API_ENDPOINT }/notes` ),
      fetch( `${ config.API_ENDPOINT }/folders` )
    ] ).then( ( [ notesRes, foldersRes ] ) => {
      if ( !notesRes.ok ) 
        return notesRes.json().then( event => Promise.reject( event ) );
      if ( !foldersRes.ok ) 
        return foldersRes.json().then( event => Promise.reject( event ) );
      return Promise.all( [ notesRes.json(), foldersRes.json() ] );
    } ).then( ( [ notes, folders ] ) => {
      this.setState( { notes, folders } )
    } ).catch( error => {
      console.log( { error } )
    } );
    // setTimeout(() => this.setState(dummyStore), 600);
  }

  renderNavRoutes() {
    const { notes, folders } = this.state;
    return ( <> {
      [ '/', '/folder/:folderId' ].map( path => ( <Route exact={true} key={path} path={path} render={routeProps => ( <NoteListNav folders={folders} notes={notes} {...routeProps}/> )}/> ) )
    } < Route path = "/note/:noteId" render = {
      routeProps => {
        const { noteId } = routeProps.match.params;
        const note = findNote( notes, noteId ) || {};
        const folder = findFolder( folders, note.folderId );
        return <NotePageNav {...routeProps} folder={folder}/>;
      }
    } /> <Route path="/add-folder" component={NotePageNav}/>
    <Route path="/add-note" component={NotePageNav}/>
  </> );
  }

  renderMainRoutes() {
    const { notes, folders } = this.state;
    return ( <> {
      [ '/', '/folder/:folderId' ].map( path => ( <Route exact={true} key={path} path={path} render={routeProps => {
          const { folderId } = routeProps.match.params;
          const notesForFolder = getNotesForFolder( notes, folderId );
          return ( <NoteListMain {...routeProps} notes={notesForFolder}/> );
        }}/> ) )
    } < Route path = "/note/:noteId" render = {
      routeProps => {
        const { noteId } = routeProps.match.params;
        const note = findNote( notes, noteId );
        return <NotePageMain {...routeProps} note={note}/>;
      }
    } /> </> );
  }

  render() {
    const value = {
      notes: this.state.notes,
      handleDelete: this.handleDelete,
      folders: this.state.folders
    }

    return ( <Context.Provider value={value}>
      <div className="App">
        <nav className="App__nav">{this.renderNavRoutes()}</nav>
        <header className="App__header">
          <h1>
            <Link to="/">Noteful</Link>{' '}
            <FontAwesomeIcon icon="check-double"/>
          </h1>
        </header>
        <main className="App__main">{this.renderMainRoutes()}</main>
      </div>
    </Context.Provider> );
  }
}

export default App;
