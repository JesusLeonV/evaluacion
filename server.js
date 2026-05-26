const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const loggerMiddleware = require('./middlewares/logger.middleware');
const authRoutes = require('./routes/auth.routes');
const resenasRoutes = require('./routes/resenas.routes');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(loggerMiddleware);

// Servidor de estatico
app.use(express.static(path.join(__dirname, 'public')));

// endopoins de api
app.use('/api/auth', authRoutes);
app.use('/api/resenas', resenasRoutes);

app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada.' }));

app.listen(PORT, () => {
    console.log(` Servidor corriendo en http://localhost:${PORT}`);

});