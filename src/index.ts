import express, { Request, Response } from 'express';

import { register, login } from './controller/auth';


const app = express();
const port = 3001;

// Add this line to parse JSON bodies!
app.use(express.json());

app.post('/api/register', register);
app.post('/api/login', login);

app.get('/', (_req: Request, res: Response) => {
    res.send('Hello World!');

});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
