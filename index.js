function isWds(string){
    return string==='WDS'
}
module.exports=isWds




const jwt = require('jsonwebtoken');
const axios = require('axios');

const AUTH0_DOMAIN = import.meta.env.VITE_AUTH0_DOMAIN ;

const AuthMiddleware = async (req, res, next) => {
    try {
        // 1. Get the token from the authorization header
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).json({ message: 'No token provided' });
        }
        
        const token = authHeader.split(' ')[1];

        // 2. Validate the token
        const isValid = await validateToken(token);
        if (!isValid) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        // 3. Decode the token and set user details
        const decoded = jwt.decode(token);
        req.user = decoded;

        // 4. Check permissions (modify according to your action)
        const hasPermission = await checkPermissions(decoded.sub, req.method);
        if (!hasPermission) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        // 5. Proceed to the next middleware or route handler
        next();
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
};

// Validate token function
const validateToken = async (token) => {
    try {
        const response = await axios.post(`https://${AUTH0_DOMAIN}/api/v2/tokens/validate`, {
            token
        });
        return response.data.valid;
    } catch (error) {
        return false;
    }
};

// Check permissions function
const checkPermissions = async (req, action) => {
    const userId = req.user.sub; // שליפת userId מתוך req.user
    try {
        const response = await axios.post(`https://${AUTH0_DOMAIN}/api/v2/users/${userId}/permissions`, {
            action
        });
        return response.data.allowed;
    } catch (error) {
        return false;
    }
};


module.exports = AuthMiddleware;
