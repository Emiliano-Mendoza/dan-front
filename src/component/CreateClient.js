import React, { Component } from 'react'
import axios from 'axios'

export default class CreateUser extends Component {

    state = {
        clients: [],
        razonSocial: '',
        cuit: '',
        mail: '',
        maxCuentaCorriente: 5000,
        habilitadoOnline: false,
        obras: [],
        descripcion: '',
        idTipoObra: 1,
        tipo: '',
        latitud: 0,
        longitud: 0,
        direccion: '',
        superficie: 0
    }

    async getClients() {
        const res = await axios.get('http://localhost:7000/ms-usuario/api/cliente');
        this.setState({ clients: res.data });
    }

    async componentDidMount() {
        this.getClients();
    }

    onChangeRazonSocial = (e) => {
        this.setState({
            razonSocial: e.target.value
        })
    }
    onChangeCuit = (e) => {
        this.setState({
            cuit: e.target.value
        })
    }
    onChangeMail = (e) => {
        this.setState({
            mail: e.target.value
        })
    }
    onChangeDescripcionObra = (e) => {
        this.setState({
            descripcion: e.target.value
        })
    }
    onChangeLatitudObra = (e) => {
        this.setState({
            latitud: e.target.value
        })
    }
    onChangeLongitudObra = (e) => {
        this.setState({
            longitud: e.target.value
        })
    }
    onChangeDireccionObra = (e) => {
        this.setState({
            direccion: e.target.value
        })
    }
    onChangeSuperficieObra = (e) => {
        this.setState({
            superficie: e.target.value
        })
    }
    onChangeTipo= (e) =>{
        var x = e.target.value;
        var aux;
        if(x === "Reforma"){
            aux = 1;
        }else if (x === "Casa"){
            aux = 2;
        }else if (x === "Edificio"){
            aux = 3;
        }else if (x === "Vial"){
            aux = 4;
        }

        this.setState({
            tipo: e.target.value,
            idTipoObra: aux
        })
    }

    onSubmit = async e => {
        e.preventDefault();
        await axios.post('http://localhost:7000/ms-usuario/api/cliente', {
            razonSocial: this.state.razonSocial,
            cuit: this.state.cuit,
            mail: this.state.mail,
            maxCuentaCorriente: "5000",
            habilitadoOnline: false,
            obras: this.state.obras
        });
        this.getClients();
        this.setState({ razonSocial: '' });
        this.setState({ cuit: '' });
        this.setState({ mail: '' });
        this.setState({ obras: []});

    }
    agregarObra = () =>{
        let newObra = {
            descripcion: this.state.descripcion,
            tipo: {
                id: this.state.idTipoObra,
                descripcion: this.state.tipo
            },
            latitud: this.state.latitud,
            longitud: this.state.longitud,
            direccion: this.state.direccion,
            superficie: this.state.superficie    
        }
        let obrasAux = this.state.obras;
        obrasAux.push(newObra);

        this.setState({
            obras: obrasAux
        });

        this.setState({ descripcion: '' });
        this.setState({ latitud: 0 });
        this.setState({ longitud: 0 });
        this.setState({ direccion: '' });
        this.setState({ superficie: 0 });
        
    }

    deleteClient = async (id) => {
        await axios.delete("http://localhost:7000/ms-usuario/api/cliente/id/" + id);
        this.getClients();
    }

    render() {
        return (
            <div className="row">
                <div className="col-md-4">
                    <div className="card card-body">
                        <h3>Crear nuevo cliente</h3>
                        <form onSubmit={this.onSubmit}>
                            <div className="form-group">
                                <h6>Razón Social:</h6>
                                <input type='text' className="form-control" onChange={this.onChangeRazonSocial} value={this.state.razonSocial} />
                                <h6>Cuit:</h6>
                                <input type='text' className="form-control" onChange={this.onChangeCuit} value={this.state.cuit} />
                                <h6>E-mail:</h6>
                                <input type='email' className="form-control" onChange={this.onChangeMail} value={this.state.mail} />

                                <div>
                                    <h4 className="obras">Obras:</h4>
                                    <p>Descripcion:</p>
                                    <input type='text' className="form-control" onChange={this.onChangeDescripcionObra} value={this.state.descripcion} />
                                    <p>Tipo de obra: </p>
                                    <select id="selector" onChange={this.onChangeTipo}>
                                        <option > - </option>
                                        <option value="Reforma" >Reforma</option>
                                        <option value="Casa">Casa</option>
                                        <option value="Edificio">Edificio</option>
                                        <option value="Vial">Vial</option>
                                    </select>
                                    <p>Latitud: </p>
                                    <input type="number" step="0.1" className="form-control" onChange={this.onChangeLatitudObra} value={this.state.latitud} />
                                    <p>Longitud: </p>
                                    <input type="number" step="0.1" className="form-control" onChange={this.onChangeLongitudObra} value={this.state.longitud} />
                                    <p>Direccion:</p>
                                    <input type='text' className="form-control" onChange={this.onChangeDireccionObra} value={this.state.direccion} />
                                    <p>Superficie: </p>
                                    <input type="number" step="1" className="form-control" onChange={this.onChangeSuperficieObra} value={this.state.superficie} />
                                </div>
                                <button type="button" className="btn-primary" id="agregar" onClick={this.agregarObra}>
                                    Agregar Obra
                                </button>
                                <div id="obras-agregadas">Obras agregadas: {this.state.obras.length}</div>
                            </div>
                            <button type="submit" className="btn btn-primary" id="guardar" >
                                Guardar
                            </button>
                        </form>
                    </div>
                </div>
                <div className="col-md-8">
                    <ul className="list-group">
                        {
                            this.state.clients.map(client => (
                                <li className="list-group-item list-group-item-action" key={client.id}>
                                    {client.razonSocial}
                                    <button type="button" className="deletebtn" onClick={() => this.deleteClient(client.id)}>Eliminar</button>
                                </li>)
                            )
                        }
                    </ul>
                </div>
            </div>
        )
    }
}
