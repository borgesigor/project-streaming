import { UnexpectedError } from "../Shared/Handlers/Errors";
import Ffmpeg from "fluent-ffmpeg";
import { promisify } from 'util';

import { spawn } from 'child_process'
import path from 'path'

const spawnAsync = promisify(spawn);

export class LiveStreamingService{
  private rtmp: string;
  private videoUdpIp: string = 'udp://127.0.0.1:40001';
  private thumbnailUdpIp: string = 'udp://127.0.0.1:40002';
  private defaultPath: string = path.resolve(__dirname, '../../static');
  private packagerProcess: any = null

  constructor(rtmp: string){
    this.rtmp = rtmp;
  }

  async publish() {
    try {
      await this.ffmpegPublish();
      await this.packagerPublish();
    } catch (error) {
      throw new UnexpectedError(error);
    }
  }

  private async ffmpegPublish() {
    return new Promise((resolve, reject) => {
      Ffmpeg()
        .input(this.rtmp)
        .inputOptions('-re')
        .videoCodec('libx264')
        .audioCodec('aac')
        .addOptions([
          '-preset ultrafast',
          '-tune zerolatency',
          '-threads 1',
          '-avoid_negative_ts disabled'
        ])
        .outputFPS(30)
        .outputOptions('-f', 'mpegts')
        .output(this.videoUdpIp+'?pkt_size=1316')
        // .output(this.defaultPath+'/output.ts')
        .on('codecData', () => {
          resolve('started');
        })
        .on('end', () => {
          resolve('ended')
          console.log('Conversão concluída!');
        })
        .on('error', (err) => {
          reject(err);
        })
        .run();
    });
  }

  private async packagerPublish() {
    return new Promise((resolve, reject) => {

      this.packagerProcess = spawn(
        'C:\\shaka-packager\\packager-win-x64.exe',
        [
          `in=${this.videoUdpIp},stream=video,init_segment=video_init.mp4,segment_template=video_$Number$.m4s`,
          `in=${this.videoUdpIp},stream=audio,init_segment=audio_init.mp4,segment_template=audio_$Number$.m4s`,
          // `in=output.ts,stream=video,init_segment=video_init.mp4,segment_template=video_$Number$.m4s`,
          // `in=output.ts,stream=audio,init_segment=audio_init.mp4,segment_template=audio_$Number$.m4s`,
          '--allow_approximate_segment_timeline',
          '--time_shift_buffer_depth',
          '60',
          '--utc_timings',
          'urn:mpeg:DASH:utc:http-iso=https://time.akamai.com/?ms',
          '--suggested_presentation_delay',
          '16',
          '--mpd_output',
          'h264.mpd',
        ],
        {
          cwd: this.defaultPath,
        }
      );

      this.packagerProcess.stdout.on('data', (data: any) => {
        console.log(data)
        resolve(true)
      });
      
      this.packagerProcess.stderr.on('data', (error: any) => {

        // Por algum motivo o packager retorna infos ou warning como erro, 
        // porém são tradados aqui para não causar uma interrupção
        if(error.toString().split(' ')[0].split(':')[1] == ('INFO' || 'WARNING')){
          resolve(true)
        }

        reject(error)
      });
      
      this.packagerProcess.on('close', (code: any) => {
        reject(code)
      });

    });
  }

  // killPackager() {
  //   if (this.packagerProcess) {
  //     this.packagerProcess.kill();
  //     this.packagerProcess = null;
  //   }
  // }
}