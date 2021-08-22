import React, { Component } from 'react'
import axios from 'axios'
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export default class CreatePedido extends Component {

    state = {
        pedidos: [],
        client: {
            razonSocial: '',
            obras: []
        },

        form: {
            fechaPedido: '',
            obra: {},
            detalle: [],
            estado: null
        },

        detallePed: {
            producto: {
                id: null
            },
            cantidad: null,
            precio: null
        },

        ventanaNuevoPedido: false,

        idLi: ''
    }

    async componentDidMount() {
        if (!cookies.get('username')) {
            window.location.href = "./";
        } else {
            this.getClient();
        }
    }

    async getClient() {
        const res = await axios.get('http://localhost:7000/ms-usuario/api/cliente/mail/' + cookies.get('username'));
        await this.setState({ client: res.data });
    }


    handleChange = (e) => {
        this.setState({
            form: {
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        });
        //console.log(e.target.value + "   " + e.target.name);
    }
    getCurrentDate = () => {
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        let yyyy = today.getFullYear();

        today = yyyy + '-' + mm + '-' + dd;
        return today;
    }

    abrirVentana = async (id) => {
        await this.setState({
            ventanaNuevoPedido: true,
            idLi: id
        })
    }
    cerrarVentana = async () => {
        await this.setState({
            ventanaNuevoPedido: false,
            
        })
    }

    render() {
        return (
            <div className="row">
                <div className="col-md-8">
                    <ul className="list-group">
                        <h4>{this.state.client.razonSocial}</h4>
                        {
                            this.state.client.obras.map(obra => (
                                <li className="list-group-item" key={obra.id}>
                                    <p>Descripcion: {obra.descripcion}</p>

                                    {this.state.ventanaNuevoPedido && obra.id === this.state.idLi ?
                                        <>
                                            <h4>Nuevo Pedido:</h4>
                                            <form>
                                                <div className="form-group">
                                                    <h6>Fecha: </h6>
                                                    <input type='text' className="form-control input-pago" name="fechaPedido" value={this.getCurrentDate()} disabled />
                                                </div>
                                            </form>
                                        </> : null}

                                    {this.state.ventanaNuevoPedido && obra.id === this.state.idLi ?
                                        
                                        <button type="button" className="deletebtn btn btn-primary" onClick={() => this.cerrarVentana()}>Confirmar</button> :
                                        <button type="button" className="deletebtn btn btn-primary" onClick={() => this.abrirVentana(obra.id)}>Nuevo Pedido</button>}
                                </li>)
                            )
                        }
                    </ul>
                </div>
            </div>
        )
    }
}


