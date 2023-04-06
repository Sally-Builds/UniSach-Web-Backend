import PasswordReset from "../../interfaces/usecases/auth/passwordReset.interface";
import crypto from 'crypto'
import PasswordEncryption from "@/utils/cryptography/interface/cryptography/passwordEncryption";
import UserRepositoryInterface from "../../interfaces/userRepo.interface";
import Exception from "@/utils/exception/Exception";

export default class PasswordResetUsecase implements PasswordReset {

    constructor(private readonly userRepo: UserRepositoryInterface, private readonly passwordEncrypt: PasswordEncryption) {}

    public async execute(passwordResetToken: string, password: string): Promise<string> {
        try {
            const hashedToken = crypto.createHash('sha256').update(passwordResetToken).digest('hex');

            const user = await this.userRepo.findOne({passwordResetToken: hashedToken, passwordResetTokenExpiresIn: {$gt: Date.now()}})

            if(!user) throw new Exception('Token is invalid or has expired', 400);

            const hashedPassword = await this.passwordEncrypt.hash(password)

            await this.userRepo.findOneAndUpdate({email: user.email}, {password: hashedPassword})

            return 'Password reset successful'
        } catch (error:any) {
            throw new Exception(error.message, error.statusCode)
        }
    }
}