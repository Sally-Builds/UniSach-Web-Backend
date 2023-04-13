import { Request, Response, NextFunction } from "express"
import Exception from "@/utils/exception/Exception"
import { JwtAdapter } from "@/utils/cryptography/jwtEncryption"
import { JsonWebTokenError } from "jsonwebtoken"
import UserRepository from "@/resources/api/users/repository"

async function authenticate (req:Request, res:Response, next:NextFunction): Promise<Response | void> {
    const bearer = req.headers.authorization

    if(!bearer || !bearer.startsWith('Bearer')){
        return next(new Exception('Unauthorized access', 401))
    }
    const accessToken = bearer.split('Bearer ')[1]
    try {

        const jwtAdapter = new JwtAdapter()
        const userRepo = new UserRepository()

        const decoded = await jwtAdapter.verify(accessToken, String(process.env.ACCESS_TOKEN_SECRET))

        if(decoded instanceof JsonWebTokenError) return next(new Exception('Unauthorized access', 401))

        const user = await userRepo.findOne({_id: decoded.id})

        if(!user) return next(new Exception('Unauthorized access', 401))
        if(user?.refreshToken?.length == 0) {
            res.clearCookie('refreshToken', {httpOnly: true, })
            return next(new Exception('Forbidden', 403))
        }

        user.password = undefined
        user.confirmationCodeExpiresIn = undefined
        user.refreshToken = undefined
        user.passwordResetTokenExpiresIn = undefined
        user.passwordResetToken = undefined
        user.verificationCode = undefined
         
        req.user = user
        next()
    } catch (error:any) {
        next(new Exception(error.message, error.statusCode))
    }
}

export default authenticate