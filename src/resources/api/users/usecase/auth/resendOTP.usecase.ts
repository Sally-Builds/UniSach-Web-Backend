import Exception from "@/utils/exception/Exception";
import ResendOTP, {OtpArtifacts} from "../../interfaces/usecases/auth/resendOTP.interface";
import EmailInterface from "../../../email/email.interface";
import randomstring from 'randomstring'
import crypto from 'crypto'
import UserRepositoryInterface from "../../interfaces/userRepo.interface";

export default class ResendOTPUsecase implements ResendOTP {
    constructor(private readonly userRepository: UserRepositoryInterface, private Email: EmailInterface) {}

    async execute(email: string): Promise<string> {
        try {
            // check if email exist
            const isUser = await this.userRepository.getUserByEmail(email);

            if(!isUser) throw new Exception("email not found", 404)

            if(isUser.emailVerificationStatus == 'active') throw new Exception("User already verified", 400)
            //1) generate otp
            const {OTP, OTPHash, expiresIn} = this.otpGenerator()

            //2) persist to db
            const user = await this.userRepository.findOneAndUpdate({email}, {verificationCode: OTPHash, confirmationCodeExpiresIn: expiresIn})
            
            await this.Email.EmailVerification(OTP, email,  (user as any).first_name)
            return "Verification code sent to email."
        } catch (error:any) {
            throw new Exception(error.message, error.statusCode)
        }
    }

    otpGenerator(): OtpArtifacts.Response {
        const OTP = randomstring.generate({
            length: 6,
            charset: 'alphanumeric',
            capitalization: "uppercase"
          });
        
          const OTPHash = crypto.createHash('sha256').update(OTP).digest('hex');
        
          const expiresIn = Date.now() + 2 * 60 * 5000;

          return {OTP, OTPHash, expiresIn}
    }
}