import Token from './token'
import jwt from 'jsonwebtoken'
export interface JwtVerify {
    verify(token: string): Promise<Token | jwt.JsonWebTokenError>
}