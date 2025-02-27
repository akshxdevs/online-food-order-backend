import jwt from "jsonwebtoken"; 
import { SECRET } from "./config";
import { Request, Response, NextFunction } from "express";

declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}
export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Unauthorized: No token provided or invalid format" });
    }
    const token = authHeader.split(' ')[1];
    console.log(authHeader);
    
    try {
        const decoded = jwt.verify(token, SECRET) as { userId: string };
        console.log(decoded);
        if (decoded.userId) {
            req.userId = decoded.userId; 
            next();
        } else {
            return res.status(403).json({ message: "Forbidden: Invalid token structure" });
        }
    } catch (error) {
        return res.status(403).json({ message: "Forbidden: Token verification failed", error: (error as Error).message });
    }
};