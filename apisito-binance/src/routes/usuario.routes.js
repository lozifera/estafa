const express = require('express');
const router = express.Router();
const {registrarUsuario,
        loginUsuario,
        logoutUsuario,
        obtenerPerfil,
        actualizarPerfil,
        darPermisosAdmin,
        obtenerTodosUsuarios} = require('../controllers/usuario.controllers');

router.post('/registro', registrarUsuario);
router.post('/login',loginUsuario)

router.post('/logout', logoutUsuario);
router.get('/todos', obtenerTodosUsuarios);
router.get('/perfil', obtenerPerfil);
router.put('/perfil', actualizarPerfil);

// Agregar a usuario.routes.js
router.patch('/:id/admin', darPermisosAdmin);


module.exports = router;

