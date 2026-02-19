import express from "express";
import passport from "passport";
import bcrypt from "bcrypt";
import { body, validationResult } from "express-validator";

export default function (dbCon) {
    const sRounds = 10;
    const router = express.Router();

    router.get("/", (req, res) => {
        res.render("pages/home", { serverPort: req.app.get("port") });
    });

    // Login
    router.get("/login", async (req, res) =>{
        res.render("pages/login", { 
            serverPort: req.app.get("port"),
            errors: [],
            old: {}
        });
    });

    // Register
    router.get("/register", (req, res) => {
        res.render("pages/register", { 
            serverPort: req.app.get("port"),
            errors: [],
            old: {}
        });
    });


    router.get("/dashboard", async (req, res) => {
        // console.log(req.user);
        if (req.isAuthenticated()) {
            res.render("pages/dashboard", { serverPort: req.app.get("port") });
        } else {
            res.redirect("/login");
        }
    });

    // Logout
    router.get("/logout", (req, res, next) => {
        req.logout(function (err) {
            if (err) {
                return next(err);
            }
            res.redirect("/");
        });
    });

    //POST routes
    // Login
    router.post("/login", 
        [
            body("username")
                .isEmail().withMessage("Invalid email format")
                .normalizeEmail()
                .trim(),
            body("password")
                .notEmpty().withMessage("Password is required")
                .trim(),
        ],
        (req, res, next) => {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).render("pages/login", {
                    serverPort: req.app.get("port"),
                    errors: errors.array(),
                    old: req.body
                });
            };
            next();
        },

        (req, res, next) => {
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

                    // 🔥 INSERT στο user_logins
                    try {
                        await dbCon.execute(
                            "INSERT INTO user_logins (email) VALUES (?)",
                            [user.email]
                        );
                    } catch (error) {
                        console.error("Login logging error:", error);
                    }
                    // ---------------------------------------------
                    return res.redirect("/dashboard");
                });
            })(req, res, next);
        }
    );

    // Register
    router.post(
        "/register",

        [
            body("username")
                .isEmail().withMessage("Invalid email format")
                .normalizeEmail()
                .trim(),
            body("password")
                .isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
                .trim(),
        ],

        async (req, res) => {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).render("pages/register", {
                    serverPort: req.app.get("port"),
                    errors: errors.array(),
                    old: req.body
                });
            };

            const email = req.body.username;
            const password = req.body.password;

            try {
                const [rows] = await dbCon.execute(`SELECT * FROM users WHERE email=?`,
                    [email]
                );
                if (rows.length > 0) {
                    return res.status(400).render("pages/register", {
                        serverPort: req.app.get("port"),
                        errors: [{ msg: "Email already exists" }],
                        old: req.body
                    });
                } else {
                    // Password hash
                    bcrypt.hash(password, sRounds, async (err, hash) => {
                        if (err) {
                            console.log(`Error hashing password: ${err}`);
                        } else {
                            // Add new user
                            const [result] = await dbCon.execute(
                                `INSERT INTO users (email, password) VALUES(?, ?)`,
                                [email, hash]
                            );
                            console.log(result);
                            // Fetch the new user
                            const [userRows] = await dbCon.execute(
                                "SELECT * FROM users WHERE idnew_table = ?",
                                [result.insertId]
                            );

                            const newUser = userRows[0];

                            // Auto-login and redirect to dashboard
                            req.login(newUser, (err) => {
                                if (err) return next(err);
                                return res.redirect("/dashboard");
                            });
                        }
                    });
                }
            } catch(err) {
                console.log(err);
                res.send("Server error");
            }
        }
    );
    return router;
}