module.exports = (req, res, next) => {
    const sessionCookie = req.cookies ? req.cookies.restaurant_session : null;

    if (!sessionCookie) {
        return res.status(401).json({ error: 'acceso denegado. no se encontro una sesion activa.' });
    }

    try {
        req.user = JSON.parse(sessionCookie);
        next();
    } catch (error) {
        return res.status(400).json({ error: 'sesion invalida.' });
    }
};