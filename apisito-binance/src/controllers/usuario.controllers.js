const { Usuario, Sesion } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const registrarUsuario = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        // Validar campos requeridos
        if (!nombre || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Todos los campos son requeridos'
            });
        }

        // Verificar si el email ya existe
        const emailExistente = await Usuario.findOne({ where: { email } });
        if (emailExistente) {
            return res.status(400).json({
                success: false,
                message: 'El email ya está registrado'
            });
        }

        // Crear usuario SIN encriptar contraseña
        const nuevoUsuario = await Usuario.create({
            nombre,
            email,
            password_hash: password, // Guardamos la contraseña tal como viene
            es_admin: false,
            activo: true
        });

        // Respuesta sin incluir la contraseña
        const usuarioRespuesta = {
            id: nuevoUsuario.id,
            nombre: nuevoUsuario.nombre,
            email: nuevoUsuario.email,
            es_admin: nuevoUsuario.es_admin,
            activo: nuevoUsuario.activo,
            created_at: nuevoUsuario.created_at
        };

        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            data: usuarioRespuesta
        });

    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message // Agregado para ver el error específico
        });
    }
};

const loginUsuario = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validar campos requeridos
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email y contraseña son requeridos'
            });
        }

        // Buscar usuario por email
        const usuario = await Usuario.findOne({ where: { email } });
        if (!usuario) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales incorrectas'
            });
        }

        // Verificar si el usuario está activo
        if (!usuario.activo) {
            return res.status(401).json({
                success: false,
                message: 'Usuario desactivado'
            });
        }

        // Verificar contraseña SIN encriptación (comparación directa)
        if (password !== usuario.password_hash) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales incorrectas'
            });
        }

        // Generar JWT token
        const token = jwt.sign(
            { 
                id: usuario.id, 
                email: usuario.email,
                es_admin: usuario.es_admin 
            },
            process.env.JWT_SECRET || 'tu_clave_secreta_temporal_12345',
            { expiresIn: '24h' }
        );

        // Guardar sesión en la base de datos
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);

        await Sesion.create({
            usuario_id: usuario.id,
            token_hash: token,
            expires_at: expiresAt
        });

        // Respuesta exitosa
        const usuarioRespuesta = {
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            es_admin: usuario.es_admin,
            activo: usuario.activo
        };

        res.json({
            success: true,
            message: 'Login exitoso',
            data: {
                usuario: usuarioRespuesta,
                token: token
            }
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

const logoutUsuario = async (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        
        if (token) {
            // Eliminar sesión de la base de datos
            await Sesion.destroy({ where: { token_hash: token } });
        }

        res.json({
            success: true,
            message: 'Logout exitoso'
        });

    } catch (error) {
        console.error('Error en logout:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Obtener todos los usuarios (sin restricciones por ahora)
const obtenerTodosUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            attributes: ['id', 'nombre', 'email', 'es_admin', 'activo', 'created_at', 'updated_at'],
            order: [['created_at', 'DESC']]
        });

        res.json({
            success: true,
            data: usuarios
        });

    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener perfil (simplificado por ahora)
const obtenerPerfil = async (req, res) => {
    try {
        const usuarioId = req.params.id || 1; // Temporal

        const usuario = await Usuario.findByPk(usuarioId, {
            attributes: ['id', 'nombre', 'email', 'es_admin', 'activo', 'created_at', 'updated_at']
        });

        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        res.json({
            success: true,
            data: usuario
        });

    } catch (error) {
        console.error('Error al obtener perfil:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Actualizar perfil (simplificado)
const actualizarPerfil = async (req, res) => {
    try {
        const { nombre } = req.body;
        const usuarioId = req.params.id || 1; // Temporal

        const usuario = await Usuario.findByPk(usuarioId);
        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        if (nombre) usuario.nombre = nombre;
        await usuario.save();

        const usuarioActualizado = {
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            es_admin: usuario.es_admin,
            activo: usuario.activo,
            updated_at: usuario.updated_at
        };

        res.json({
            success: true,
            message: 'Perfil actualizado exitosamente',
            data: usuarioActualizado
        });

    } catch (error) {
        console.error('Error al actualizar perfil:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Agregar a usuario.controllers.js
const darPermisosAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { es_admin } = req.body;

        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        usuario.es_admin = es_admin;
        await usuario.save();

        const usuarioActualizado = {
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            es_admin: usuario.es_admin,
            activo: usuario.activo,
            updated_at: usuario.updated_at
        };

        res.json({
            success: true,
            message: `Permisos de administrador ${es_admin ? 'otorgados' : 'removidos'} exitosamente`,
            data: usuarioActualizado
        });

    } catch (error) {
        console.error('Error al actualizar permisos:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

module.exports = {
    registrarUsuario,
    loginUsuario,
    logoutUsuario,
    obtenerPerfil,
    actualizarPerfil,
    darPermisosAdmin,
    obtenerTodosUsuarios
};