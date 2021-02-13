import express from 'express';
import cors from 'cors';
import { connect } from './config/db';
import { json } from 'body-parser';
import { usersRouter } from './routes/users';
import { wordSetsRouter } from './routes/wordSets';
import { wordsRouter } from './routes/words';
const app = express();

app.use(json());  
app.use(cors());
app.use(usersRouter)
app.use(wordSetsRouter);
app.use(wordsRouter);

const PORT = 8000;

connect();

app.get('/', (req, res) => res.send('Express + TypeScript Server!'));


app.listen(PORT, '0.0.0.0', () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
