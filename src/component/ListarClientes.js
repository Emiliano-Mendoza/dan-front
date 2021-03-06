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


export default class AddObra extends Component {

    state = {
        clients: [],
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

    handleChange = e => {
        this.setState({
            form: {
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        });
        // console.log(e.target.value + "   " + e.target.name);
    }
    tipoChange = e => {
        this.setState({
            form: {
                ...this.state.form,
                tipo: { id: parseInt(e.target.value, 10) }
            }
        });
    }

    async getClients() {
        const res = await axios.get('http://localhost:7000/ms-usuario/api/cliente');
        this.setState({ clients: res.data });
    }

    async componentDidMount() {
        if (!cookies.get('id')) {
            window.location.href = "./";
        } else { this.getClients(); }
    }

    agregarObra = async (id) => {
        await axios.post("http://localhost:7000/ms-usuario/api/obra", this.state.form);
        this.getClients();

        this.setState({
            modalInsertar: false
        })
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
    eliminarObra = async (id) => {
        await axios.delete("http://localhost:7000/ms-usuario/api/obra/id/" + id);
        this.getClients();
    }

    render() {
        return (<>
            <div className="col-md-12">

                <ul className="list-group" style={{borderRadius: '7px'}}>

                    {
                        this.state.clients.map(client => (
                            <li className="list-group-item div-pedido" key={client.id} >
                                <h4 className="width-95 input-pago">{client.razonSocial}</h4>
                                {client.obras.map(obra => (
                                    <div className="list-group-item width-95 " key={obra.id} >
                                        <p><b>Descripci??n: </b>{obra.descripcion}</p>
                                        <p><b>Direcci??n: </b>{obra.direccion}</p>
                                        <button type="button" className="deletebtn btn btn-danger" onClick={() => { if (window.confirm('Est??s seguro que desea remover esta obra?')) this.eliminarObra(obra.id) }}>Remover</button>
                                        <p><b>Tipo:</b> {obra.tipo.descripcion}</p>
                                    </div>
                                ))}
                                <button type="button" className=" btn btn-primary " style={{marginLeft: '30px', marginTop: '10px'}} onClick={() => this.mostrarModal(client.razonSocial, client.id)}>Agregar</button>
                            </li>)
                        )
                    }
                </ul>

            </div>

            <Modal isOpen={this.state.modalInsertar}>
                <ModalHeader>
                    <div>
                        <h3>A??adir obra a cliente:</h3>
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
                        <label> Superficie:</label>
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

        </>
        )
    }
}
