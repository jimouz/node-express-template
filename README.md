# Node.js Express Template (Passport Auth + EJS + MySQL)

A clean, modular and production‑ready Node.js starter template built with:

- **Express.js**
- **Passport.js (Local Strategy)**
- **MySQL (mysql2/promise)**
- **EJS templating**
- **Session-based authentication**
- **Modular routing structure**

## Features

- **User authentication** (login, register, logout)
- **Session-based auth** with `express-session`
- **Custom Passport error messages** (`User not found`, `Wrong password`)
- **Backend validation** with `express-validator`
- **EJS error rendering** with reusable `error-box` component
- **Old form values** preserved on validation errors
- **Protected routes** (dashboard)
- **MySQL database integration**
- **EJS views** with clean folder structure
- **Static assets** served from `/public`
- **Login tracking system** (records successful logins in `user_logins` table with timestamp)

## Project Structure

```
NODE_TEMPLATE/
├─ node_modules/
├─ src/
│  ├─ public/
│  │  ├─ assets/
│  │  └─ styles/
│  │     ├─ globalStyles.css
│  │     ├─ header.css
│  │     └─ footer.css
│  ├─ routes/
│  │  └─ routes.js
│  ├─ views/
│  │  ├─ components/
|  |  |  ├─ error-box.ejs
│  │  │  ├─ header.ejs
│  │  │  └─ footer.ejs
│  │  └─ pages/
│  │     ├─ home.ejs
│  │     ├─ login.ejs
│  │     ├─ register.ejs
│  │     └─ dashboard.ejs
├─ server.js
├─ .env
├─ .gitignore
├─ package.json
├─ package-lock.json
└─ README.md

```

## Installation

```bash
git clone <your-repo-url>
cd <project-folder>
npm install
```

## Create a `.env` file in the project root

```js
PORT = 3000;
HOST = localhost;
USER = root;
PASSWORD = your_mysql_password;
DBNAME = your_database_name;
SESSION_SECRET = your_secret_key;
```

## Run the Server

```bash
npm start
```

## Server runs at:

http://localhost:3000

## Authentication Flow

- /home → Select register or login
- /register → Create new user (hashed password)
- /login → Authenticate via Passport Local Strategy
  - Shows validation errors
  - Shows backend auth errors (wrong password, user not found)
  - Keeps old form values
- /dashboard → Protected route (requires login)
- /logout → Destroy session

## License

MIT License — free to use, modify and build upon.
