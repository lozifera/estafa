const { Moneda } = require('../models');

const obtenerTodasMonedas = async (req, res) => {
    try {
        const monedas = await Moneda.findAll({
            order: [['id', 'ASC']]
        });

        res.json({
            success: true,
            message: 'Monedas obtenidas exitosamente',
            data: monedas
        });

    } catch (error) {
        console.error('Error al obtener monedas:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

const obtenerMonedasActivas = async (req, res) => {
    try {
        const monedas = await Moneda.findAll({
            where: { activo: true },
            order: [['nombre', 'ASC']]
        });

        res.json({
            success: true,
            message: 'Monedas activas obtenidas exitosamente',
            data: monedas
        });

    } catch (error) {
        console.error('Error al obtener monedas activas:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

const obtenerMonedaPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const moneda = await Moneda.findByPk(id);
        if (!moneda) {
            return res.status(404).json({
                success: false,
                message: 'Moneda no encontrada'
            });
        }

        res.json({
            success: true,
            data: moneda
        });

    } catch (error) {
        console.error('Error al obtener moneda:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

const crearMoneda = async (req, res) => {
    try {
        const { nombre, simbolo, valor_en_sus } = req.body;

        // Validar campos requeridos
        if (!nombre || !simbolo || !valor_en_sus) {
            return res.status(400).json({
                success: false,
                message: 'Nombre, símbolo y valor en US$ son requeridos'
            });
        }

        // Validar que el valor sea positivo
        if (valor_en_sus <= 0) {
            return res.status(400).json({
                success: false,
                message: 'El valor en US$ debe ser mayor a 0'
            });
        }

        // Verificar que no exista una moneda con el mismo nombre
        const nombreExistente = await Moneda.findOne({ where: { nombre } });
        if (nombreExistente) {
            return res.status(400).json({
                success: false,
                message: 'Ya existe una moneda con ese nombre'
            });
        }

        // Verificar que no exista una moneda con el mismo símbolo
        const simboloExistente = await Moneda.findOne({ where: { simbolo: simbolo.toUpperCase() } });
        if (simboloExistente) {
            return res.status(400).json({
                success: false,
                message: 'Ya existe una moneda con ese símbolo'
            });
        }

        // Crear la moneda
        const nuevaMoneda = await Moneda.create({
            nombre,
            simbolo: simbolo.toUpperCase(),
            valor_en_sus,
            activo: true
        });

        res.status(201).json({
            success: true,
            message: 'Moneda creada exitosamente',
            data: nuevaMoneda
        });

    } catch (error) {
        console.error('Error al crear moneda:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

const actualizarMoneda = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, simbolo, valor_en_sus, activo } = req.body;

        const moneda = await Moneda.findByPk(id);
        if (!moneda) {
            return res.status(404).json({
                success: false,
                message: 'Moneda no encontrada'
            });
        }

        // Validar valor_en_sus si se proporciona
        if (valor_en_sus !== undefined && valor_en_sus <= 0) {
            return res.status(400).json({
                success: false,
                message: 'El valor en US$ debe ser mayor a 0'
            });
        }

        // Actualizar campos
        if (nombre) moneda.nombre = nombre;
        if (simbolo) moneda.simbolo = simbolo.toUpperCase();
        if (valor_en_sus !== undefined) moneda.valor_en_sus = valor_en_sus;
        if (activo !== undefined) moneda.activo = activo;

        await moneda.save();

        res.json({
            success: true,
            message: 'Moneda actualizada exitosamente',
            data: moneda
        });

    } catch (error) {
        console.error('Error al actualizar moneda:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

const eliminarMoneda = async (req, res) => {
    try {
        const { id } = req.params;

        const moneda = await Moneda.findByPk(id);
        if (!moneda) {
            return res.status(404).json({
                success: false,
                message: 'Moneda no encontrada'
            });
        }

        moneda.activo = false;
        await moneda.save();

        res.json({
            success: true,
            message: 'Moneda desactivada exitosamente',
            data: moneda
        });

    } catch (error) {
        console.error('Error al eliminar moneda:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

const activarMoneda = async (req, res) => {
    try {
        const { id } = req.params;

        const moneda = await Moneda.findByPk(id);
        if (!moneda) {
            return res.status(404).json({
                success: false,
                message: 'Moneda no encontrada'
            });
        }

        moneda.activo = true;
        await moneda.save();

        res.json({
            success: true,
            message: 'Moneda activada exitosamente',
            data: moneda
        });

    } catch (error) {
        console.error('Error al activar moneda:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

module.exports = {
    obtenerTodasMonedas,
    obtenerMonedasActivas,
    obtenerMonedaPorId,
    crearMoneda,
    actualizarMoneda,
    eliminarMoneda,
    activarMoneda
};