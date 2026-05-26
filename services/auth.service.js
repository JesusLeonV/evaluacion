const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',               
    password: '',               
    database: 'restaurante_db', 
    waitForConnections: true,   
    connectionLimit: 10         
});

class AuthService {
    
    // metodo asincrono para validar credenciales en la base de datos
    async login(username, password) {
        // forzo a que las variables sean tratadas como strings de texto obligatoriamente
        const userStr = String(username || '');
        const passStr = String(password || '');

        // remuevo los espacios en blanco invisibles de los extremos
        const cleanUser = userStr.trim();
        const cleanPass = passStr.trim();

        console.log(`[bd laragon] buscando usuario: "${cleanUser}" con clave: "${cleanPass}"`);

        // realizo la consulta parametrizada con placeholders seguros
        const [rows] = await pool.query(
            'SELECT id, username FROM users WHERE username = ? AND password = ?', 
            [cleanUser, cleanPass]
        );
        
        console.log(`[bd laragon] registros encontrados en la tabla:`, rows.length);

        if (rows.length === 0) return null;
        return rows[0];
    }

    // metodo asincrono para dar de alta cuentas en laragon
    async register(username, password) {
        // aseguro la conversion de los datos entrantes a cadenas de texto claras
        const userStr = String(username || '');
        const passStr = String(password || '');

        const cleanUser = userStr.trim();
        const cleanPass = passStr.trim();

        // verifico si el usuario ya existe en mi tabla relacional
        const [exists] = await pool.query(
            'SELECT id FROM users WHERE LOWER(username) = LOWER(?)', 
            [cleanUser]
        );
        
        if (exists.length > 0) return false;

        // ejecuto el inserte directo en mysql
        const [result] = await pool.query(
            'INSERT INTO users (username, password) VALUES (?, ?)', 
            [cleanUser, cleanPass]
        );
        
        return { id: result.insertId, username: cleanUser };
    }
}

module.exports = new AuthService();