const express = require('express');
const router = express.Router();
const {
    obtenerTodasMonedas,
    obtenerMonedasActivas,
    obtenerMonedaPorId,
    crearMoneda,
    actualizarMoneda,
    eliminarMoneda,
    activarMoneda
} = require('../controllers/moneda.controllers');

// Rutas públicas (para que usuarios vean las monedas disponibles)
router.get('/activas', obtenerMonedasActivas);
router.get('/:id', obtenerMonedaPorId);

// Rutas administrativas (después implementaremos middleware de admin)
router.get('/', obtenerTodasMonedas);
router.post('/', crearMoneda);
router.put('/:id', actualizarMoneda);
router.delete('/:id', eliminarMoneda);
router.patch('/:id/activar', activarMoneda);

module.exports = router;