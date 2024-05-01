"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const folder_controllers_1 = require("../controllers/folder.controllers");
const userAuth_middleware_1 = __importDefault(require("../middlewares/userAuth.middleware"));
const router = (0, express_1.Router)();
// create folder route
router.post('/create', userAuth_middleware_1.default, folder_controllers_1.createFolder);
// update folder
router.put('/update', userAuth_middleware_1.default, folder_controllers_1.updateFolder);
// delete folder
router.delete('/delete', userAuth_middleware_1.default, folder_controllers_1.deleteFolder);
// get folder
router.get('/get', userAuth_middleware_1.default, folder_controllers_1.getFolders);
exports.default = router;
