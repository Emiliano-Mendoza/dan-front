import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';
import {BrowserRouter as Router, Route} from 'react-router-dom';

import Navigation from './component/Navigation';
import NoteList from './component/NoteList';
import CreateNote from './component/CreateNote';
import CreateClient from './component/CreateClient';

function App() {
  return (
    <Router>
      <Navigation/>

      <div className="container p-4">
        <Route path="/" exact component={NoteList}/>
        <Route path="/edit/:id" component={CreateNote}/>
        <Route path="/create" component={CreateNote}/>
        <Route path="/client" component={CreateClient}/>
      </div>
    </Router>
  );
}

export default App;
