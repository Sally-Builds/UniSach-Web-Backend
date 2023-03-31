import Exception from "@/utils/exception/Exception";
import VerifyOTPInterface, {GenerateToken, VerifyOTP} from "../../interfaces/usecases/auth/verifyOTP.interface";
import crypto from 'crypto'
import UserRepositoryInterface from "../../interfaces/userRepo.interface";
import EmailInterface from "../../../email/email.interface";
import { JwtGenerate } from "../../../../../utils/cryptography/interface/cryptography/jsonwebtoken/generate";
import User from "../../interfaces/user.interface";


export default class VerifyOTPUsecase implements VerifyOTPInterface {

    constructor(private readonly UserRepository: UserRepositoryInterface, private jwtGen: JwtGenerate, private readonly Email: EmailInterface){}

    async execute(email: string, OTP: string, refreshToken: string): Promise<VerifyOTP.Response> {
        try {
            const hashOTP = this.encryptOTP(OTP)

            const user = await this.UserRepository.findOne({email, confirmationCodeExpiresIn: {$gt: Date.now()}, verificationCode: hashOTP})

            if(!user) throw new Exception("Wrong OTP or Expired OTP", 400)

            const newRefreshTokenArray = !refreshToken ? user.refreshToken : user.refreshToken?.filter((rt: string) => rt != refreshToken) 
           
            const {accessToken, newRefreshToken} = await this.generateTokens((user as any).id)
            let res = {user, accessToken, refreshToken: newRefreshToken}

            newRefreshTokenArray?.push(newRefreshToken)
            await this.UserRepository.findOneAndUpdate({_id: (user as any).id}, {refreshToken: newRefreshTokenArray, emailVerificationStatus: 'active'})
            await this.Email.sendWelcome('http://localhost:3000/login', user.email, (user as any).first_name)

            this.removeUnwantedFields(user)

            return res
        } catch (error:any) {
            throw new Exception(error.message, error.statuscode)
        }
    }

    encryptOTP(OTP: string): string {
        return crypto.createHash('sha256').update(OTP).digest('hex')
    }
    
    async generateTokens(id: string): Promise<GenerateToken.Response> {
        const accessToken = await this.jwtGen.sign(id, String(process.env.ACCESS_TOKEN_SECRET), String(process.env.ACCESS_TOKEN_EXPIRES_IN))
        const newRefreshToken = await this.jwtGen.sign(id, String(process.env.REFRESH_TOKEN_SECRET), String(process.env.REFRESH_TOKEN_EXPIRES_IN))
        
        return {accessToken, newRefreshToken}
    }

    removeUnwantedFields(user: User) {
        user.password = undefined;
        user.verificationCode = undefined
        user.confirmationCodeExpiresIn = undefined
        user.emailVerificationStatus = 'active'
        user.refreshToken = undefined
    }
}