import Exception from "@/utils/exception/Exception";
import LoginInterface, {Login} from "../interfaces/usecases/login.interface";
import UserRepositoryInterface from "../interfaces/userRepo.interface";
import PasswordEncryption from "../../../../utils/cryptography/interface/cryptography/passwordEncryption";
import { JwtGenerate } from "../../../../utils/cryptography/interface/cryptography/jsonwebtoken/generate";
import ResendOTP from "../interfaces/usecases/resendOTP.interface";

export default class LoginUsecase implements LoginInterface {

    constructor(private readonly UserRepo: UserRepositoryInterface,  private readonly jwtGen: JwtGenerate,  private readonly PasswordEncrypt: PasswordEncryption, private readonly resentOTP: ResendOTP){}

    public async execute(email: string, password: string): Promise<Login.Response> {
        try {
            const user = await this.UserRepo.getUserByEmail(email);

            if(!user) throw new Exception("Email or Password is incorrect", 400);

            if(user.googleID) throw new Exception("Email or Password is incorrect", 400)

            const isCorrectPassword = await this.PasswordEncrypt.verify((user as any).password, password)

            if(!isCorrectPassword) throw new Exception("Email or Password is incorrect", 400);

            if(user.emailVerificationStatus == 'pending') {
                await this.resentOTP.execute(user.email)
                return {
                    email: user.email,
                    message: "Please verify your email to continue your Registration process"
                }
            }

            const accessToken = await this.jwtGen.sign((user as any).id, String(process.env.ACCESS_TOKEN_SECRET), '30s')
            const refreshToken = await this.jwtGen.sign((user as any).id, String(process.env.REFRESH_TOKEN_SECRET), '1d')

            await this.UserRepo.findOneAndUpdate({_id: (user as any).id}, {$push: { refreshToken: refreshToken}})
            
            user.password = undefined;
            user.verificationCode = undefined
            user.confirmationCodeExpiresIn = undefined
            user.passwordResetTokenExpiresIn = undefined
            user.passwordResetToken = undefined
            user.refreshToken = undefined

            return {
                user: user,
                accessToken,
                refreshToken
            }

        } catch (error:any) {
            throw new Exception(error.message, error.statusCode)
        }
    }
}

