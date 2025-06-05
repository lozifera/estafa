const { Anuncio, Usuario, Moneda } = require('../models');

const obtenerTodosAnuncios = async (req, res) => {
    try {
        const anuncios = await Anuncio.findAll({
            where: { activo: true },
            include: [
                {
                    model: Usuario,
                    as: 'usuario',
                    attributes: ['id', 'nombre', 'email']
                },
                {
                    model: Moneda,
                    as: 'moneda',
                    attributes: ['id', 'nombre', 'simbolo', 'valor_en_sus']
                }
            ],
            order: [['created_at', 'DESC']]
        });

        res.json({
            success: true,
            message: 'Anuncios obtenidos exitosamente',
            data: anuncios
        });

    } catch (error) {
        console.error('Error al obtener anuncios:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

const obtenerAnunciosPorTipo = async (req, res) => {
    try {
        const { tipo } = req.params; // 'compra' o 'venta'
        const { moneda_id } = req.query;

        // Validar tipo
        if (!['compra', 'venta'].includes(tipo)) {
            return res.status(400).json({
                success: false,
                message: 'Tipo debe ser "compra" o "venta"'
            });
        }

        const whereCondition = { 
            activo: true,
            tipo: tipo
        };

        // Filtrar por moneda si se especifica
        if (moneda_id) {
            whereCondition.moneda_id = moneda_id;
        }

        const anuncios = await Anuncio.findAll({
            where: whereCondition,
            include: [
                {
                    model: Usuario,
                    as: 'usuario',
                    attributes: ['id', 'nombre', 'email']
                },
                {
                    model: Moneda,
                    as: 'moneda',
                    attributes: ['id', 'nombre', 'simbolo', 'valor_en_sus']
                }
            ],
            order: [['precio_unitario', tipo === 'compra' ? 'DESC' : 'ASC']]
        });

        res.json({
            success: true,
            message: `Anuncios de ${tipo} obtenidos exitosamente`,
            data: anuncios
        });

    } catch (error) {
        console.error('Error al obtener anuncios por tipo:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

const obtenerAnunciosUsuario = async (req, res) => {
    try {
        const { usuarioId } = req.params;

        const anuncios = await Anuncio.findAll({
            where: { 
                usuario_id: usuarioId,
                activo: true 
            },
            include: [
                {
                    model: Usuario,
                    as: 'usuario',
                    attributes: ['id', 'nombre', 'email']
                },
                {
                    model: Moneda,
                    as: 'moneda',
                    attributes: ['id', 'nombre', 'simbolo', 'valor_en_sus']
                }
            ],
            order: [['created_at', 'DESC']]
        });

        res.json({
            success: true,
            message: 'Anuncios del usuario obtenidos exitosamente',
            data: anuncios
        });

    } catch (error) {
        console.error('Error al obtener anuncios del usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

const crearAnuncio = async (req, res) => {
    try {
        const {
            usuario_id,
            moneda_id,
            tipo,
            precio_unitario,
            cantidad_disponible,
            cantidad_minima,
            cantidad_maxima,
            descripcion_pago,
            imagen_pago_url
        } = req.body;

        // Validar campos requeridos
        if (!usuario_id || !moneda_id || !tipo || !precio_unitario || !cantidad_disponible) {
            return res.status(400).json({
                success: false,
                message: 'Usuario ID, Moneda ID, tipo, precio unitario y cantidad disponible son requeridos'
            });
        }

        // Validar tipo
        if (!['compra', 'venta'].includes(tipo)) {
            return res.status(400).json({
                success: false,
                message: 'Tipo debe ser "compra" o "venta"'
            });
        }

        // Validar valores numéricos
        if (precio_unitario <= 0 || cantidad_disponible <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Precio unitario y cantidad disponible deben ser mayores a 0'
            });
        }

        if (cantidad_minima && cantidad_minima < 0) {
            return res.status(400).json({
                success: false,
                message: 'Cantidad mínima no puede ser negativa'
            });
        }

        if (cantidad_maxima && cantidad_maxima < cantidad_minima) {
            return res.status(400).json({
                success: false,
                message: 'Cantidad máxima no puede ser menor a la cantidad mínima'
            });
        }

        // Verificar que el usuario existe
        const usuario = await Usuario.findByPk(usuario_id);
        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        // Verificar que la moneda existe
        const moneda = await Moneda.findByPk(moneda_id);
        if (!moneda) {
            return res.status(404).json({
                success: false,
                message: 'Moneda no encontrada'
            });
        }

        // Crear el anuncio
        const nuevoAnuncio = await Anuncio.create({
            usuario_id,
            moneda_id,
            tipo,
            precio_unitario,
            cantidad_disponible,
            cantidad_minima: cantidad_minima || 0,
            cantidad_maxima,
            descripcion_pago,
            imagen_pago_url,
            activo: true
        });

        // Obtener el anuncio creado con las relaciones
        const anuncioCompleto = await Anuncio.findByPk(nuevoAnuncio.id, {
            include: [
                {
                    model: Usuario,
                    as: 'usuario',
                    attributes: ['id', 'nombre', 'email']
                },
                {
                    model: Moneda,
                    as: 'moneda',
                    attributes: ['id', 'nombre', 'simbolo', 'valor_en_sus']
                }
            ]
        });

        res.status(201).json({
            success: true,
            message: 'Anuncio creado exitosamente',
            data: anuncioCompleto
        });

    } catch (error) {
        console.error('Error al crear anuncio:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

const obtenerAnuncioPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const anuncio = await Anuncio.findByPk(id, {
            include: [
                {
                    model: Usuario,
                    as: 'usuario',
                    attributes: ['id', 'nombre', 'email']
                },
                {
                    model: Moneda,
                    as: 'moneda',
                    attributes: ['id', 'nombre', 'simbolo', 'valor_en_sus']
                }
            ]
        });

        if (!anuncio) {
            return res.status(404).json({
                success: false,
                message: 'Anuncio no encontrado'
            });
        }

        res.json({
            success: true,
            data: anuncio
        });

    } catch (error) {
        console.error('Error al obtener anuncio:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

const actualizarAnuncio = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            precio_unitario,
            cantidad_disponible,
            cantidad_minima,
            cantidad_maxima,
            descripcion_pago,
            imagen_pago_url,
            activo
        } = req.body;

        const anuncio = await Anuncio.findByPk(id);
        if (!anuncio) {
            return res.status(404).json({
                success: false,
                message: 'Anuncio no encontrado'
            });
        }

        // Validar valores numéricos si se proporcionan
        if (precio_unitario !== undefined && precio_unitario <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Precio unitario debe ser mayor a 0'
            });
        }

        if (cantidad_disponible !== undefined && cantidad_disponible <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Cantidad disponible debe ser mayor a 0'
            });
        }

        // Actualizar campos
        if (precio_unitario !== undefined) anuncio.precio_unitario = precio_unitario;
        if (cantidad_disponible !== undefined) anuncio.cantidad_disponible = cantidad_disponible;
        if (cantidad_minima !== undefined) anuncio.cantidad_minima = cantidad_minima;
        if (cantidad_maxima !== undefined) anuncio.cantidad_maxima = cantidad_maxima;
        if (descripcion_pago !== undefined) anuncio.descripcion_pago = descripcion_pago;
        if (imagen_pago_url !== undefined) anuncio.imagen_pago_url = imagen_pago_url;
        if (activo !== undefined) anuncio.activo = activo;

        await anuncio.save();

        // Obtener anuncio actualizado con relaciones
        const anuncioActualizado = await Anuncio.findByPk(id, {
            include: [
                {
                    model: Usuario,
                    as: 'usuario',
                    attributes: ['id', 'nombre', 'email']
                },
                {
                    model: Moneda,
                    as: 'moneda',
                    attributes: ['id', 'nombre', 'simbolo', 'valor_en_sus']
                }
            ]
        });

        res.json({
            success: true,
            message: 'Anuncio actualizado exitosamente',
            data: anuncioActualizado
        });

    } catch (error) {
        console.error('Error al actualizar anuncio:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

const desactivarAnuncio = async (req, res) => {
    try {
        const { id } = req.params;

        const anuncio = await Anuncio.findByPk(id);
        if (!anuncio) {
            return res.status(404).json({
                success: false,
                message: 'Anuncio no encontrado'
            });
        }

        anuncio.activo = false;
        await anuncio.save();

        res.json({
            success: true,
            message: 'Anuncio desactivado exitosamente',
            data: anuncio
        });

    } catch (error) {
        console.error('Error al desactivar anuncio:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

module.exports = {
    obtenerTodosAnuncios,
    obtenerAnunciosPorTipo,
    obtenerAnunciosUsuario,
    crearAnuncio,
    obtenerAnuncioPorId,
    actualizarAnuncio,
    desactivarAnuncio
};