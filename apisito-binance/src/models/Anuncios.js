const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Anuncio', {
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
        tipo: {
            type: DataTypes.ENUM('compra', 'venta'),
            allowNull: false
        },
        precio_unitario: {
            type: DataTypes.DECIMAL(15, 6),
            allowNull: false
        },
        cantidad_disponible: {
            type: DataTypes.DECIMAL(20, 8),
            allowNull: false
        },
        cantidad_minima: {
            type: DataTypes.DECIMAL(20, 8),
            allowNull: false,
            defaultValue: 0
        },
        cantidad_maxima: {
            type: DataTypes.DECIMAL(20, 8),
            allowNull: true
        },
        descripcion_pago: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        imagen_pago_url: {
            type: DataTypes.STRING(500),
            allowNull: true
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
        tableName: 'anuncios',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });
};