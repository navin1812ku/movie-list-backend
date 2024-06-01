const jwt = require('jsonwebtoken');
const JWT_SECRET = "a386de2be2cdbce9c4d6373efdee3ff41c609902994ca659d170c8b3a2e56ba6";
const verifyToken = (req, res, next) => {
    let token = null;
    console.log(req.body);
    const tokenBody = req.body.token;
    const authHeader = req.header('Authorization');
    if (tokenBody) {
        token = tokenBody;
    }
    else {
        console.log(authHeader);
        if (authHeader == null) {
            return res.status(401).json({ error: 'Authorization header is missing' });
        }
        token = authHeader.split(' ')[1];
    }
    console.log(token);
    if (!token) return res.status(401).json({ message: 'Access denied' });
    try {
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) return res.sendStatus(401);
            req.user = user;
            next();
        });
    } catch (error) {
        res.status(400).json({ message: 'Invalid token' });
    }
};

module.exports = { verifyToken };
