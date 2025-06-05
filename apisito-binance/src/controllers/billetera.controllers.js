const { Billetera, Usuario, Moneda } = require('../models');

const obtenerBilleteras = async (req, res) => {
    try {
        // Por ahora usaremos un usuario fijo para testing (ID = 1)
        // Después implementaremos el middleware de autenticación
        const usuarioId = req.params.usuarioId || 1;

        const billeteras = await Billetera.findAll({
            where: { usuario_id: usuarioId },
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
            message: 'Billeteras obtenidas exitosamente',
            data: billeteras
        });

    } catch (error) {
        console.error('Error al obtener billeteras:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

const crearBilletera = async (req, res) => {
    try {
        const { usuario_id, moneda_id, saldo_inicial } = req.body;

        // Validar campos requeridos
        if (!usuario_id || !moneda_id) {
            return res.status(400).json({
                success: false,
                message: 'Usuario ID y Moneda ID son requeridos'
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

        // Verificar que el usuario no tenga ya una billetera para esa moneda
        const billeteraExistente = await Billetera.findOne({
            where: {
                usuario_id: usuario_id,
                moneda_id: moneda_id
            }
        });

        if (billeteraExistente) {
            return res.status(400).json({
                success: false,
                message: 'Ya existe una billetera para esta moneda'
            });
        }

        // Crear la billetera
        const nuevaBilletera = await Billetera.create({
            usuario_id: usuario_id,
            moneda_id: moneda_id,
            saldo: saldo_inicial || 0.0,
            activo: true
        });

        // Obtener la billetera creada con las relaciones
        const billeteraCompleta = await Billetera.findByPk(nuevaBilletera.id, {
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
            message: 'Billetera creada exitosamente',
            data: billeteraCompleta
        });

    } catch (error) {
        console.error('Error al crear billetera:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

const obtenerBilleteraPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const billetera = await Billetera.findByPk(id, {
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

        if (!billetera) {
            return res.status(404).json({
                success: false,
                message: 'Billetera no encontrada'
            });
        }

        res.json({
            success: true,
            data: billetera
        });

    } catch (error) {
        console.error('Error al obtener billetera:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

const actualizarSaldoBilletera = async (req, res) => {
    try {
        const { id } = req.params;
        const { saldo } = req.body;

        if (saldo === undefined || saldo < 0) {
            return res.status(400).json({
                success: false,
                message: 'El saldo debe ser un número válido y no negativo'
            });
        }

        const billetera = await Billetera.findByPk(id);
        if (!billetera) {
            return res.status(404).json({
                success: false,
                message: 'Billetera no encontrada'
            });
        }

        // Actualizar saldo
        billetera.saldo = saldo;
        await billetera.save();

        // Obtener billetera actualizada con relaciones
        const billeteraActualizada = await Billetera.findByPk(id, {
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
            message: 'Saldo actualizado exitosamente',
            data: billeteraActualizada
        });

    } catch (error) {
        console.error('Error al actualizar saldo:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

const obtenerTodasBilleteras = async (req, res) => {
    try {
        const billeteras = await Billetera.findAll({
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
            data: billeteras
        });

    } catch (error) {
        console.error('Error al obtener todas las billeteras:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

module.exports = {
    obtenerBilleteras,
    crearBilletera,
    obtenerBilleteraPorId,
    actualizarSaldoBilletera,
    obtenerTodasBilleteras
};