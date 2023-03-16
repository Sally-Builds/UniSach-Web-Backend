import bcrypt from 'bcryptjs'
import PasswordEncryption from '../interfaces/cryptography/passwordEncryption'

export class BcryptAdapter implements PasswordEncryption {
  constructor (private readonly salt: number) {}

  async hash (password: string): Promise<string> {
    const hash = await bcrypt.hash(password, this.salt)
    return hash
  }

  async verify (dbPassword: string, inputtedPassword: string): Promise<boolean> {
    return await bcrypt.compare(inputtedPassword, dbPassword)
  }
}