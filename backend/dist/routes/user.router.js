"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controllers_1 = require("../controllers/user.controllers");
const multer_middlerware_1 = __importDefault(require("../middlewares/multer.middlerware"));
const addUser_middleware_1 = __importDefault(require("../middlewares/addUser.middleware"));
const userAuth_middleware_1 = __importDefault(require("../middlewares/userAuth.middleware"));
const router = (0, express_1.Router)();
// Sign up route
router.post('/signup', multer_middlerware_1.default.single('avatar'), user_controllers_1.signUp);
// Login route
router.post('/login', addUser_middleware_1.default, user_controllers_1.login);
// Secured routes
// update user
router.put('/update', userAuth_middleware_1.default, user_controllers_1.updateUser);
// change avatar
router.put('/update-avatar', userAuth_middleware_1.default, multer_middlerware_1.default.single('avatar'), user_controllers_1.updateAvatar);
// change password 
router.put("/update-password", userAuth_middleware_1.default, user_controllers_1.changePassword);
// get current user
router.get('/current-user', userAuth_middleware_1.default, user_controllers_1.getCurrentUser);
exports.default = router;
