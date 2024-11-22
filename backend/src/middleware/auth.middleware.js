import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protectRoute = async (req, res, next) => {
    try{
        const token = req.cookies.jwt;

        if(!token) {
            return res.status(401).json({message: "Unauthorized-no token found"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded){
            return res.status(401).json({message: "Unauthorized-token is invalid"});
        }

        const user = await User.findById(decoded.userId).select("-password");

        if(!user){
            return res.status(401).json({message: "Unauthorized-user not found"});
        }

        req.user = user;

        next();

    } catch (error) {
        console.log("Error in Auth Middlerware", error);
        return res.status(500).json({message: "Internal Server Error"});
    }
}