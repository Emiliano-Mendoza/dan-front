import React, { Component } from 'react'
import './css/Login.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export default class Login extends Component {
    state = {
        form: {
            username: '',
            password: ''
        }
    }
    handleChange = async e => {
        await this.setState({
            form: {
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        });
    }
    // { params: { user: this.state.form.username, password: this.state.form.password } }

    /*
    .then(response => {
                return response.data;
            })
            .then(response => {
                if (response.length > 0) {
                    var respuesta = response[0];
                    cookies.set('id', respuesta.id, { path: "/" });
                    cookies.set('user', respuesta.user, { path: "/" });

                    alert(`Bienvenido ${respuesta.user}`);
                    window.location.href = "./client";
                } else {
                    alert('El usuario o la contraseña no son correctos');
                }
            })
            .catch(error => {
                console.log(error);
            })
    */

    iniciarSesion = async () => {
        await axios.get("http://localhost:7000/ms-usuario/api/usuario/id/" + 2)
        .then(response => {
            console.log(response.data);
            return response.data;
        })
        .then(response => {
            console.log(response.length);
            if (1) {
                var respuesta = response;
                cookies.set('id', respuesta.id, { path: "/" });
                cookies.set('username', respuesta.user, { path: "/" });

                alert(`Bienvenido ${respuesta.user}`);
                window.location.href = "./client";
            } else {
                alert('El usuario o la contraseña no son correctos');
            }
        })
        .catch(error => {
            console.log(error);
        });

    }

    componentDidMount() {
        if(cookies.get('username')){
            window.location.href="./client";
        }
    }

    render() {
        return (
            <div className="containerPrincipal">
                <div className="containerSecundario">
                    <div className="form-group">
                        <label>Usuario: </label>
                        <br />
                        <input
                            type="text"
                            className="form-control"
                            name="username"
                            onChange={this.handleChange}
                        />
                        <br />
                        <label>Contraseña: </label>
                        <br />
                        <input
                            type="password"
                            className="form-control"
                            name="password"
                            onChange={this.handleChange}
                        />
                        <br />
                        <button className="btn btn-primary" onClick={() => this.iniciarSesion()}>Iniciar Sesión</button>
                    </div>
                </div>
            </div>
        );
    }
}
