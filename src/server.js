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
const HOST = process.env.HOST;
const USER = process.env.USER;
const PASSWORD = process.env.PASSWORD;
const DBNAME = process.env.DBNAME;
const sRounds = 10;
app.set("port", PORT);
app.use(bodyParser.urlencoded({ extended:true }));
app.use(express.static("./src/public"));
app.use(
    session({
        secret: process.env.SESSION_SECRET,     // Session cookie signature key
        resave: false,                          // Don't save unchanged sessions
        saveUninitialized: true,                // Create session for new visitors
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use("/", routes);
app.set("view engine", "ejs");
app.set("views", "./src/views");

const dbCon = await mysql.createConnection({
    host: HOST,             // MySQL host
    user: USER,             // MySQL username
    password: PASSWORD,     // MySQL password
    database: DBNAME        // Database name
});

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
                        return cb(null, false);
                }
                }
            });
        } else {
            return cb("User not found");
        }
    } catch (err) {
        return cb(err);
    }
}));

passport.serializeUser((user, cb) => {
    cb(null, user);
});

passport.deserializeUser((user, cb) => {
    cb(null, user);
});

app.listen(PORT, () => {
    console.log(`Server is ON, port ${PORT}`);
});