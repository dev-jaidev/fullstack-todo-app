// add user to req object

import { Request } from "express"
import jwt from "jsonwebtoken";

const addUserFunc = async (req: Request): Promise<void> => {
    const authToken = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];

    if (!authToken) {
      return;
    }
    
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) throw new Error("jwtSecret is not defined");

    try {
      const user = jwt.verify(authToken, jwtSecret);
      if (!user) return;
      req.user = JSON.parse(JSON.stringify(user));
      return
    } catch (error) {
      return
    }
}

export default addUserFunc;