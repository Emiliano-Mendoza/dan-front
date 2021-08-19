import React, { Component } from 'react'
import axios from 'axios'
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export default class CreatePago extends Component {

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

        pagos: [],

        modalInsertar: false,
        clienteObra: '',

        form: {
        },
    }

    async componentDidMount() {
        if (!cookies.get('username')) {
            window.location.href = "./";
        } else {
            this.getClient();
            this.getPagos();
        }
    }

    async getClient() {
        const res = await axios.get('http://localhost:7000/ms-usuario/api/cliente/mail/' + cookies.get('username'));
        await this.setState({ client: res.data });
    }
    async getPagos() {
        const res = await axios.get('http://localhost:7000/ms-cuentacorriente/api/pago/cliente/' + cookies.get('id'));
        await this.setState({ pagos: res.data });
        console.log(this.state.pagos);
    }

    render() {
        return (<div className="row">
            <div className="col-md-8">

                <div className="group-item">
                    <h4>{this.state.client.razonSocial}</h4>
                    {this.state.pagos.map(pago => (
                        <div className="list-group-item" key={pago.id}>
                            <p>Tipo: {pago.medio.type}</p>
                            <p>Observacion: {pago.medio.observacion}</p>
                            {pago.medio.nroRecibo ? <p>Número de recibo: {pago.medio.nroRecibo}</p> : null}
                            {pago.medio.cbuOrigen ? <p>CBU Origen: {pago.medio.cbuOrigen}</p> : null}
                            {pago.medio.cbuDestino ? <p>CBU Destino: {pago.medio.cbuDestino}</p> : null}
                            {pago.medio.codigoTransferencia ? <p>Código de transferencia: {pago.medio.codigoTransferencia}</p> : null}
                            {pago.medio.nroCheque ? <p>Número de cheque: {pago.medio.nroCheque}</p> : null}
                            {pago.medio.banco ? <p>Banco: {pago.medio.banco}</p> : null}
                            <button type="button" className="deletebtn btn btn-danger">Remover</button>
                            <p>Fecha: {pago.fechaPago}</p>
                        </div>
                    ))}
                    <button type="button" className="agregar-obra-button btn btn-primary">Agregar</button>
                </div>
            </div>
            <div className="col-md-4">
                <div className="card card-body">
                    <h3>Realizar Pago:</h3>
                    <form>
                        <div className="form-group">
                            <h6>Razón Social:</h6>
                            <input type='text' className="form-control" required />
                            <h6>Cuit:</h6>
                            <input type='text' className="form-control" required />
                            <h6>E-mail:</h6>
                            <input type='email' className="form-control" required />

                            <div>
                                <h4 className="obras">Obras:</h4>
                                <p>Descripcion:</p>
                                <input type='text' className="form-control" />
                                <p>Tipo de obra: </p>
                                <select id="selector">
                                    <option > - </option>
                                    <option value="Reforma" >Reforma</option>
                                    <option value="Casa">Casa</option>
                                    <option value="Edificio">Edificio</option>
                                    <option value="Vial">Vial</option>
                                </select>
                                <p>Latitud: </p>
                                <input type="number" step="0.1" className="form-control" />
                                <p>Longitud: </p>
                                <input type="number" step="0.1" className="form-control" />
                                <p>Direccion:</p>
                                <input type='text' className="form-control" />
                                <p>Superficie: </p>
                                <input type="number" step="1" className="form-control" />
                            </div>
                            <button type="button" className="btn-primary" id="agregar" >
                                Agregar Obra
                            </button>
                        </div>
                        <button type="submit" className="btn btn-primary" id="guardar" >
                            Guardar
                        </button>
                    </form>
                </div>
            </div>
        </div>
        )
    }
}
