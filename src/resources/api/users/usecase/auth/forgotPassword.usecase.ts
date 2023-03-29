import crypto from 'crypto'
import Exception from "@/utils/exception/Exception";
import ForgotPassword, { linkArtifacts } from "../../interfaces/usecases/auth/forgotPassword.interface";
import UserRepositoryInterface from "../../interfaces/userRepo.interface";
import EmailInterface from "../../../email/email.interface";


export default class ForgotPasswordUsecase implements ForgotPassword {

    constructor(private readonly userRepo: UserRepositoryInterface, private readonly email: EmailInterface) {}

    public async execute(email: string): Promise<string> {
        try {
            // check if email exist
            const user = await this.userRepo.getUserByEmail(email)
            if(!user) throw new Exception("not found", 404)
            if(user.googleID) throw new Exception("Not valid for this user", 400)

            //generate link artifacts
            const {link, expiresIn, passwordResetTokenHash} = this.linkGenerator()

            //persist to db
            await this.userRepo.findOneAndUpdate({email}, {passwordResetToken: passwordResetTokenHash, passwordResetTokenExpiresIn: expiresIn})

            await this.email.sendPasswordReset(link, user.email, user.name)

            return "Check your email"
        } catch (error:any) {
            throw new Exception(error.message, error.statusCode)
        }
    }


    linkGenerator(): linkArtifacts.Response {
        const resetToken = crypto.randomBytes(32).toString('hex');
        const link = `${process.env.RESET_PASSWORD_URL}/${resetToken}`

        const passwordResetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
        const expiresIn = Date.now() + 10 * 60 * 5000;

        return {link, passwordResetTokenHash, expiresIn}
    }
}