"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const dotenv_1 = __importDefault(require("dotenv"));
const connectDB_1 = __importDefault(require("./db/connectDB"));
dotenv_1.default.config();
const port = process.env.PORT || 8000;
(0, connectDB_1.default)()
    .then(() => {
    app_1.default.listen(port, () => { console.log("app listening on port " + port); });
});
