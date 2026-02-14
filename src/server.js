import express from "express";
import session from "express-session";
import passport from "passport";
import { Strategy } from "passport-local";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import mysql from "mysql2/promise";
import bcrypt from "bcrypt";
import routes from "./routes/routes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT;
const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;
const COOKIE_AGE = Number(process.env.COOKIE_AGE);

app.set("port", PORT);
app.use(bodyParser.urlencoded({ extended:true }));
app.use(express.static("./src/public"));
app.use(
    session({
        secret: process.env.SESSION_SECRET,     // Session cookie signature key
        resave: false,                          // Don't save unchanged sessions
        saveUninitialized: false,               // Create session for new visitors
        cookie: {
            httpOnly: true,                     // Prevents client-side JS from accessing the cookie
            secure: false,                      // true in production
            maxAge: COOKIE_AGE,                 // Session age
        }
    })
);

const dbCon = await mysql.createConnection({
    host: DB_HOST,              // MySQL host
    user: DB_USER,              // MySQL username
    password: DB_PASSWORD,      // MySQL password
    database: DB_NAME           // Database name
});

app.use(passport.initialize());
app.use(passport.session());
app.use("/", routes(dbCon));
app.set("view engine", "ejs");
app.set("views", "./src/views");

passport.use(new Strategy(async function verify(username, password, cb) {
    try {
        const [rows] = await dbCon.execute(`SELECT * FROM users WHERE email=?`,[
            username,
        ]);
        if (rows.length > 0) {
            const user = rows[0];
            const savedHashedPassword = user.password;
            //  Password comparison
            bcrypt.compare(password, savedHashedPassword, (err, result) => {
                if (err) {
                    console.log(`Error comparing passwords : ${err}`);
                    return cb(err);
                } else {
                    if (result) {
                            cb(null, user);
                    } else {
                            return cb(null, false, { message: "Wrong password" });
                    }
                }
            });
        } else {
            return cb(null, false, { message: "User not found" });
        }
    } catch (err) {
        return cb(err);
    }
}));

passport.serializeUser((user, cb) => {
    cb(null, user.idnew_table);
});

passport.deserializeUser(async (id, cb) => {
    try {
        const [rows] = await dbCon.execute(
            "SELECT * FROM users WHERE idnew_table=?",
            [id]
        );

        if (!rows.length) return cb(null, false);

        cb(null, rows[0]);
    } catch (err) {
        cb(err);
    }
});

app.listen(PORT, () => {
    console.log(`Server is ON, port ${PORT}`);
});