import Exception from "@/utils/exception/Exception";
import VerifyOTP from "../interfaces/usecases/verifyOTP.interface";
import crypto from 'crypto'
import UserRepository from "../repository";


export default class VerifyOTPUsecase implements VerifyOTP {

    constructor(private readonly UserRepository: UserRepository){}

    async execute(email: string, OTP: string): Promise<string> {
        try {
            const hashedToken = crypto.createHash('sha256').update(OTP).digest('hex')

            const user = await this.UserRepository.findOne({email, confirmationCodeExpiresIn: {$gt: Date.now()}, verificationCode: hashedToken})

            if(!user) throw new Exception("Wrong OTP or Expired OTP", 400)

            await this.UserRepository.findOneAndUpdate({email: user.email}, {emailVerificationStatus: 'active'})

            return "successful"
        } catch (error:any) {
            throw new Exception(error.message, error.statuscode)
        }
    }
}