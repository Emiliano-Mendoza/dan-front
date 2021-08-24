import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export default class Navigation extends Component {

    cerrarSesion=()=>{
        cookies.remove('id', {path: "/"});
        cookies.remove('username', {path: "/"});
        window.location.href='./';
    }


    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container">
                    <Link className="navbar-brand" to="/">
                        Navbar
                    </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto" >
                            <li className="nav-item active">
                                <Link className="nav-link" to="/">Iniciar Sesión</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/obra">Listar Clientes</Link>
                            </li>
                            {/* <li className="nav-item">
                                <Link className="nav-link" to="/client">Crear Cliente</Link>
                            </li> */}
                            <li className="nav-item">
                                <Link className="nav-link" to="/obra-usuario">Registrar Obra</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/pago">Pagos</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/alta-producto">Alta Producto</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/nuevo-pedido">Nuevo Pedido</Link>
                            </li>
                        </ul>
                    </div>
                    <button type="button" className="cerrar-sesion-btn" onClick={()=>this.cerrarSesion()}>Cerrar Sesión</button>
                </div>
            </nav>
        )
    }
}
