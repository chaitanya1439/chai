import express, { Request, Response } from 'express';

import { register,login } from './controller/auth';




const app = express();
const port = 3001;

// Add this line to parse JSON bodies!
app.use(express.json());

app.post('/api/auth/register', register);
app.post('/api/auth/login', login);

app.get('/', (_req: Request, res: Response) => {
     res.status(200).json('Hello APIS');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
