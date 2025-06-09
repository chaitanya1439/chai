import express, { Request, Response } from 'express';
import authRouter from './route/auth';


const app = express();
const port = 3001;

// Add this line to parse JSON bodies!
app.use(express.json());

app.use('/api', authRouter);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');

});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
