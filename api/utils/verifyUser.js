import jwt from 'jsonwebtoken';
import { errorHandler } from '../utils/error.js';

export const verifyToken = (req,res,next) => {
    //to use cookies to verify we need to install nom i cookie-parser
    const token = req.cookies.access_token;

    if(!token) return next(errorHandler(401,'Unauthorized'));

    jwt.verify(token,process.env.JWT_SECRET,(err,user) => {
        if (err) return next(errorHandler(403,'Forbidden'));
        //we wan to send the info inside the req
        req.user = user;//its not the user its the id of the user
        next();

    });
};