import Exception from "@/utils/exception/Exception";
import VerifyOTPInterface, {VerifyOTP} from "../interfaces/usecases/verifyOTP.interface";
import crypto from 'crypto'
import UserRepositoryInterface from "../interfaces/userRepo.interface";
import EmailInterface from "../../email/email.interface";
import { JwtGenerate } from "../interfaces/cryptography/jsonwebtoken/generate";


export default class VerifyOTPUsecase implements VerifyOTPInterface {

    constructor(private readonly UserRepository: UserRepositoryInterface, private jwtGen: JwtGenerate, private readonly Email: EmailInterface){}

    async execute(email: string, OTP: string): Promise<VerifyOTP.Response> {
        try {
            const hashedToken = crypto.createHash('sha256').update(OTP).digest('hex')

            const user = await this.UserRepository.findOne({email, confirmationCodeExpiresIn: {$gt: Date.now()}, verificationCode: hashedToken})

            if(!user) throw new Exception("Wrong OTP or Expired OTP", 400)

            await this.UserRepository.findOneAndUpdate({email: user.email}, {emailVerificationStatus: 'active'})

            user.password = undefined;
            user.verificationCode = undefined
            user.confirmationCodeExpiresIn = undefined
            user.emailVerificationStatus = 'active'

            const token = await this.jwtGen.sign((user as any).id)
            let res = {user, token}

            await this.Email.sendWelcome('http://localhost:3000/login', user.email, (user as any).first_name)

            return res
        } catch (error:any) {
            throw new Exception(error.message, error.statuscode)
        }
    }
}