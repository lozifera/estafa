const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('MovimientoBilletera', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        billetera_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'billeteras',
                key: 'id'
            }
        },
        transaccion_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'transacciones',
                key: 'id'
            }
        },
        tipo_movimiento: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        monto: {
            type: DataTypes.DECIMAL(20, 8),
            allowNull: false
        },
        saldo_anterior: {
            type: DataTypes.DECIMAL(20, 8),
            allowNull: false
        },
        saldo_nuevo: {
            type: DataTypes.DECIMAL(20, 8),
            allowNull: false
        },
        descripcion: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'movimientos_billetera',
        timestamps: false
    });
};