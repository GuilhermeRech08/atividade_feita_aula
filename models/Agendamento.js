const {DataTypes} = require('sequelize')
const db = require('../db/conn')

const Agendamento = db.define('agendamento', {
    codAgendamento: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    idCliente: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            key: 'codCliente',
            model: 'clientes'
        }
    },
    idVeiculo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            key: 'codVeiculo',
            model: 'veiculos'
        }
    },
    horario: {
        type: DataTypes.TIME,
        allowNull: false
    },
    servico: {
        type: DataTypes.STRING,
        allowNull: false
    }
},{
    tableName: 'agendamentos',
    timestamps: false
})

module.exports = Agendamento