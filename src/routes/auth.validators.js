import { body } from "express-validator";

export const loginValidator = [
    body("username").isEmail().withMessage("Invalid email format").normalizeEmail().trim(),
    body("password").notEmpty().withMessage("Password is required").trim(),
];

export const registerValidator = [
    body("username").isEmail().withMessage("Invalid email format").normalizeEmail().trim(),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters").trim(),
];