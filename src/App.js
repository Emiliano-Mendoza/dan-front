import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';
import {BrowserRouter as Router, Route} from 'react-router-dom';


import Navigation from './component/Navigation';
import AddObra from './component/AddObra';
import CreateClient from './component/CreateClient';
import Login from './component/Login'
import AddObraUsuario from './component/AddObraUsuario';
import CreatePago from './component/CreatePago';

function App() {
  return (
    <Router>
      <Navigation/>

      <div className="container p-4">
        <Route path="/" exact component={Login}/>
        <Route path="/obra" component={AddObra}/>
        <Route path="/obra-usuario" component={AddObraUsuario}/>
        <Route path="/client" component={CreateClient}/>
        <Route path="/pago" component={CreatePago}/>
      </div>
    </Router>
  );
}

export default App;
