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
        
        if (!cookies.get('id')) {
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
                <div className="col-md-8 div-gray">
                    <ul className="list-group width-95">
                        <h4>Productos registrados: </h4>
                        {
                            this.state.productos.map(producto => (
                                <li className="list-group-item" key={producto.id}>
                                    <p><b>Producto:</b> {producto.nombre}</p>
                                    <p><b>Descripcion:</b> {producto.descripcion}</p>
                                    <p><b>Precio:</b> {producto.precio}</p>
                                    <p><b>Stock actual:</b> {producto.stockActual}</p>
                                    <button type="button" className="deletebtn btn btn-danger"
                                    onClick={() => { if (window.confirm('Estás seguro que desea eliminar este producto?')) this.removerProducto(producto.id) }} disabled={true}>Remover</button>
                                    
                                    <p><b>Stock mínimo:</b> {producto.stockMinimo}</p>
                                    </li>)
                            )
                        }
                    </ul>
                </div>

                <div className="col-md-4">
                    <div className="card card-body div-gray">
                        
                        <form className="form-s" onSubmit={this.onSubmit}>
                            <h4>Alta Producto:</h4>
                            <div className="form-group">
                                <label>Nombre de producto: </label>
                                <input type='text' className="form-control input-pago" name="nombre" onChange={this.handleChange} value={this.state.form.nombre} required/>
                                <label>Descripción:</label>
                                <input type='text' className="form-control input-pago" name="descripcion" onChange={this.handleChange} value={this.state.form.descripcion} required/>
                                <label>Precio:</label>
                                <input type='number' min="0" className="form-control input-pago" name="precio" onChange={this.handleChange} value={this.state.form.precio} required/>
                                <label>Stock actual:</label>
                                <input type='number' min="0" className="form-control input-pago" name="stockActual" onChange={this.handleChange} value={this.state.form.stockActual} required/>
                                <label>Stock mínimo:</label>
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
