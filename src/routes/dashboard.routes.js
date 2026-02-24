import express from "express";

export default function (dbCon) {
    const router = express.Router();

    router.get("/dashboard", async (req, res) => {
        if (!req.isAuthenticated()) {
            return res.redirect("/login");
        }

        try {
            const [rows] = await dbCon.execute(
                "SELECT logged_in_at FROM user_logins WHERE email = ? ORDER BY logged_in_at DESC LIMIT 5",
                [req.user.email]
            );

            res.render("pages/dashboard", {
                serverPort: req.app.get("port"),
                user: req.user,
                lastLogins: rows
            });

        } catch (err) {
            console.error(err);
            res.send("Server error");
        }
    });

    return router;
}