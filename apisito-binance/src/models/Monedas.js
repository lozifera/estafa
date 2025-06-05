const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Moneda', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },
        simbolo: {
            type: DataTypes.STRING(10),
            allowNull: false,
            unique: true
        },
        valor_en_sus: {
            type: DataTypes.DECIMAL(15, 6),
            allowNull: false,
            defaultValue: 1.0
        },
        activo: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    }, {
        tableName: 'monedas',
        timestamps: false  // ✅ Sin fechas automáticas
    });
};