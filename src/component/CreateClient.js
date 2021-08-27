import React, { Component } from 'react'
import axios from 'axios'
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export default class CreateUser extends Component {

    state = {
        clients: [],

        form: {
            razonSocial: '',
            cuit: '',
            mail: '',
            maxCuentaCorriente: 5000,
            habilitadoOnline: false,
            obras: [],
        },

        formObra:{
            tipo: {id: 1},
            descripcion: '',
            latitud: '',
            longitud: '',
            direccion: '',
            superficie: ''
        }
    }

    async getClients() {
        const res = await axios.get('http://localhost:7000/ms-usuario/api/cliente');
        this.setState({ clients: res.data });
    }

    async componentDidMount() {
        if(!cookies.get('id')){
            window.location.href="./";
        }else{this.getClients(); }
         
    }

    handleChange = (e) =>{
        this.setState({
            form:{
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        });
    }

    handleObraChange = (e) =>{
        this.setState({
            formObra:{
                ...this.state.formObra,
                [e.target.name]: e.target.value
            }
        });
    }
    handleChangeTipoObra = (e) =>{
        this.setState({
            formObra:{
                ...this.state.formObra,
                tipo: {id: e.target.value} 
            }
        });
    }

    onSubmit = async e => {
        e.preventDefault();
        await axios.post('http://localhost:7000/ms-usuario/api/cliente', this.state.form);
        this.getClients();
        this.setState({
            form: {
                razonSocial: '',
                cuit: '',
                mail: '',
                maxCuentaCorriente: 5000,
                habilitadoOnline: false,
                obras: [],
            }
        });

    }

    agregarObra = () =>{
        let newObra = this.state.formObra
        let obrasAux = this.state.form.obras;
        obrasAux.push(newObra);

        this.setState({
            form:{
                ...this.state.form,
                obras: obrasAux
            } 
        });

        this.setState({ 
            formObra:{
                ...this.state.formObra,
                descripcion: '',
                latitud: '',
                longitud: '',
                direccion: '',
                superficie: ''
            }
         });
        console.log(this.state.form);
    }

    deleteClient = async (id) => {
        await axios.delete("http://localhost:7000/ms-usuario/api/cliente/id/" + id);
        this.getClients();
    }

    render() {
        return (
            <div className="row">
                <div className="col-md-4">
                    <div className="card card-body div-gray">
                        
                        <form className="form-s" onSubmit={this.onSubmit}>
                            <h4>Crear nuevo cliente: </h4>
                            <div className="form-group">
                                <label >Razón Social:</label>
                                <input type='text' className="form-control" name="razonSocial" onChange={this.handleChange} value={this.state.form.razonSocial} required/>
                                <label >Cuit:</label>
                                <input type='text' className="form-control" name="cuit" onChange={this.handleChange} value={this.state.form.cuit} required/>
                                <label >E-mail:</label>
                                <input type='email' className="form-control" name="mail" onChange={this.handleChange} value={this.state.form.mail} required/>

                                <div>
                                    <h6 className="obras">Obras:</h6>
                                    <label >Descripcion:</label>
                                    <input type='text' className="form-control" name="descripcion" onChange={this.handleObraChange} value={this.state.formObra.descripcion} />
                                    <p>Tipo de obra: </p>
                                    <select id="selector" name="idTipoObra" onChange={this.handleChangeTipoObra}>

                                        <option value="1">Reforma</option>
                                        <option value="2">Casa</option>
                                        <option value="3">Edificio</option>
                                        <option value="4">Vial</option>
                                    </select>
                                    <p>Latitud: </p>
                                    <input type="number" step="0.1" className="form-control" name="latitud" onChange={this.handleObraChange} value={this.state.formObra.latitud} />
                                    <p>Longitud: </p>
                                    <input type="number" step="0.1" className="form-control" name="longitud" onChange={this.handleObraChange} value={this.state.formObra.longitud} />
                                    <p>Direccion:</p>
                                    <input type='text' className="form-control" name="direccion" onChange={this.handleObraChange} value={this.state.formObra.direccion} />
                                    <p>Superficie: </p>
                                    <input type="number" step="1" className="form-control" name="superficie" onChange={this.handleObraChange} value={this.state.formObra.superficie}/>
                                </div>
                                <button type="button"  id="agregar" onClick={this.agregarObra}
                                    disabled={this.state.formObra.descripcion.length === 0 || this.state.formObra.direccion.length === 0
                                        || this.state.formObra.latitud.length === 0 || this.state.formObra.longitud.length === 0
                                        || this.state.formObra.superficie.length === 0}>

                                    Agregar Obra
                                </button>
                                <div id="obras-agregadas">Obras agregadas: {this.state.form.obras.length}</div>
                            </div>
                            <button type="submit" id="guardar" disabled={this.state.form.obras.length === 0}>
                                Guardar
                            </button>
                        </form>
                    </div>
                </div>
                <div className="col-md-8 div-gray">
                    <ul className="list-group width-95">
                        <h4>Clientes: </h4>
                        {
                            this.state.clients.map(client => (
                                <li className="list-group-item list-group-item-action" key={client.id}>
                                    {client.razonSocial}
                                    <button type="button" className="deletebtn btn btn-danger" onClick={() => { if (window.confirm('Estás seguro que desea eliminar este cliente?')) this.deleteClient(client.id) }}>Eliminar</button>
                                </li>)
                            )       
                        }
                    </ul>
                </div>
            </div>
        )
    }
}
