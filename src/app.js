const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const usuarioRoutes = require('./routes/usuario.routes');
const reglaAcumulacionRoutes = require('./routes/reglaAcumulacion.routes');
const compraRoutes = require('./routes/compra.routes');

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    ok: true,
    mensaje: 'API del sistema de recompensas funcionando correctamente'
  });
});

app.use('/api/v1/usuarios', usuarioRoutes);
app.use('/api/v1/reglas-acumulacion', reglaAcumulacionRoutes);
app.use('/api/v1/compras', compraRoutes);

module.exports = app;