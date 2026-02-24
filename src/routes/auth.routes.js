import express from "express";
import { loginValidator, registerValidator } from "./auth.validators.js";
import { showLogin, showRegister, loginUser, registerUser, logoutUser } from "./auth.controller.js";

export default function (dbCon) {
    const router = express.Router();

    router.get("/login", showLogin);
    router.get("/register", showRegister);

    router.post("/login", loginValidator, loginUser(dbCon));
    router.post("/register", registerValidator, registerUser(dbCon));

    router.get("/logout", logoutUser);

    return router;
}