const resenasService = require('../services/resenas.service');

class ResenasController {
    
    // metodo asincrono para listar las opiniones
    async listar(req, res) {
        try {
            // obtengo los datos desde el servicio de laragon
            const lista = await resenasService.getAll(); 
            res.status(200).json(lista);
        } catch (error) {
            res.status(500).json({ error: 'error interno al listar desde la base de datos.' });
        }
    }

    // busca una resena por su id
    async obtenerPorId(req, res) { 
        try {
            const resena = await resenasService.getById(req.params.id); 
            if (!resena) return res.status(404).json({ error: 'la opinion no existe.' });
            
            res.status(200).json(resena);
        } catch (error) {
            res.status(500).json({ error: 'error al buscar el identificador.' });
        }
    }

    // crea una nueva opinion vinculada al usuario
    async crear(req, res) { 
        try {
            const { comentario, estrellas } = req.body;
            const usuario = req.user.username;

            if (!comentario || !estrellas) {
                return res.status(400).json({ error: 'faltan datos requeridos.' });
            }

            const nuevaResena = await resenasService.create(usuario, comentario, estrellas); 
            res.status(201).json({ message: 'resena anadida con exito.', data: nuevaResena });
        } catch (error) {
            res.status(500).json({ error: 'error al registrar en la base de datos.' });
        }
    }

    // elimina la resena si pertenece al mismo usuario
    async eliminar(req, res) { 
        try {
            const resena = await resenasService.getById(req.params.id); 
            if (!resena) return res.status(404).json({ error: 'opinion no encontrada.' });

            if (resena.usuario !== req.user.username) {
                return res.status(403).json({ error: 'acceso denegado. no puedes borrar resenas de otros.' });
            }

            await resenasService.delete(req.params.id); 
            res.status(200).json({ message: 'resena eliminada correctamente.' });
        } catch (error) {
            res.status(500).json({ error: 'error interno al borrar el registro.' });
        }
    }
}

module.exports = new ResenasController();