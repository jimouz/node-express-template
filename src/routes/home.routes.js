import express from "express";

export default function (dbCon) {
    const router = express.Router();

    router.get("/", (req, res) => {
        res.render("pages/home", { serverPort: req.app.get("port") });
    });

    return router;
}