import * as express from "express";

interface User {
   _id: string,
    email: string,
    name: string
}

declare global {
    namespace Express {
        // Inject additional properties on express.Request
        interface Request {
            user?: User | undefined
        }
    }
}
