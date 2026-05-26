const express = require('express');
const router = express.Router();
const resenasController = require('../controllers/resenas.controller');
const authMiddleware = require('../middlewares/auth.middleware');
//mapeo de los endpoints
router.get('/', resenasController.listar);
router.get('/:id', resenasController.obtenerPorId);
router.post('/', authMiddleware, resenasController.crear);
router.delete('/:id', authMiddleware, resenasController.eliminar);

module.exports = router;