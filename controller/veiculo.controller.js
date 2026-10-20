const Veiculo = require('../models/Veiculo')
const Cliente = require('../models/Cliente')

const cadastrar = async(req, res) => {
    const valores = req.body

    if(!valores.modelo || !valores.marca || !valores.placa || !valores.codigoRastreador){
        return res.status(400).json({message: 'Preencha todos os campos!'})
    }

    try{
        const cliente = await Cliente.findByPk(valores.idCliente)
        if(!idCliente){
            return res.status(404).json({message: 'Cliente informado não existe'})
        }
        const novoVeiculo = await Veiculo.create(valores)
        return res.status(201).json({message: 'Veiculo cadastrado com sucesso!', veiculo: novoVeiculo})
    }catch(err){
        console.error('Erro ao cadastrar veiculo:', err)
        return res.status(500).json({message: 'Erro ao cadastrar veiculo'})
    }
}

module.exports = {cadastrar}