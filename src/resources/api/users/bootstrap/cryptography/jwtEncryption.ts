import jwt from 'jsonwebtoken'
import { JwtVerify } from '../../interfaces/cryptography/jsonwebtoken/verify'
import { JwtGenerate } from '../../interfaces/cryptography/jsonwebtoken/generate'
import Token from '../../interfaces/cryptography/jsonwebtoken/token'

export class JwtAdapter implements JwtGenerate, JwtVerify {
  constructor (
        private readonly jwtSecret: string,
        private readonly jwtExpiresIn: string
  ) {}

  async sign (payload: string): Promise<string> {
    const token = await jwt.sign({ id: payload }, this.jwtSecret as jwt.Secret, { expiresIn: this.jwtExpiresIn })
    return token
  }

  async verify (token: string): Promise<Token | jwt.JsonWebTokenError> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, this.jwtSecret as jwt.Secret, (err, payload) => {
        if (err) return reject(err)

        resolve(payload as Token)
      })
    })
  }
}