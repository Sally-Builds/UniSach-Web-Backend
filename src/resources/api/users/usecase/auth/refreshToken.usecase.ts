import { JwtGenerate } from "@/utils/cryptography/interface/cryptography/jsonwebtoken/generate";
import { JwtVerify } from "@/utils/cryptography/interface/cryptography/jsonwebtoken/verify";
import Exception from "@/utils/exception/Exception";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import RefreshToken, {RefreshTokenResponse} from "../../interfaces/usecases/auth/refreshToken.interface";
import UserRepositoryInterface from "../../interfaces/userRepo.interface";



export default class RefreshTokenUsecase implements RefreshToken {
    constructor(private readonly userRepo: UserRepositoryInterface, private readonly jwtVerify: JwtVerify, private readonly jwtGenerate: JwtGenerate) {}
    async execute(refreshToken: string): Promise<RefreshTokenResponse.Response> {
        try {

            const foundUser = await this.userRepo.findOne({refreshToken})

            if(!foundUser) {
                const decoded = await this.jwtVerify.verify(refreshToken, String(process.env.REFRESH_TOKEN_SECRET))
                if(decoded instanceof JsonWebTokenError) throw new Exception('forbidden', 403)

                const hackedUser = await this.userRepo.findOne({_id: decoded.id})
                if(hackedUser) await this.userRepo.findOneAndUpdate({_id: (hackedUser as any).id}, {refreshToken: []})

                throw new Exception('forbidden', 403)
                
            }

            const newRefreshTokenArray = foundUser.refreshToken?.filter((rt: string) => rt != refreshToken);

            const refToken = await this.jwtVerify.verify(refreshToken, String(process.env.REFRESH_TOKEN_SECRET))
            
            if(refToken instanceof TokenExpiredError) {
                await this.userRepo.findOneAndUpdate({_id: (foundUser as any).id}, {refreshToken: newRefreshTokenArray})
            }

            if(refToken instanceof JsonWebTokenError || refToken.id != (foundUser as any).id) throw new Exception("forbidden", 403)

            const newRefreshToken = await this.jwtGenerate.sign((foundUser as any).id, String(process.env.REFRESH_TOKEN_SECRET), String(process.env.REFRESH_TOKEN_EXPIRES_IN))
            const accessToken = await this.jwtGenerate.sign((foundUser as any).id, String(process.env.ACCESS_TOKEN_SECRET), String(process.env.ACCESS_TOKEN_EXPIRES_IN))

            newRefreshTokenArray?.push(newRefreshToken)
            await this.userRepo.findOneAndUpdate({_id: (foundUser as any).id}, {refreshToken: newRefreshTokenArray})

            return {accessToken, refreshToken: newRefreshToken}
        } catch (error:any) {
            throw new Exception(error.message, error.statusCode)
        }
    }
}