import express from "express";
import passport from "passport";
const router = express.Router();

router.get("/", (req, res) => {
    res.render("pages/home", { serverPort: req.app.get("port") });
});

router.get("/login", async (req, res) =>{
    res.render("pages/login", { serverPort: req.app.get("port") });
});

router.get("/register", async (req, res) =>{
    res.render("pages/register", { serverPort: req.app.get("port") });
});

router.get("/dashboard", async (req, res) => {
    // console.log(req.user);
    if (req.isAuthenticated()) {
        res.render("pages/dashboard", { serverPort: req.app.get("port") });
    } else {
        res.redirect("/login");
    }
});

router.get("/logout", (req, res) => {
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
    passport.authenticate("local", {
        successRedirect: "/dashboard",
        failureRedirect: "/login",
    })
);

// Register
router.post("/register", async (req, res) => {
    const email = req.body.username;
    const password = req.body.password;

    try {
        const [rows] = await dbCon.execute(`SELECT * FROM users WHERE email=?`, [
            email,
        ]);
        if (rows.length > 0) {
            res.send("Email adress already exist. Try logging in");
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
                    // Redirect to dashboard
                    res.redirect("/login");
                }
            });
        }
    } catch(err) {
        console.log(err);
    }
});

export default router;
