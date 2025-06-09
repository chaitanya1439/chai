"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
// src/controller/auth.ts
require("dotenv/config");
const supabase_js_1 = require("@supabase/supabase-js");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// 2) Create a typed Supabase client:
const supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const jwtSecret = process.env.JWT_SECRET;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        // Hash the password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Insert into 'users' and return id & email
        const { data, error } = yield supabase
            .from('users')
            .insert([{ email, password: hashedPassword }])
            .select('id, email');
        if (error || !data) {
            return res.status(400).json({ error: error === null || error === void 0 ? void 0 : error.message });
        }
        const user = data[0];
        // Sign a JWT
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, jwtSecret, { expiresIn: '1h' });
        return res.status(201).json({ token, user });
    }
    catch (err) {
        return res.status(500).json({ error: 'Registration failed.' });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        // Fetch the user (including hashed password)
        const { data, error } = yield supabase
            .from('users')
            .select('id, email, password')
            .eq('email', email)
            .single();
        if (error || !data) {
            return res.status(400).json({ error: 'Invalid credentials.' });
        }
        // Compare hashes
        const match = yield bcrypt_1.default.compare(password, data.password);
        if (!match) {
            return res.status(400).json({ error: 'Invalid credentials.' });
        }
        // Issue a new token
        const token = jsonwebtoken_1.default.sign({ userId: data.id, email: data.email }, jwtSecret, { expiresIn: '1h' });
        return res.status(200).json({
            token,
            user: { id: data.id, email: data.email },
        });
    }
    catch (err) {
        return res.status(500).json({ error: 'Login failed.' });
    }
});
exports.login = login;
