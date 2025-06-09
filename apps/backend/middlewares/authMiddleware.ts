import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

const jwtPK = process.env.JWT_PUBLIC_KEY;


// this middleware does authentication for clerk
export function authMiddleware (req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if(!token) {
        res.status(401).json({message: "Unauthorized"});
        return;
    }
    try {
        const decoded = jwt.verify(token, jwtPK!, {
            algorithms: ["RS256"], // RSA signature with SHA 256
        });

        if(!decoded) {
            res.status(401).json({message: "Unauthorized"});
            return;
        }
        const userId = (decoded as any).sub;
        // {payload: {sub: "123"}}
    
        if(!userId) {
            res.status(401).json({message: "Unauthorized"});
            return;
        }
        req.userId = userId;
        next();
    }catch(e) {
        console.log("Jwt verification failed", e);
        res.status(403).json({message: "Invalid Token"});
        return;
    }
}