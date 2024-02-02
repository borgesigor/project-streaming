import { Media } from "../Entities/Media";
import IDatabaseContext, { FindMany, FindUnique } from "../../Shared/Context/IDatabaseContext";

export class MediaRepository{

  private TABLE_NAME: string = "media";

  constructor(
    private database: IDatabaseContext
  ){}

  async create(data: Media): Promise<Media> {
    const result: Media = await this.database.create<Media>(this.TABLE_NAME, {
      data: {
        id: data.id,
        path_location: data.path_location
      }
    })

    return result
  }
  
  async findMany(args: FindMany): Promise<Media[]> {
    const result: Media[] = await this.database.findMany<Media>(this.TABLE_NAME, {
      order: args.order,
      skip: args.skip,
      take: args.take,
      where: args.where
    })

    return result
  }

  async findUnique(args: FindUnique): Promise<Media>{
    const result: Media = await this.database.findUnique<Media>(this.TABLE_NAME, {
      where: args.where
    })

    return result
  }

  async update(data: Media): Promise<Media>{
    const result: Media = await this.database.update<Media>(this.TABLE_NAME, {
      data: {
        id: data.id,
        path_location: data.path_location
      },
      where: {
        id: data.id
      }
    })

    return result
  }

  async delete(data: Media): Promise<Media>{
    const result: Media = await this.database.delete<Media>(this.TABLE_NAME, {
      where: {
        id: data.id
      }
    })

    return result
  }
}