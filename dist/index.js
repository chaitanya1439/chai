"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("./controller/auth");
const app = (0, express_1.default)();
const port = 3001;
// Add this line to parse JSON bodies!
app.use(express_1.default.json());
app.post('/api/auth/register', auth_1.register);
app.post('/api/auth/login', auth_1.login);
app.get('/', (_req, res) => {
    res.status(200).json('Hello APIS');
});
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
