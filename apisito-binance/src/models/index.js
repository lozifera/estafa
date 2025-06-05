const{sequelize, Sequelize} = require('../config/db.config');
const Usuario = require('./Usuarios')(sequelize);
const Moneda = require('./Monedas')(sequelize);
const Billetera = require('./Billeteras')(sequelize);
const Anuncio = require('./Anuncios')(sequelize);
const Transaccion = require('./Transacciones')(sequelize);
const MovimientoBilletera = require('./MovimientosBilletera')(sequelize);
const Sesion = require('./Sesiones')(sequelize);

// Usuario tiene muchas Billeteras
Usuario.hasMany(Billetera, {
    foreignKey: 'usuario_id',
    as: 'billeteras'
});
Billetera.belongsTo(Usuario, {
    foreignKey: 'usuario_id',
    as: 'usuario'
});

// Usuario tiene muchos Anuncios
Usuario.hasMany(Anuncio, {
    foreignKey: 'usuario_id',
    as: 'anuncios'
});
Anuncio.belongsTo(Usuario, {
    foreignKey: 'usuario_id',
    as: 'usuario'
});

// Usuario tiene muchas Sesiones
Usuario.hasMany(Sesion, {
    foreignKey: 'usuario_id',
    as: 'sesiones'
});
Sesion.belongsTo(Usuario, {
    foreignKey: 'usuario_id',
    as: 'usuario'
});

// Moneda tiene muchas Billeteras
Moneda.hasMany(Billetera, {
    foreignKey: 'moneda_id',
    as: 'billeteras'
});
Billetera.belongsTo(Moneda, {
    foreignKey: 'moneda_id',
    as: 'moneda'
});

// Moneda tiene muchos Anuncios
Moneda.hasMany(Anuncio, {
    foreignKey: 'moneda_id',
    as: 'anuncios'
});
Anuncio.belongsTo(Moneda, {
    foreignKey: 'moneda_id',
    as: 'moneda'
});

// Moneda tiene muchas Transacciones
Moneda.hasMany(Transaccion, {
    foreignKey: 'moneda_id',
    as: 'transacciones'
});
Transaccion.belongsTo(Moneda, {
    foreignKey: 'moneda_id',
    as: 'moneda'
});

// Billetera tiene muchos MovimientosBilletera
Billetera.hasMany(MovimientoBilletera, {
    foreignKey: 'billetera_id',
    as: 'movimientos'
});
MovimientoBilletera.belongsTo(Billetera, {
    foreignKey: 'billetera_id',
    as: 'billetera'
});

// Anuncio tiene muchas Transacciones
Anuncio.hasMany(Transaccion, {
    foreignKey: 'anuncio_id',
    as: 'transacciones'
});
Transaccion.belongsTo(Anuncio, {
    foreignKey: 'anuncio_id',
    as: 'anuncio'
});

// Transaccion pertenece a Usuario (comprador)
Transaccion.belongsTo(Usuario, {
    foreignKey: 'comprador_id',
    as: 'comprador'
});
Usuario.hasMany(Transaccion, {
    foreignKey: 'comprador_id',
    as: 'compras'
});

// Transaccion pertenece a Usuario (vendedor)
Transaccion.belongsTo(Usuario, {
    foreignKey: 'vendedor_id',
    as: 'vendedor'
});
Usuario.hasMany(Transaccion, {
    foreignKey: 'vendedor_id',
    as: 'ventas'
});

// Transaccion pertenece a Billetera (origen)
Transaccion.belongsTo(Billetera, {
    foreignKey: 'billetera_origen_id',
    as: 'billeteraOrigen'
});
Billetera.hasMany(Transaccion, {
    foreignKey: 'billetera_origen_id',
    as: 'transaccionesOrigen'
});

// Transaccion pertenece a Billetera (destino)
Transaccion.belongsTo(Billetera, {
    foreignKey: 'billetera_destino_id',
    as: 'billeteraDestino'
});
Billetera.hasMany(Transaccion, {
    foreignKey: 'billetera_destino_id',
    as: 'transaccionesDestino'
});

// Transaccion tiene muchos MovimientosBilletera
Transaccion.hasMany(MovimientoBilletera, {
    foreignKey: 'transaccion_id',
    as: 'movimientos'
});
MovimientoBilletera.belongsTo(Transaccion, {
    foreignKey: 'transaccion_id',
    as: 'transaccion'
});

// Exportar modelos y sequelize
module.exports = {
    sequelize,
    Usuario,
    Moneda,
    Billetera,
    Anuncio,
    Transaccion,
    MovimientoBilletera,
    Sesion,
    Sequelize: sequelize.Sequelize,
};