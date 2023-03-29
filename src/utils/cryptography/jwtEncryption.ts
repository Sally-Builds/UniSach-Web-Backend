import jwt from 'jsonwebtoken'
import { JwtVerify } from './interface/cryptography/jsonwebtoken/verify'
import { JwtGenerate } from './interface/cryptography/jsonwebtoken/generate'
import Token from './interface/cryptography/jsonwebtoken/token'

export class JwtAdapter implements JwtGenerate, JwtVerify {
  async sign (id: string, jwtSecret: string, jwtExpiresIn: string): Promise<string> {
    const token = await jwt.sign({ id }, jwtSecret as jwt.Secret, { expiresIn: jwtExpiresIn })
    return token
  }

  async verify (token: string, jwtSecret: string): Promise<Token | jwt.JsonWebTokenError> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, jwtSecret as jwt.Secret, (err, payload) => {
        if (err) return reject(err)

        resolve(payload as Token)
      })
    })
  }
}