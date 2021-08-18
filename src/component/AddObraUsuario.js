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
        if (!cookies.get('username')) {
            window.location.href = "./";
        } else { this.getClient(); }
    }

    async getClient() {
        const res = await axios.get('http://localhost:7000/ms-usuario/api/cliente/mail/' + cookies.get('username'));
        await this.setState({ client: res.data });
        console.log(this.state.client);
        console.log(cookies.get('username'));
    }

    mostrarModal = (razonS, idCliente) => {
        this.setState({
            modalInsertar: true,
            form:{
                ...this.state.form,
                cliente: {id: idCliente}},
            clienteObra: razonS
        })
    }
    ocultarModal = () => {
        this.setState({
            modalInsertar: false
        })
    }

    handleChange = e =>{
        this.setState({
            form:{
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        });
        // console.log(e.target.value + "   " + e.target.name);
    }

    agregarObra = async (id) => {
        await axios.post("http://localhost:7000/ms-usuario/api/obra", this.state.form);
        this.getClient();

        this.setState({
            modalInsertar: false
        })
    }
    eliminarObra = async (id) =>{
        await axios.delete("http://localhost:7000/ms-usuario/api/obra/id/" + id);
        this.getClient();
    }
    render() {
        return (<>
            <div className="col-md-12">

                <div className="group-item">
                    <h4>{this.state.client.razonSocial}</h4>
                    {this.state.client.obras.map(obra => (
                        <div className="list-group-item" key={obra.id}>
                            {obra.descripcion}
                            <p>{obra.direccion}</p>
                            <button type="button" className="deletebtn btn btn-danger" onClick={() => this.eliminarObra(obra.id)}>Remover</button>
                            <p>Tipo: {obra.tipo.descripcion}</p>
                        </div>
                    ))}
                    <button type="button" className="agregar-obra-button btn btn-primary" onClick={() => this.mostrarModal(this.state.client.razonSocial, this.state.client.id)}>Agregar</button>
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