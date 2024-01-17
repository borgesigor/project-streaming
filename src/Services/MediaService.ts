import path from 'path'
import fse from 'fs-extra'

import { DatabaseAdapter } from "../Infra/Database/DatabaseAdapter";
import { MediaRepository } from "../Application/Repository/MediaRepository";
import { Media } from "../Application/Entities/Media";

import { AlreadyExists, NotFound, UnexpectedError } from "../Shared/Handlers/Errors";

export class MediaService{
  private id: string;
  public mediaLocation: string;
  private mediaRepository: MediaRepository;

  constructor(id: string){
    this.id = id
    this.mediaLocation = path.resolve(`./static/${id}`)
    this.mediaRepository = new MediaRepository(new DatabaseAdapter());
  }

  async create(): Promise<Media>{

    try {
      
      if(await this.get()){
        throw new AlreadyExists()
      }
      
      await fse.ensureDir(this.mediaLocation)
      
      return await this.mediaRepository.create({
        id: this.id,
        path_location: this.mediaLocation
      })

    } catch (err) {
      throw new UnexpectedError(err)
    }

  }

  async get(): Promise<Media | null>{

    try{

      const resultDb = await this.mediaRepository.findUnique({
        where: {
          id: this.id
        }
      })

      const resultFolder = await fse.pathExists(this.mediaLocation)

      if(!resultDb && !resultFolder){
        return null
      }

      return resultDb

    }catch(err){
      throw new UnexpectedError(err)
    }
    
  }

  async watchFile(fileExpected: string){
    try{

      await new Promise((resolve, reject) => {
        const watcher = fse.watch(this.mediaLocation, (evento, arquivo) => {
          if (evento === 'rename' && arquivo === fileExpected) {
            watcher.close()
            resolve(true)
          }
        })
      })

    }catch(err){
      throw new UnexpectedError(err)
    }

  }

  async delete(): Promise<Media>{
    
    try{

      if(!await this.get()){
        throw new NotFound()
      }

      await fse.remove(this.mediaLocation)
        .catch((err)=>{
          throw new UnexpectedError(err)
        })

      return await this.mediaRepository.delete({
        id: this.id
      })

    }catch(err){
      throw new UnexpectedError(err)
    }

  }

}