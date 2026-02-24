import passport from "passport";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";

const sRounds = 10;

export const showLogin = (req, res) => {
    res.render("pages/login", {
        serverPort: req.app.get("port"),
        errors: [],
        old: {}
    });
};

export const showRegister = (req, res) => {
    res.render("pages/register", {
        serverPort: req.app.get("port"),
        errors: [],
        old: {}
    });
};

export const loginUser = (dbCon) => (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).render("pages/login", {
            serverPort: req.app.get("port"),
            errors: errors.array(),
            old: req.body
        });
    }

    passport.authenticate("local", (err, user, info) => {
        if (err) return next(err);

        if (!user) {
            return res.status(400).render("pages/login", {
                serverPort: req.app.get("port"),
                errors: [{ msg: info.message }],
                old: req.body
            });
        }

        req.login(user, async (err) => {
            if (err) return next(err);

            try {
                await dbCon.execute(
                    "INSERT INTO user_logins (email) VALUES (?)",
                    [user.email]
                );
            } catch (error) {
                console.error("Login logging error:", error);
            }

            return res.redirect("/dashboard");
        });
    })(req, res, next);
};

export const registerUser = (dbCon) => async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).render("pages/register", {
            serverPort: req.app.get("port"),
            errors: errors.array(),
            old: req.body
        });
    }

    const email = req.body.username;
    const password = req.body.password;

    try {
        const [rows] = await dbCon.execute(
            "SELECT * FROM users WHERE email=?",
            [email]
        );

        if (rows.length > 0) {
            return res.status(400).render("pages/register", {
                serverPort: req.app.get("port"),
                errors: [{ msg: "Email already exists" }],
                old: req.body
            });
        }

        bcrypt.hash(password, sRounds, async (err, hash) => {
            if (err) return console.log(err);

            const [result] = await dbCon.execute(
                "INSERT INTO users (email, password) VALUES(?, ?)",
                [email, hash]
            );

            const [userRows] = await dbCon.execute(
                "SELECT * FROM users WHERE idnew_table = ?",
                [result.insertId]
            );

            req.login(userRows[0], (err) => {
                if (err) return next(err);
                return res.redirect("/dashboard");
            });
        });

    } catch (err) {
        console.log(err);
        res.send("Server error");
    }
};

export const logoutUser = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect("/");
    });
};