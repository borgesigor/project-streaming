
import express from 'express';
import cors from 'cors';
import path from 'path'

const app = express();

app.use(cors());

app.use('/watch', express.static(path.resolve('./static')));

app.get('/', (req, res)=>{
  res.redirect('/watch')
})

app.listen(3000, () => {
  console.log('Server Iniciado')
});

import { LiveStreamingService } from './Services/LiveStreamingService';

async function teste(){
  try{
    const liveStreamingService = new LiveStreamingService('rtmp://localhost:1935/live/stream');
    await liveStreamingService.publish();
  }catch(error){
    console.log(error)
  }
}

teste()

