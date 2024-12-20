import jwt from 'jsonwebtoken';
import config from '../Router/config.js';

/** Auth middleware */
/** Auth middleware */
export default async function Auth(req, res, next) {
  try {
    // Access authorization header to validate request
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication Failed!' });
    }

    const token = authHeader.split(' ')[1];

    // Retrieve the user details for the logged-in user
    const decodedToken = jwt.verify(token, config.JWT_SECRET);

    req.user = decodedToken;

    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication Failed!' });
  }
}


export function localVariable(req, res, next) {
  console.log("Setting local variables", req.body);
  
  req.app.locals = {
    OTP: null,
    resetSession: false
  };
  
  console.log("Local variables set:", req.app.locals);
  
  next();
}