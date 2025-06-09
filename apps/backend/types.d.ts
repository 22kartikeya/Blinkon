import "express";

declare global {
    declare namespace Express {
        interface Request {
            userId?: string;
        }
    }
}