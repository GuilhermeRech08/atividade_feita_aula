const Cliente = require('../models/Cliente')
const CryptoJS = require('crypto-js')
const CHAVE_SECRETA = 'shh'

const cadastrar = async (req, res) => {
    const valores = req.body

    if (!valores.nome || !valores.email || !valores.senha ||
        !valores.cpf || !valores.endereco || !valores.telefone) {
        return res.status(400).json({
            message: 'Preencha todos os campos!'
        })
    }

    if (String(valores.cpf).length !== 11) {
        return res.status(400).json({
            message: 'O CPF deve ter exatamente 11 digitos!'
        })
    }

    try {
        const cpfCriptografado = CryptoJS.AES.encrypt(
            String(valores.cpf), CHAVE_SECRETA
        ).toString()

        const senhaCriptografada = CryptoJS.AES.encrypt(
            valores.senha, CHAVE_SECRETA
        ).toString()

        await Cliente.create({
            nome: valores.nome,
            email: valores.email,
            senha: senhaCriptografada,
            cpf: cpfCriptografado,
            endereco: valores.endereco,
            telefone: valores.telefone
        })

        return res.status(201).json({
            message: 'Cliente cadastrado com sucesso!'
        })
    } catch (err) {
        console.error('Erro ao cadastrar cliente:', err)
        return res.status(500).json({
            message: 'Erro ao cadastrar cliente!'
        })
    }
}

const listar = async (req, res) => {
    try {
        const clientes = await Cliente.findAll()
        const resultado = []

        clientes.forEach((el) => {
            let cpfDescriptografado = ''

            try {
                const bytes = CryptoJS.AES.decrypt(
                    el.cpf, CHAVE_SECRETA
                )
                cpfDescriptografado = bytes.toString(CryptoJS.enc.Utf8)

                if (!cpfDescriptografado) {
                    cpfDescriptografado = 'Erro ao descriptografar'
                }
            } catch (err) {
                cpfDescriptografado = 'Erro ao descriptografar'
            }

            resultado.push({
                codCliente: el.codCliente,
                nome: el.nome,
                email: el.email,
                cpf: cpfDescriptografado,
                endereco: el.endereco,
                telefone: el.telefone
            })
        })

        return res.status(200).json(resultado)
    } catch (err) {
        console.error('Erro ao listar clientes:', err)
        return res.status(500).json({
            message: 'Erro ao listar clientes!'
        })
    }
}

const consultar = async (req, res) => {
    const id = req.params.id

    try {
        const cliente = await Cliente.findByPk(id)

        if (!cliente) {
            return res.status(404).json({
                message: 'Não foi possível encontrar o cliente'
            })
        }

        const bytes = CryptoJS.AES.decrypt(
            cliente.cpf, CHAVE_SECRETA
        )
        const cpfDescriptografado = bytes.toString(CryptoJS.enc.Utf8)

        return res.status(200).json({
            codCliente: cliente.codCliente,
            nome: cliente.nome,
            email: cliente.email,
            cpf: cpfDescriptografado,
            endereco: cliente.endereco,
            telefone: cliente.telefone
        })
    } catch (err) {
        console.error('Erro ao consultar cliente:', err)
        return res.status(500).json({
            message: 'Erro ao consultar cliente!'
        })
    }
}

const atualizar = async (req, res) => {
    const id = req.params.id
    const valores = req.body

    try {
        const cliente = await Cliente.findByPk(id)

        if (!cliente) {
            return res.status(404).json({
                message: 'Não foi possível encontrar o cliente'
            })
        }

        const dadosAtualizados = { ...valores }

        if (valores.cpf !== undefined) {
            if (String(valores.cpf).length !== 11) {
                return res.status(400).json({
                    message: 'O CPF deve ter exatamente 11 digitos!'
                })
            }

            dadosAtualizados.cpf = CryptoJS.AES.encrypt(
                String(valores.cpf), CHAVE_SECRETA
            ).toString()
        }

        if (valores.senha) {
            dadosAtualizados.senha = CryptoJS.AES.encrypt(
                valores.senha, CHAVE_SECRETA
            ).toString()
        }

        await cliente.update(dadosAtualizados)

        return res.status(200).json({
            message: 'Cliente atualizado com sucesso!'
        })
    } catch (err) {
        console.error('Erro ao atualizar cliente:', err)
        return res.status(500).json({
            message: 'Erro ao atualizar cliente!'
        })
    }
}

const apagar = async (req, res) => {
    const id = req.params.id

    try {
        const cliente = await Cliente.findByPk(id)

        if (!cliente) {
            return res.status(404).json({
                message: 'Não foi possível encontrar o cliente'
            })
        }

        await cliente.destroy()

        return res.status(200).json({
            message: 'Cliente apagado com sucesso!'
        })
    } catch (err) {
        console.error('Erro ao apagar cliente:', err)
        return res.status(500).json({
            message: 'Erro ao apagar cliente!'
        })
    }
}

module.exports = {
    cadastrar,
    listar,
    consultar,
    atualizar,
    apagar
}
