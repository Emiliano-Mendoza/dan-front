import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';
import {BrowserRouter as Router, Route} from 'react-router-dom';


import Navigation from './component/Navigation';
import ListarClientes from './component/ListarClientes';
import CreateClient from './component/CreateClient';
import Login from './component/Login'
import Perfil from './component/Perfil';
import CreatePago from './component/CreatePago';
import AltaProducto from './component/AltaProducto';
import CreatePedido from './component/CreatePedido';

function App() {
  return (
    <Router>
      <Navigation/>

      <div className="container p-4">
        <Route path="/" exact component={Login}/>
         <Route path="/listar-clientes" component={ListarClientes}/> 
        <Route path="/perfil-usuario" component={Perfil}/>
        <Route path="/client" component={CreateClient}/>
        <Route path="/pago" component={CreatePago}/>
        <Route path="/alta-producto" component={AltaProducto}/>
        <Route path="/nuevo-pedido" component={CreatePedido}/>
      </div>
    </Router>
  );
}

export default App;
