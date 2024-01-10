
import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path'

const app = express();

app.use(cors());

app.use('/watch', express.static(path.resolve('./static')));

app.get('/', ()=>{
  
})

app.listen(3000, () => {
  console.log('Server Iniciado')
});

