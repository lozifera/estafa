const express = require('express');
const router = express.Router();
const {
    obtenerTodosAnuncios,
    obtenerAnunciosPorTipo,
    obtenerAnunciosUsuario,
    crearAnuncio,
    obtenerAnuncioPorId,
    actualizarAnuncio,
    desactivarAnuncio
} = require('../controllers/anuncio.controllers');

// Obtener todos los anuncios activos
router.get('/', obtenerTodosAnuncios);

// Obtener anuncios por tipo (compra/venta)
router.get('/tipo/:tipo', obtenerAnunciosPorTipo);

// Obtener anuncios de un usuario específico
router.get('/usuario/:usuarioId', obtenerAnunciosUsuario);

// Crear nuevo anuncio
router.post('/', crearAnuncio);

// Obtener anuncio por ID
router.get('/:id', obtenerAnuncioPorId);

// Actualizar anuncio
router.put('/:id', actualizarAnuncio);

// Desactivar anuncio
router.delete('/:id', desactivarAnuncio);

module.exports = router;