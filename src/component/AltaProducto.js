import React, { Component } from 'react'
import axios from 'axios'
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export default class AltaPedido extends Component {

    state = {
        productos: [],
        form: {
            nombre: '',
            descripcion: '',
            precio: '',
            stockActual: '',
            stockMinimo: ''

        }
    }

    async getProductos() {
        const res = await axios.get('http://localhost:7000/ms-productos/api/producto');
        this.setState({ productos: res.data });
    }

    async componentDidMount() {
        
        if (!cookies.get('username')) {
            window.location.href = "./";
        } else {
            this.getProductos();
        }

    }

    handleChange = (e) =>{
        this.setState({
            form:{
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        });
        //console.log(e.target.value + "   " + e.target.name);
    }

    onSubmit = async (e) =>{
        e.preventDefault();

        await axios.post('http://localhost:7000/ms-productos/api/producto', this.state.form);
        await this.getProductos();
        await this.setState({
            form: {
                nombre: '',
                descripcion: '',
                precio: '',
                stockActual: '',
                stockMinimo: ''
    
            }
        });
    }

    removerProducto = async (id) =>{
        await axios.delete("http://localhost:7000/ms-productos/api/producto/id/" + id);
        this.getProductos();
    }

    render() {
        return (
            <div className="row">
                <div className="col-md-8">
                    <ul className="list-group">
                        {
                            this.state.productos.map(producto => (
                                <li className="list-group-item" key={producto.id}>
                                    <h4>Producto: {producto.nombre}</h4>
                                    <p>Descripcion: {producto.descripcion}</p>
                                    <p>Precio: {producto.precio}</p>
                                    <p>Stock actual: {producto.stockActual}</p>
                                    <p>Stock mínimo: {producto.stockMinimo}</p>
                                    <button type="button" className="deletebtn btn btn-danger"
                                    onClick={() => { if (window.confirm('Estás seguro que desea eliminar este producto?')) this.removerProducto(producto.id) } }>Remover</button>
                                </li>)
                            )
                        }
                    </ul>
                </div>

                <div className="col-md-4">
                    <div className="card card-body">
                        <h3>Alta Producto:</h3>
                        <form onSubmit={this.onSubmit}>
                            <div className="form-group">
                                <h6>Nombre de producto: </h6>
                                <input type='text' className="form-control input-pago" name="nombre" onChange={this.handleChange} value={this.state.form.nombre} required/>
                                <h6>Descripción:</h6>
                                <input type='text' className="form-control input-pago" name="descripcion" onChange={this.handleChange} value={this.state.form.descripcion} required/>
                                <h6>Precio:</h6>
                                <input type='number' min="0" className="form-control input-pago" name="precio" onChange={this.handleChange} value={this.state.form.precio} required/>
                                <h6>Stock actual:</h6>
                                <input type='number' min="0" className="form-control input-pago" name="stockActual" onChange={this.handleChange} value={this.state.form.stockActual} required/>
                                <h6>Stock mínimo:</h6>
                                <input type='number' min="0" className="form-control input-pago" name="stockMinimo" onChange={this.handleChange} value={this.state.form.stockMinimo} required/>
                            </div>
                            <button type="submit" className="btn btn-primary agregar-obra-button" id="registrar">
                                Registrar
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}
