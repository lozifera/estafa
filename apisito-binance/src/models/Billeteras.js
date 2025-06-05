const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Billetera', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        usuario_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'usuarios',
                key: 'id'
            }
        },
        moneda_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'monedas',
                key: 'id'
            }
        },
        saldo: {
            type: DataTypes.DECIMAL(20, 8),
            allowNull: false,
            defaultValue: 0.0
        },
        activo: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'billeteras',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            {
                unique: true,
                fields: ['usuario_id', 'moneda_id']
            }
        ]
    });
};