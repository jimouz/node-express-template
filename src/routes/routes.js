import express from "express";
import homeRoutes from "./home.routes.js";
import authRoutes from "./auth.routes.js";
import dashboardRoutes from "./dashboard.routes.js";

export default function (dbCon) {
    const router = express.Router();

    router.use("/", homeRoutes(dbCon));
    router.use("/", authRoutes(dbCon));
    router.use("/", dashboardRoutes(dbCon));

    return router;
}