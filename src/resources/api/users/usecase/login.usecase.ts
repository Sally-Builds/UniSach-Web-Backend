import Exception from "@/utils/exception/Exception";
import LoginInterface, {Login} from "../interfaces/usecases/login.interface";
import UserRepositoryInterface from "../interfaces/userRepo.interface";
import PasswordEncryption from "../interfaces/cryptography/passwordEncryption";
import { JwtGenerate } from "../interfaces/cryptography/jsonwebtoken/generate";
import ResendOTP from "../interfaces/usecases/resendOTP.interface";

export default class LoginUsecase implements LoginInterface {

    constructor(private readonly UserRepo: UserRepositoryInterface,  private readonly jwtGen: JwtGenerate,  private readonly PasswordEncrypt: PasswordEncryption, private readonly resentOTP: ResendOTP){}

    public async execute(email: string, password: string): Promise<Login.Response> {
        try {
            const user = await this.UserRepo.getUserByEmail(email);

            if(!user) throw new Exception("Email or Password is incorrect", 400);

            if(user.googleID) throw new Exception("Email or Password is incorrect", 400)

            const isCorrectPassword = await this.PasswordEncrypt.verify((user as any).password, password)
            console.log(isCorrectPassword)

            if(!isCorrectPassword) throw new Exception("Email or Password is incorrect", 400);

            if(user.emailVerificationStatus == 'pending') {
                await this.resentOTP.execute(user.email)
                return {
                    email: user.email,
                    message: "Please verify your email to continue your Registration process"
                }
            }

            const token = await this.jwtGen.sign((user as any).id)
            user.password = undefined;
            user.verificationCode = undefined
            user.confirmationCodeExpiresIn = undefined
            user.passwordResetTokenExpiresIn = undefined
            user.passwordResetToken = undefined

            return {
                user: user,
                token: token
            }

        } catch (error:any) {
            throw new Exception(error.message, error.statusCode)
        }
    }
}

