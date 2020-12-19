import express from 'express';
import { connect } from './config/db';
import { json } from 'body-parser';
import { usersRouter } from './routes/users';
import { wordSetsRouter } from './routes/wordSets';
import { wordsRouter } from './routes/words';

const app = express();
app.use(json());
app.use(usersRouter)
app.use(wordSetsRouter);
app.use(wordsRouter);

const PORT = 8000;

connect();

app.get('/', (req, res) => res.send('Expres + TypeScript Server!'));


app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
