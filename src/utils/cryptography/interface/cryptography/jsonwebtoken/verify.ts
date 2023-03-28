import Token from './token'
import jwt from 'jsonwebtoken'
export interface JwtVerify {
    verify(token: string, jwtSecret: string): Promise<Token | jwt.JsonWebTokenError>
}