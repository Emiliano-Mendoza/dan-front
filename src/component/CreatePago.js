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
            nroRecibo: '',
            cbuOrigen: '',
            cbuDestino: '',
            codigoTransferencia: '',
            nroCheque: '',
            banco: ''
        },

        pago:{
            cliente: {id: null},
            medio: {},
        }
    }

    async componentDidMount() {
        if (!cookies.get('id')) {
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
        const res = await axios.get('http://localhost:7000/ms-usuario/api/cliente/usuario/' + cookies.get('id'));
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
        e.preventDefault();

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
                ...this.state.form,
                observacion: '',
                nroRecibo: '',
                cbuOrigen: '',
                cbuDestino: '',
                codigoTransferencia: '',
                nroCheque: '',
                banco: ''
            },
        })
    }

    removerPago = async (id) =>{
        await axios.delete("http://localhost:7000/ms-cuentacorriente/api/pago/id/" + id);
        this.getPagos();
    }

    render() {
        return (<div className="row">
            <div className="col-md-8 div-gray">

                <div className="group-item width-95">
                    <h4>{this.state.client.razonSocial}</h4>
                    <ul className="list-group">
                        {this.state.pagos.map(pago => (
                            <li className="list-group-item" key={pago.id}>
                                <p><b>Tipo:</b> {pago.medio.type}</p>
                                <p><b>Observación:</b> {pago.medio.observacion}</p>
                                {pago.medio.nroRecibo ? <p><b>Número de recibo:</b> {pago.medio.nroRecibo}</p> : null}
                                {pago.medio.cbuOrigen ? <p><b>CBU Origen:</b> {pago.medio.cbuOrigen}</p> : null}
                                {pago.medio.cbuDestino ? <p><b>CBU Destino:</b> {pago.medio.cbuDestino}</p> : null}
                                {pago.medio.codigoTransferencia ? <p><b>Código de transferencia:</b> {pago.medio.codigoTransferencia}</p> : null}
                                {pago.medio.nroCheque ? <p><b>Número de cheque:</b> {pago.medio.nroCheque}</p> : null}
                                {pago.medio.banco ? <p><b>Banco:</b> {pago.medio.banco}</p> : null}
                                <button type="button" className="deletebtn btn btn-danger" onClick={()=>{ if (window.confirm('Estás seguro que desea remover el pago?')) this.removerPago(pago.id) }}>Remover</button>
                                <p><b>Fecha:</b> {pago.fechaPago}</p>   
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="col-md-4">
                <div className="card card-body div-gray">
                    
                    <form className="form-s" onSubmit={this.registrarPago}>
                        <h4>Registrar Pago:</h4>
                        <div className="form-group">
                            <h6>Medio de pago:</h6>
                            <select id="selector" name="type" onChange={this.tipoChange} className="input-pago">
                                    <option value="efectivo">Efectivo</option>
                                    <option value="transferencia">Transferencia</option>
                                    <option value="cheque">Cheque</option>
                            </select>
                            <h6>Observación:</h6>
                            <input type='text' className="form-control input-pago" name="observacion" onChange={this.handleChange} value={this.state.form.observacion} required/>
                            {this.state.form.type === 'efectivo' ? 
                                <div>
                                    <h6>Número de recibo:</h6>
                                    <input type='number' className="form-control input-pago" name="nroRecibo" onChange={this.handleChange} value={this.state.form.nroRecibo} required/>
                                </div> : null}

                            {this.state.form.type === 'transferencia' ? 
                                <div>
                                    <h6>CBU Origen:</h6>
                                    <input type='text' className="form-control input-pago" name="cbuOrigen" onChange={this.handleChange} value={this.state.form.cbuOrigen} required/>
                                </div> : null}

                            {this.state.form.type === 'transferencia' ? 
                                <div>
                                    <h6>CBU Destino:</h6>
                                    <input type='text' className="form-control input-pago" name="cbuDestino" onChange={this.handleChange} value={this.state.form.cbuDestino} required/>
                                </div> : null}  

                            {this.state.form.type === 'transferencia' ? 
                                <div>
                                    <h6>Código de transferencia:</h6>
                                    <input type='number' className="form-control input-pago" name="codigoTransferencia" onChange={this.handleChange} value={this.state.form.codigoTransferencia} required/>
                                </div> : null}

                            {this.state.form.type === 'cheque' ? 
                                <div>
                                    <h6>Número de cheque:</h6>
                                    <input type='text' className="form-control input-pago" name="nroCheque" onChange={this.handleChange} value={this.state.form.nroCheque} required/>
                                </div> : null}

                            {this.state.form.type === 'cheque' ? 
                                <div>
                                    <h6>Banco:</h6>
                                    <input type='text' className="form-control input-pago"  name="banco" onChange={this.handleChange} value={this.state.form.banco} required/>
                                </div> : null}
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
