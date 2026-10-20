const {DataTypes} = require('sequelize')
const db = require('../db/conn')

const Veiculo = db.define('veiculo', {
    codVeiculo: {
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
    modelo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    marca: {
        type: DataTypes.STRING,
        allowNull: false
    },
    placa: {
        type: DataTypes.STRING,
        allowNull: false
    },
    codigoRastreador: {
        type: DataTypes.STRING,
        allowNull: false
    }
},{
    tableName: 'veiculos',
    timestamps: false
})

module.exports = Veiculo