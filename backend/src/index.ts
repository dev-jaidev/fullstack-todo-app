import app from "./app";
import dotenv from "dotenv";
import connectDB from "./db/connectDB";
dotenv.config();

const port = process.env.PORT || 8000;

connectDB()
.then(():void=>{
    app.listen(port, (): void => {console.log("app listening on port " + port)});
})

