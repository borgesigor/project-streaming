import IDatabase, { Create, Delete, FindMany, FindUnique, Update } from '../../Application/Context/IDatabaseContext'
import { Client } from 'pg'
import { UnexpectedError } from '../../Shared/Handlers/Errors'

const DEFAULT_ITEMS_PER_PAGE = 10;
const MAX_ITEMS_PER_PAGE = 50;

const dbOptions = {
  host: "localhost",
  port: 5432,
  database: "Musica",
  user: "postgres",
  password: "2121"
}

export class DatabaseAdapter implements IDatabase{
  private db: Client = new Client(dbOptions);

  constructor(){
    this.db.connect().catch((err)=>{
      throw new UnexpectedError(err)
    })
  }

  async create<T>(table: String, args: Create<T>): Promise<T> {
    const keys = Object.keys(args.data as Object);
    const values = Object.values(args.data as Object);

    const columns = keys.map(key => `"${key}"`).join(', ');
    const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');

    const query = {
      text: `INSERT INTO "${table}" (${columns}) VALUES (${placeholders}) RETURNING *`,
      values
    };

    const result = await this.db.query(query).catch((err)=>{
      throw new UnexpectedError(err)
    })

    return result.rows[0] as T;
  }

  async findMany<T>(table: String, args?: FindMany): Promise<T[]> {
    let where = ""
    let order = ""
    let paginator = `LIMIT ${DEFAULT_ITEMS_PER_PAGE}`
    let values = []

    if(args?.where){

      let [keys, data] = [Object.keys(args.where), Object.values(args.where)]

      const updatedWhereKeys = keys.map((key, index) => `"${key}"=$${index + 1}`).join(" AND ");

      where = `WHERE ${updatedWhereKeys}`
      values = data

    }

    if(args?.order){

      let [orderBy, orderDirection] = [args.order.by, args.order.direction]

      order = `ORDER BY "${orderBy}" ${orderDirection || 'DESC'}`

    }

    if(args?.take){

      if(args.take > MAX_ITEMS_PER_PAGE) { args.take = MAX_ITEMS_PER_PAGE } // Don't allow more than N items per page

      paginator = `LIMIT ${args.take || ""} OFFSET ${args.take * (args.skip || 0)}`;

    }

    const query = {
      text: `SELECT * FROM "${table}" ${where} ${order} ${paginator}`,
      values
    }

    const result = await this.db.query(query).catch((err)=>{
      throw new UnexpectedError(err)
    })

    return result.rows as T[];
  }

  async findUnique<T>(table: String, args: FindUnique): Promise<T> {

    let [whereKeys, values] = [Object.keys(args.where), Object.values(args.where)]

    const updatedWhereKeys = whereKeys.map((key, index) => `"${key}"=$${index + 1}`).join(" AND ");

    const query = {
      text: `SELECT * FROM "${table}" WHERE ${updatedWhereKeys}`,
      values
    }

    const result = await this.db.query(query).catch((err)=>{
      throw new UnexpectedError(err)
    })

    return result.rows[0] as T;
  }
  
  async update<T>(table: String, args: Update<T>): Promise<T> {

    let [dataKeys, dataValues] = [Object.keys(args.data as Object), Object.values(args.data as Object)]
    let [whereKeys, whereData] = [Object.keys(args.where), Object.values(args.where)]

    const updatedDataKeys = dataKeys.map((key, index) => `"${key}"=$${index + 1}`).join(', ');
    const updatedWhereKeys = whereKeys.map((key, index) => `"${key}"=$${dataKeys.length + index + 1}`).join(" AND ");
    const values = [...dataValues, ...whereData]

    const query = {
      text: `UPDATE "${table}" SET ${updatedDataKeys} WHERE ${updatedWhereKeys}`,
      values
    }

    const result = await this.db.query(query).catch((err)=>{
      throw new UnexpectedError(err)
    })

    return result.rows[0] as T;
  }

  async delete<T>(table: String, args: Delete): Promise<T> {

    let [whereKeys, values] = [Object.keys(args.where), Object.values(args.where)]

    const updatedWhereKeys = whereKeys.map((key, index) => `"${key}"=$${index + 1}`).join(" AND ");

    const query = {
      text: `DELETE FROM "${table}" WHERE ${updatedWhereKeys}`,
      values
    }

    const result = await this.db.query(query).catch((err)=>{
      throw new UnexpectedError(err)
    })

    return result.rows[0] as T;
  }
}