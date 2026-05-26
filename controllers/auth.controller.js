// importo el servicio de autenticacion que conecta con laragon
const authService = require('../services/auth.service');

class AuthController {
    
    // metodo asincrono para procesar el ingreso de usuarios
    async login(req, res) { 
        const { username, password } = req.body;
        
        // validacion de campos obligatorios
        if (!username || !password) {
            return res.status(400).json({ error: 'campos requeridos.' });
        }

        try {
            // espero la respuesta del servicio de base de datos
            const user = await authService.login(username, password); 
            
            // si el servicio retorna null es porque las credenciales no existen
            if (!user) {
                return res.status(401).json({ error: 'credenciales incorrectas.' });
            }

            // inyecto la cookie de sesion de forma segura en el navegador
            res.cookie('restaurant_session', JSON.stringify(user), { 
                httpOnly: true, 
                maxAge: 3600000 
            });

            // respondo con exito si todo salio bien
            return res.status(200).json({ message: 'sesion iniciada con exito.', user });

        } catch (error) {
            // si algo falla con el objeto de la base de datos se captura aqui evitando el error 500 ciego
            console.error('error detallado en el login:', error);
            return res.status(500).json({ error: 'error interno al procesar los datos del usuario.' });
        }
    }

    // destruye la cookie de sesion activa
    logout(req, res) {
        res.clearCookie('restaurant_session');
        return res.status(200).json({ message: 'sesion cerrada.' });
    }

    // valida si el cliente mantiene el acceso activo en el navegador
    checkSession(req, res) {
        if (req.cookies && req.cookies.restaurant_session) {
            try {
                const userData = JSON.parse(req.cookies.restaurant_session);
                return res.status(200).json({ loggedIn: true, user: userData });
            } catch (err) {
                res.clearCookie('restaurant_session');
                return res.status(200).json({ loggedIn: false });
            }
        }
        return res.status(200).json({ loggedIn: false });
    }

    // registra un nuevo cliente en la base de datos de laragon
    async register(req, res) { 
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'campos requeridos.' });
        }

        try {
            // invoco el servicio de insercion en mysql
            const newUser = await authService.register(username, password); 
            if (!newUser) {
                return res.status(400).json({ error: 'el usuario ya existe en el sistema.' });
            }

            return res.status(201).json({ message: 'usuario creado con exito.' });
        } catch (error) {
            console.error('error detallado en el registro:', error);
            return res.status(500).json({ error: 'error al registrar el usuario en la base de datos.' });
        }
    }
}

module.exports = new AuthController();