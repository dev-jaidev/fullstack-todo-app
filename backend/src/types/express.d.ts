// add user object in request object
import * as express from "express";

declare global {
    namespace Express {
        export interface Request {
            user?: {
                _id: string
                name: string, 
                email: string,
            }
        }
    }
}