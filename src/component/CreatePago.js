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
            type: 'efectivo',
            observacion: '',
            nroRecibo: null,
            cbuOrigen: null,
            cbuDestino: null,
            codigoTransferencia: null,
            nroCheque: null,
            banco: null
        },

        pago:{
            cliente: {id: null},
            medio: {},
        }
    }

    async componentDidMount() {
        if (!cookies.get('username')) {
            window.location.href = "./";
        } else {
            this.getClient();
            this.getPagos();

            this.setState({
                pago:{
                    ...this.state.pago,
                    cliente: {id: this.state.client.id}
                }
            })
        }
    }

    async getClient() {
        const res = await axios.get('http://localhost:7000/ms-usuario/api/cliente/mail/' + cookies.get('username'));
        await this.setState({ client: res.data });
    }
    async getPagos() {
        const res = await axios.get('http://localhost:7000/ms-cuentacorriente/api/pago/cliente/' + cookies.get('id'));
        await this.setState({ pagos: res.data });
    }

    tipoChange = async (e) => {
        await this.setState({
            form:{
                ...this.state.form,
                type: e.target.value
            }
        });
        console.log(this.state.form.type)
    }

    handleChange = (e) =>{
        this.setState({
            form:{
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        });
        // console.log(e.target.value + "   " + e.target.name);
    }

    formarMedioPago(){
        if(this.state.form.type === 'efectivo'){
            this.setState({form: {type: 'efectivo', observacion: this.state.form.observacion, nroRecibo: this.state.form.nroRecibo}})
        }else if(this.state.form.type === 'transferencia'){
            this.setState({form: {type: 'transferencia', observacion: this.state.form.observacion, cbuOrigen: this.state.form.cbuOrigen,
                cbuDestino: this.state.form.cbuDestino, codigoTransferencia: this.state.form.codigoTransferencia}});
        }else if(this.state.form.type === 'cheque'){
            this.setState({form: {type: 'cheque', observacion: this.state.form.observacion, nroCheque: this.state.form.nroCheque,
                banco: this.state.form.banco}});
        }
    }

    registrarPago = async (e) => {
        await this.formarMedioPago();

        await this.setState({
            pago:{
                cliente: {id: this.state.client.id},
                medio: this.state.form
            }
        });
        console.log(this.state.pago);
        await axios.post('http://localhost:7000/ms-cuentacorriente/api/pago', this.state.pago);

        this.getPagos();
        await this.setState({
            form: {
                type: 'efectivo',
                observacion: '',
                nroRecibo: null,
                cbuOrigen: null,
                cbuDestino: null,
                codigoTransferencia: null,
                nroCheque: null,
                banco: null
            },
        })
    }

    removerPago = async (id) =>{
        await axios.delete("http://localhost:7000/ms-cuentacorriente/api/pago/id/" + id);
        this.getPagos();
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
                            <button type="button" className="deletebtn btn btn-danger" onClick={()=>this.removerPago(pago.id)}>Remover</button>
                            <p>Fecha: {pago.fechaPago}</p>
                        </div>
                    ))}

                </div>
            </div>
            <div className="col-md-4">
                <div className="card card-body">
                    <h3>Realizar Pago:</h3>
                    <form>
                        <div className="form-group">
                            <h6>Medio de pago:</h6>
                            <select id="selector" name="type" onChange={this.tipoChange} className="input-pago">
                                    <option value="efectivo">Efectivo</option>
                                    <option value="transferencia">Transferencia</option>
                                    <option value="cheque">Cheque</option>
                            </select>
                            <h6>Observacion:</h6>
                            <input type='text' className="form-control input-pago" name="observacion" onChange={this.handleChange}/>
                            {this.state.form.type === 'efectivo' ? 
                                <div>
                                    <h6>Número de recibo:</h6>
                                    <input type='number' className="form-control input-pago" name="nroRecibo" onChange={this.handleChange}  />
                                </div> : null}

                            {this.state.form.type === 'transferencia' ? 
                                <div>
                                    <h6>CBU Origen:</h6>
                                    <input type='text' className="form-control input-pago" name="cbuOrigen" onChange={this.handleChange}  />
                                </div> : null}

                            {this.state.form.type === 'transferencia' ? 
                                <div>
                                    <h6>CBU Destino:</h6>
                                    <input type='text' className="form-control input-pago" name="cbuDestino" onChange={this.handleChange} />
                                </div> : null}  

                            {this.state.form.type === 'transferencia' ? 
                                <div>
                                    <h6>Código de transferencia:</h6>
                                    <input type='number' className="form-control input-pago" name="codigoTransferencia" onChange={this.handleChange}  />
                                </div> : null}

                            {this.state.form.type === 'cheque' ? 
                                <div>
                                    <h6>Número de cheque:</h6>
                                    <input type='text' className="form-control input-pago" name="nroCheque" onChange={this.handleChange}  />
                                </div> : null}

                            {this.state.form.type === 'cheque' ? 
                                <div>
                                    <h6>Banco:</h6>
                                    <input type='text' className="form-control input-pago"  name="banco" onChange={this.handleChange}/>
                                </div> : null}
                        </div>
                        <button type="submit" className="btn btn-primary agregar-obra-button" id="registrar" onClick={()=>this.registrarPago()}>
                            Registrar
                        </button>
                    </form>
                </div>
            </div>
        </div>
        )
    }
}
