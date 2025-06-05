const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Transaccion', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        tipo: {
            type: DataTypes.ENUM('compra', 'venta', 'transferencia'),
            allowNull: false
        },
        estado: {
            type: DataTypes.ENUM('pendiente', 'pagado', 'completado', 'cancelado'),
            allowNull: false,
            defaultValue: 'pendiente'
        },
        comprador_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'usuarios',
                key: 'id'
            }
        },
        vendedor_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'usuarios',
                key: 'id'
            }
        },
        billetera_origen_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'billeteras',
                key: 'id'
            }
        },
        billetera_destino_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'billeteras',
                key: 'id'
            }
        },
        anuncio_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'anuncios',
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
        cantidad: {
            type: DataTypes.DECIMAL(20, 8),
            allowNull: false
        },
        precio_unitario: {
            type: DataTypes.DECIMAL(15, 6),
            allowNull: true
        },
        monto_total: {
            type: DataTypes.DECIMAL(20, 2),
            allowNull: true
        },
        descripcion_pago: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        imagen_comprobante_url: {
            type: DataTypes.STRING(500),
            allowNull: true
        },
        fecha_pago: {
            type: DataTypes.DATE,
            allowNull: true
        },
        fecha_completado: {
            type: DataTypes.DATE,
            allowNull: true
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
        tableName: 'transacciones',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });
};