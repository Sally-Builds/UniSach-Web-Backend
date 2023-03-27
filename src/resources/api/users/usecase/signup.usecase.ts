import Exception from "@/utils/exception/Exception";
import SignupInterface, { OtpArtifacts, Signup } from "../interfaces/usecases/signup.interface";
import UserRepositoryInterface from "../interfaces/userRepo.interface";
import { Role } from "../interfaces/user.interface";
import PasswordEncryption from "../interfaces/cryptography/passwordEncryption";
import { JwtGenerate } from "../interfaces/cryptography/jsonwebtoken/generate";
import randomstring from 'randomstring'
import crypto from 'crypto'
import EmailInterface from "../../email/email.interface";

export default class SignupUsecase implements SignupInterface {

    constructor(private readonly userRepository: UserRepositoryInterface, private EncryptPassword: PasswordEncryption, private readonly Email: EmailInterface) {}

    public async execute(first_name: string, last_name: string, email: string, password: string, role: string): Promise<Signup.Response> {
        try {
            if(!Object.values(Role).includes(role as Role)) throw new Exception('role not valid', 400)

            //1) check if user already exist
            const isExist = await this.userRepository.getUserByEmail(email)
            if(isExist) throw new Exception("email already exist", 400)

            //2) verify that password is valid
            if(password.length < 8) throw new Exception('password must be greater than 8 characters', 400)

            //3) hash password
            const passwordHash = await this.EncryptPassword.hash(password)

            //4) generate otp
            const {OTP, OTPHash, expiresIn} = this.otpGenerator()

            //5) persist to db
            const user = await this.userRepository.createUser({
                first_name,
                last_name,
                name: `${first_name} ${last_name}`,
                email,
                password: passwordHash, 
                role, 
                emailVerificationStatus: 'pending',
                verificationCode: OTPHash,
                confirmationCodeExpiresIn: expiresIn,
            })
            
            this.Email.EmailVerification(OTP, email,  first_name)

            return "Verify your email to get started."
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