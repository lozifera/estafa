const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const usuarioRoutes = require('./routes/usuario.routes');
const billeteraRoutes = require('./routes/billetera.routes');
const monedaRoutes = require('./routes/moneda.routes');
const anuncioRoutes = require('./routes/anuncio.routes');

const corsOptions = {
  origin: 'http://localhost:5173', // Cambia esto al dominio de tu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/billeteras', billeteraRoutes);
app.use('/api/monedas', monedaRoutes);
app.use('/api/anuncios', anuncioRoutes);



// Ruta raíz
app.get('/', (req, res) => {
  res.json({ 
    message: 'API Binance P2P funcionando correctamente',
    version: '1.0.0'
  });
});
module.exports = app;