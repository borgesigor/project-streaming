export interface Create<T>{
  data: T
}

export interface FindUnique{
  where: Object
}

interface Order{
  by: String,
  direction?: String
}

export interface FindMany{
  where?: Object,
  order?: Order,
  take?: number,
  skip?: number
}

export interface Update<T>{
  where: Object,
  data: T
}

export interface Delete{
  where: Object,
}

export default interface IDatabaseContext {
  create<T>(table: String, data: Create<T>): Promise<T>;
  findMany<T>(table: String, args: FindMany): Promise<T[]>;
  findUnique<T>(table: String, args: FindUnique): Promise<T>;
  update<T>(table: String, data: Update<T>): Promise<T>;
  delete<T>(table: String, data: Delete): Promise<T>;
}