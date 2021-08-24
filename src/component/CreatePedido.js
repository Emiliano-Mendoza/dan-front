import React, { Component } from 'react'
import axios from 'axios'
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export default class CreatePedido extends Component {

    state = {
        pedidos: [],
        productos: [],
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
                id: null,
                precio: 0
            },
            cantidad: 1,
            precio: 0
        },

        ventanaNuevoPedido: false,
        ventanaVerPedidos: false,
        idLi: '',
        prodSeleccionado: {},
    }

    async componentDidMount() {
        if (!cookies.get('username')) {
            window.location.href = "./";
        } else {
            this.getClient();
            this.getProductos();

        }
    }

    async getClient() {
        const res = await axios.get('http://localhost:7000/ms-usuario/api/cliente/mail/' + cookies.get('username'));
        await this.setState({ client: res.data });
    }

    async getProductos() {
        const res = await axios.get('http://localhost:7000/ms-productos/api/producto');
        await this.setState({ 
            productos: res.data,
            detallePed: {
                producto: {
                    id: res.data[0].id,
                    precio: res.data[0].precio
                },
                cantidad: 1,
                precio: res.data[0].precio
            },
        });
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

    detalleHandleChange = (e) => {
        this.setState({
            detallePed: {
                ...this.state.detallePed,
                [e.target.name]: e.target.value
            }
        })
    }

    getCurrentDate = () => {
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        let yyyy = today.getFullYear();

        today = yyyy + '-' + mm + '-' + dd;
        return today;
    }

    selectProducto = async (e) => {
        await this.setState({
            prodSeleccionado: e.target.value
        });

        const res = await axios.get('http://localhost:7000/ms-productos/api/producto/' + this.state.prodSeleccionado);
        await this.setState({ detallePed: { ...this.state.detallePed, producto: res.data } });
        await this.setState({ detallePed: { ...this.state.detallePed, precio: this.state.detallePed.producto.precio } });
        console.log(this.state.detallePed);
    }

    addDetalle = async (e) => {
        e.preventDefault();

        let auxDetalle = this.state.form.detalle;
        auxDetalle.push(this.state.detallePed);
        await this.setState({
            form:{
                obra:{id: this.state.idLi},
                fechaPedido: this.getCurrentDate(),
                detalle: auxDetalle
            }
        })

        await this.setState({
            detallePed: {
                ...this.state.detallePed,
                cantidad: 1,
            },
        });

        console.log(this.state.form);
    }

    enviarPedido = async () =>{
        await axios.post('http://localhost:7000/ms-pedidos/api/pedidos', this.state.form);
        this.cancelarNuevoPedido();
    }


    abrirVentana = async (id) => {
        await this.setState({
            ventanaNuevoPedido: true,
            idLi: id
        })
    }
    cancelarNuevoPedido = async () => {
        await this.setState({
            ventanaVerPedidos: false,
            ventanaNuevoPedido: false,

            detallePed: {
                producto: {
                    id: this.state.productos[0].id,
                    precio: this.state.productos[0].precio
                },
                cantidad: 1,
                precio: this.state.productos[0].precio
            },
            form:{
                ...this.state.form,
                detalle: []
            }
        })
    }

    abrirVentanaPedidos = async (id) =>{
        const res = await axios.get('http://localhost:7000/ms-pedidos/api/pedidos/porObra/' + id);
        await this.setState({
            ventanaVerPedidos: true,
            idLi: id,
            pedidos: res.data
        })
        console.log(this.state.pedidos);

    }
    cerrarVentanaPedidos = () =>{
        this.setState({
            ventanaVerPedidos: false,
            ventanaNuevoPedido: false
        })
    }

    render() {
        return (
            <div className="row">
                <div className="col-md-10 div-cen">
                    <ul className="list-group">
                        <h4>{this.state.client.razonSocial}</h4>
                        {
                            this.state.client.obras.map(obra => (
                                <li className="list-group-item" key={obra.id}>
                                    <p>Descripcion de obra: {obra.descripcion}</p>

                                    {this.state.ventanaNuevoPedido && obra.id === this.state.idLi ?
                                        <>
                                            <h6>Nuevo Pedido:</h6>
                                            <form onSubmit={this.addDetalle}>
                                                <p>Productos: </p>
                                                <select id="selector" name="producto" onChange={this.selectProducto}>
                                                   
                                                    {this.state.productos.map(prod => (
                                                        <option value={prod.id} key={prod.id}>{prod.nombre}</option>
                                                    ))}
                                                </select>
                                                <div className="form-group">
                                                    <h6>Cantidad: </h6>
                                                    <input type="number" min="1" className="form-control input-cantidad" name="cantidad" value={this.state.detallePed.cantidad} onChange={this.detalleHandleChange} />
                                                </div>
                                                <div className="form-group">
                                                    <h6>Precio: </h6>
                                                    <p>{this.state.detallePed.producto.precio}</p>
                                                    <h6>Total: </h6>
                                                    <p>{this.state.detallePed.cantidad * this.state.detallePed.producto.precio}</p>
                                                </div>
                                                <div className="form-group">
                                                    <h6>Fecha: </h6>
                                                    <input type='text' className="form-control input-pago" name="fechaPedido" value={this.getCurrentDate()} disabled />
                                                </div>

                                                <button type="submit" className="btn btn-primary" id="guardar" >
                                                    Añadir al carro
                                                </button>
                                            </form>

                                        </> : null}

                                    {this.state.ventanaVerPedidos && obra.id === this.state.idLi ? 
                                    <>  
                                        Pedidos:
                                        {this.state.pedidos.map(ped => (
                                            <div className="div-pedido" key={ped.id}>
                                                Fecha: {ped.fechaPedido}
                                                {ped.detallepedido.map( det =>(
                                                    <div key={det.id}>
                                                        <p>Descripcion del producto: {det.producto.descripcion}</p> 
                                                        <p>Cantidad: {det.cantidad}</p>
                                                        <p>Precio: {det.precio}</p>
                                                        
                                                    </div>
                                                )
                                                    
                                                )}
                                                <p>Estado del pedido: {ped.estado.estado}</p>
                                            </div>
                                        ))}
                                        
                
                                    </> 
                                    : null}    

                                    
                                    {this.state.ventanaNuevoPedido && obra.id === this.state.idLi ?

                                        <>
                                            <button type="button" className="deletebtn btn btn-danger" onClick={() => this.cancelarNuevoPedido()}>Cancelar</button>
                                            <button type="button" className="deletebtn btn btn-primary" onClick={() => this.enviarPedido()}>Confirmar</button>
                                        </> :
                                        <>
                                            {this.state.ventanaVerPedidos && obra.id === this.state.idLi ? <>
                                                <button type="button" className="deletebtn btn btn-danger cerrar-btn" onClick={() => this.cerrarVentanaPedidos()}>Cerrar</button>
                                                </> : 
                                                <>
                                                <button type="button" className="deletebtn btn btn-primary" onClick={() => this.abrirVentana(obra.id)}>Nuevo Pedido</button>
                                                <button type="button" className="deletebtn btn btn-primary ver-pedidos" onClick={() => this.abrirVentanaPedidos(obra.id)}>Ver Pedidos</button>
                                                </> }
                                        </>}
                                </li>)
                            )
                        }
                    </ul>
                </div>
            </div>
        )
    }
}


