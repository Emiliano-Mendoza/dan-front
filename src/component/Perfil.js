import React, { Component } from 'react'
import axios from 'axios'
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    FormGroup,
    ModalFooter,
} from "reactstrap";
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export default class AddObraUsuario extends Component {

    state = {
        client: {
            id: 0,
            razonSocial: '',
            cuit: '',
            mail: '',
            maxCuentaCorriente: 5000,
            habilitadoOnline: false,
            obras: []
        },
        editClient: {
            razonSocial: '',
            cuit: '',
            mail: '',
            maxCuentaCorriente: '',
        },
        editButton: false,

        modalInsertar: false,
        clienteObra: '',

        form: {
            descripcion: '',
            tipo: { id: 1 },
            latitud: 0,
            longitud: 0,
            direccion: '',
            superficie: 0,
            cliente: { id: 1 }
        },
    }

    async componentDidMount() {
        if (!cookies.get('id')) {
            window.location.href = "./";
        } else { this.getClient(); }
    }

    async getClient() {
        const res = await axios.get('http://localhost:7000/ms-usuario/api/cliente/usuario/' + cookies.get('id'));
        await this.setState({ client: res.data, editClient: res.data });
        console.log(this.state.client);
        console.log(cookies.get('id'));
    }

    mostrarModal = (razonS, idCliente) => {
        this.setState({
            modalInsertar: true,
            form: {
                ...this.state.form,
                cliente: { id: idCliente }
            },
            clienteObra: razonS
        })
    }
    ocultarModal = () => {
        this.setState({
            modalInsertar: false
        })
    }

    handleChange = e => {
        this.setState({
            form: {
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        });
    }
    editHandleChange = e => {
        this.setState({
            editClient: {
                ...this.state.editClient,
                [e.target.name]: e.target.value
            }
        })
    }

    agregarObra = async (id) => {
        await axios.post("http://localhost:7000/ms-usuario/api/obra", this.state.form);
        this.getClient();

        this.setState({
            modalInsertar: false
        })
    }
    eliminarObra = async (id) => {
        await axios.delete("http://localhost:7000/ms-usuario/api/obra/id/" + id);
        this.getClient();
    }

    editButtonDisabled = () =>{
        this.setState({
            editButton: false
        })
    }
    editButtonAvailable = () =>{
        this.setState({
            editButton: true
        })
    }

    onEdit = async e => {
        //e.preventDefault();
        await axios.put('http://localhost:7000/ms-usuario/api/cliente', this.state.editClient);
        this.getClient();
        this.editButtonDisabled();
    }

    render() {
        return (
            <div className="row">
                <div className="col-md-8 div-gray">

                    <div className="group-item width-95">
                        <h4>{this.state.client.razonSocial}</h4>
                        <ul className="list-group">
                            {this.state.client.obras.map(obra => (
                                <li className="list-group-item" key={obra.id}>
                                    <p><b>Descripción: </b>{obra.descripcion}</p>
                                    <p><b>Dirección: </b>{obra.direccion}</p>
                                    <button type="button" className="deletebtn btn btn-danger" onClick={() => { if (window.confirm('Estás seguro que desea remover esta obra?')) this.eliminarObra(obra.id) }}>Remover</button>
                                    <p><b>Tipo:</b> {obra.tipo.descripcion}</p>
                                </li>
                            ))}
                        </ul>
                        <button type="button" className="agregar-obra-button btn btn-primary" onClick={() => this.mostrarModal(this.state.client.razonSocial, this.state.client.id)}>Añadir Obra</button>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card card-body div-gray">

                        <form className="form-s">
                            <h4>Perfil: </h4>
                            <div className="form-group">
                                <label >Razón Social:</label>
                                <input type='text' className="form-control" name="razonSocial" onChange={this.editHandleChange} value={this.state.editClient.razonSocial} required disabled={!this.state.editButton} />
                                <label >Cuit:</label>
                                <input type='text' className="form-control" name="cuit" onChange={this.editHandleChange} value={this.state.editClient.cuit} required disabled={!this.state.editButton}/>
                                <label >E-mail:</label>
                                <input type='email' className="form-control" name="mail" onChange={this.editHandleChange} value={this.state.editClient.mail} required disabled={!this.state.editButton}/>
                                <label >Máximo cuenta corriente:</label>
                                <input type='number' step="1" className="form-control" name="maxCuentaCorriente" onChange={this.editHandleChange} value={this.state.editClient.maxCuentaCorriente} required disabled={!this.state.editButton}/>
                            </div>

                            {this.state.editButton ?
                                <>
                                    <button type="button" id="guardar" className=" btn btn-primary" onClick={() => { if (window.confirm('¿Conservar cambios?')) this.onEdit()}}>
                                        Guardar
                                    </button>
                                </> :
                                <>
                                    <button type="button" id="guardar" className=" btn btn-primary " onClick={() => this.editButtonAvailable()}>
                                        Editar
                                    </button>
                                </>
                            }

                        </form>
                    </div>
                </div>

                <Modal isOpen={this.state.modalInsertar}>
                    <ModalHeader>
                        <div>
                            <h3>Añadir obra a cliente:</h3>
                            <h4>{this.state.clienteObra}</h4>
                        </div>
                    </ModalHeader>

                    <ModalBody>
                        <FormGroup>
                            <label>
                                Descripcion:
                            </label>
                            <input
                                className="form-control"
                                name="descripcion"
                                type="text"
                                onChange={this.handleChange}
                                required
                            />
                        </FormGroup>

                        <FormGroup>
                            <label>Direccion:</label>
                            <input
                                className="form-control"
                                name="direccion"
                                type="text"
                                onChange={this.handleChange}
                                required
                            />
                        </FormGroup>

                        <FormGroup>
                            <label>Latitud:</label>
                            <input
                                className="form-control"
                                name="latitud"
                                type="number"
                                step="0.1"
                                onChange={this.handleChange}
                                required
                            />
                        </FormGroup>

                        <FormGroup>
                            <label>Longitud:</label>
                            <input
                                className="form-control"
                                name="longitud"
                                type="number"
                                step="0.1"
                                onChange={this.handleChange}
                                required
                            />
                        </FormGroup>

                        <FormGroup>
                            <label>Superficie:</label>
                            <input
                                className="form-control"
                                name="latitud"
                                type="number"
                                step="1"
                                onChange={this.handleChange}
                                required
                            />
                        </FormGroup>

                        <FormGroup>
                            <label>Tipo de obra:</label>
                            <select id="selector2" className="form-control" name="tipo" onChange={this.tipoChange}>
                                <option value="1">Reforma</option>
                                <option value="2">Casa</option>
                                <option value="3">Edificio</option>
                                <option value="4">Vial</option>
                            </select>
                        </FormGroup>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            color="primary" onClick={() => this.agregarObra()}
                        >
                            Insertar
                        </Button>
                        <Button
                            className="btn btn-danger" onClick={() => this.ocultarModal()}
                        >
                            Cancelar
                        </Button>
                    </ModalFooter>
                </Modal>

            </div>
        )
    }
}
