const mysql = require('mysql2/promise');

// Reutilizo los parametros de conexion para el aprovisionamiento de las opiniones
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'restaurante_db',
    waitForConnections: true,
    connectionLimit: 10
});

class ResenasService {
    
    // consulto el espectro completo de opiniones mapeadas en el motor relacional
    async getAll() {
        const [rows] = await pool.query('SELECT * FROM resenas');
        return rows;
    }

    // busco un recurso específico mediante su llave primaria id
    async getById(id) {
        const [rows] = await pool.query('SELECT * FROM resenas WHERE id = ?', [id]);
        return rows[0] || null;
    }

    // almaceno un nuevo comentario asociándolo de manera inmutable al usuario en sesion
    async create(usuario, comentario, estrellas) {
        const [result] = await pool.query(
            'INSERT INTO resenas (usuario, comentario, estrellas) VALUES (?, ?, ?)',
            [usuario, comentario, estrellas]
        );
        return { id: result.insertId, usuario, comentario, estrellas };
    }

    // doy de baja el recurso de la tabla ejecutando una sentencia delete controlada por id
    async delete(id) {
        const [result] = await pool.query('DELETE FROM resenas WHERE id = ?', [id]);
        return result.affectedRows > 0; // retorna true si se borro la fila
    }
}   

module.exports = new ResenasService();