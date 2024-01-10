export class UnexpectedError extends Error{
  private fullMessage: object
  private httpErrorCode: number
  
  constructor(err: any){
    console.log(` `)
    console.log(`[ERRO NÃO TRATADO] ${err}`)
    console.log(` `)
    super("Ocorreu um erro interno inesperado")
    this.name = "UNEXPECTED_ERROR"
    this.fullMessage = {
      name: this.name,
      message: this.message
    }
    this.httpErrorCode = 500
  }
}

export class MissingArguments extends Error{
  private fullMessage: object
  private httpErrorCode: number

  constructor(args: string){
    super("Estão faltando argumentos: "+ args)
    this.name = "MISSING_ARGUMENTS"
    this.fullMessage = {
      name: this.name,
      message: this.message
    }
    this.httpErrorCode = 400
  }
}

export class NotFound extends Error{
  private fullMessage: object
  private httpErrorCode: number

  constructor(){
    super("Não foi encontrado nenhum resultado.")
    this.name = "NOT_FOUND"
    this.fullMessage = {
      name: this.name,
      message: this.message
    }
    this.httpErrorCode = 404
  }
}

export class InvalidArgument extends Error{
  private fullMessage: object
  private httpErrorCode: number = 422;

  constructor(args: string){
    super("Argumento inválido: "+ args)
    this.name = "INVALID_ARGUMENT"
    this.fullMessage = {
      name: this.name,
      message: this.message
    }
    this.httpErrorCode = 422
  }
}

export class AlreadyExists extends Error{
  private fullMessage: object
  private httpErrorCode: number

  constructor(){
    super("Isso já existe.")
    this.name = "ALREADY_EXISTS"
    this.fullMessage = {
      name: this.name,
      message: this.message
    }
    this.httpErrorCode = 409
  }
}