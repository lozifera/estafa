const express = require('express');
const router = express.Router();
const {
    obtenerBilleteras,
    crearBilletera,
    obtenerBilleteraPorId,
    actualizarSaldoBilletera,
    obtenerTodasBilleteras
} = require('../controllers/billetera.controllers');

// Obtener billeteras de un usuario específico
router.get('/usuario/:usuarioId', obtenerBilleteras);

// Crear nueva billetera
router.post('/', crearBilletera);

// Obtener todas las billeteras (admin)
router.get('/todas', obtenerTodasBilleteras);

// Obtener billetera por ID
router.get('/:id', obtenerBilleteraPorId);

// Actualizar saldo de billetera
router.put('/:id/saldo', actualizarSaldoBilletera);

module.exports = router;